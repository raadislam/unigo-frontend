import argparse
import json
import os
import re
import time
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, urlparse
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from xml.etree import ElementTree

REQUIRED_SLUGS = {"japan", "australia", "maldives", "viet-nam"}
SCHENGEN_ISO2 = {
    "AT", "BE", "BG", "HR", "CZ", "DK", "EE", "FI", "FR", "DE",
    "GR", "HU", "IS", "IT", "LV", "LI", "LT", "LU", "MT", "NL",
    "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "CH",
}


class PageInspector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title_parts = []
        self.text_parts = []
        self.anchors = set()
        self.images = []
        self.meta = {}
        self.canonical = ""
        self.in_title = False
        self.skip_depth = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag in {"script", "style"}:
            self.skip_depth += 1
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            name = (values.get("name") or "").lower()
            prop = (values.get("property") or "").lower()
            if name:
                self.meta[name] = values.get("content", "")
            if prop:
                self.meta[prop] = values.get("content", "")
        if tag == "link" and "canonical" in (values.get("rel") or "").lower().split():
            self.canonical = values.get("href", "")
        if tag == "a" and values.get("href"):
            self.anchors.add(values["href"])
        if tag == "img":
            self.images.append({
                "src": values.get("src", ""),
                "alt": values.get("alt", ""),
                "loading": values.get("loading", ""),
                "decoding": values.get("decoding", ""),
                "class": values.get("class", ""),
            })

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag in {"script", "style"} and self.skip_depth:
            self.skip_depth -= 1

    def handle_data(self, data):
        if self.in_title:
            self.title_parts.append(data)
        if not self.skip_depth:
            self.text_parts.append(data)

    @property
    def title(self):
        return " ".join(self.title_parts).strip()

    @property
    def text(self):
        return " ".join(self.text_parts).strip()


def fetch_bytes(url):
    request = Request(url, headers={"User-Agent": "UniGo-Country-Parity-Check/1.0", "Accept": "text/html,application/xml,application/json,image/svg+xml,*/*"})
    last_error = None
    for attempt in range(4):
        try:
            with urlopen(request, timeout=45) as response:
                body = response.read()
                status = response.status
            if status != 200 or not body:
                raise SystemExit(f"HTTP verification failed: {url} returned {status} or an empty body.")
            return body
        except HTTPError as error:
            last_error = error
            if error.code not in {429, 500, 502, 503, 504} or attempt == 3:
                raise SystemExit(f"HTTP {error.code} while fetching {url}") from error
        except (URLError, TimeoutError) as error:
            last_error = error
            if attempt == 3:
                raise SystemExit(f"Network error while fetching {url}: {error}") from error
        time.sleep(2 ** attempt)
    raise SystemExit(f"Unable to fetch {url}: {last_error}")


def parse_html(body, label):
    parser = PageInspector()
    try:
        parser.feed(body.decode("utf-8", errors="replace"))
        parser.close()
    except Exception as error:
        raise SystemExit(f"Could not parse HTML for {label}: {error}")
    return parser


def expected_countries(path):
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(payload, list) or not payload:
        raise SystemExit("Expected country snapshot is missing or empty.")
    slugs = [item.get("slug", "") for item in payload]
    if len(set(slugs)) != len(slugs) or any(not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) for slug in slugs):
        raise SystemExit("Expected country snapshot contains duplicate or invalid slugs.")
    missing = REQUIRED_SLUGS - set(slugs)
    if missing:
        raise SystemExit("Required countries missing from public API directory: " + ", ".join(sorted(missing)))
    return payload


def country_slugs_from_sitemap(body, label):
    try:
        root = ElementTree.fromstring(body)
    except ElementTree.ParseError as error:
        raise SystemExit(f"{label} is not valid XML: {error}")
    slugs = set()
    for node in root.iter():
        if node.tag.rsplit("}", 1)[-1] != "loc" or not node.text:
            continue
        path = urlparse(node.text.strip()).path.strip("/")
        parts = path.split("/")
        if len(parts) == 2 and parts[0] == "visa-services":
            slugs.add(parts[1])
    return slugs


def static_country_slugs(site_dir):
    root = Path(site_dir) / "visa-services"
    if not root.is_dir():
        raise SystemExit("Static visa-services directory is missing.")
    return {
        item.name
        for item in root.iterdir()
        if item.is_dir() and (item / "index.html").is_file() and (item / "index.html").stat().st_size > 0
    }


def normalize_text(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


FLAG_SMOKE_CODES = {
    "ID", "MU", "NP", "PH", "TR", "BN", "RW", "TZ", "HK", "MO", "UZ", "KR",
    "AM", "AZ", "PK", "TL", "BB", "JM", "FJ", "KI", "NZ", "TO", "VU", "AS",
    "CK", "GU", "MP", "NF", "NC", "PF", "WF", "PN", "TK", "AO", "BJ", "BW",
    "GM", "MZ", "NG", "AL", "IE", "MD", "ME", "RS", "KY", "BM", "PA", "MX", "BO", "CU", "HT", "AC", "TA",
}

FLAG_FALLBACK_SOURCES = {
    "ac": "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Ascension_Island.svg",
    "ta": "https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Tristan_da_Cunha.svg",
}


def flag_asset_url(code):
    normalized = str(code or "").strip().lower()
    return FLAG_FALLBACK_SOURCES.get(normalized, f"https://flagcdn.com/{normalized}.svg")


def verify_flag_component_source():
    component = Path("src/components/shared/country-flag.tsx")
    if not component.is_file():
        raise SystemExit("Shared country flag component is missing.")
    source = component.read_text(encoding="utf-8")
    required = (
        '"use client"',
        'const code = (iso2 ?? "").trim().toLowerCase();',
        "/^[a-z]{2}$/",
        "https://flagcdn.com/${code}.svg",
        "FLAG_FALLBACK_SOURCES",
        "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Ascension_Island.svg",
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Tristan_da_Cunha.svg",
        'alt={`${name} flag`}',
        'loading="lazy"',
        'decoding="async"',
        "object-contain",
        "onError",
        "flag unavailable",
    )
    for marker in required:
        if marker not in source:
            raise SystemExit(f"Shared country flag component is missing required behavior: {marker}.")
    if "🌍" in source or "flag_emoji" in source or "fromCodePoint" in source or "String.fromCharCode" in source:
        raise SystemExit("Shared country flag component contains an emoji or generated-flag fallback.")
    for path in Path("src").rglob("*"):
        if path.suffix not in {".ts", ".tsx", ".js", ".jsx"}:
            continue
        content = path.read_text(encoding="utf-8", errors="replace")
        if path != component and "flagcdn.com/" in content:
            raise SystemExit(f"Direct flag asset implementation remains outside the shared component: {path}.")
        if "flag_emoji" in content:
            raise SystemExit(f"Country flag emoji data remains in country UI source: {path}.")
        if any(0x1F1E6 <= ord(char) <= 0x1F1FF for char in content):
            raise SystemExit(f"Regional-indicator flag characters remain in source: {path}.")
    print("Shared SVG flag component source, invalid-code fallback and duplicate-implementation checks passed.")


def verify_country_flag_images(parser, countries, label):
    for country in countries:
        code = str(country.get("iso2") or "").strip().lower()
        name = str(country.get("name") or "")
        if not re.fullmatch(r"[a-z]{2}", code) or not name:
            raise SystemExit(f"{label} contains a country without a valid ISO-2 code or name.")
        expected_url = flag_asset_url(code)
        matches = [image for image in parser.images if image.get("src") == expected_url]
        if not matches:
            raise SystemExit(f"{label} is missing the SVG flag image for {name} ({code.upper()}).")
        image = matches[0]
        if image.get("alt") != f"{name} flag":
            raise SystemExit(f"{label} has incorrect accessible flag alt text for {name}.")
        if image.get("loading") != "lazy" or image.get("decoding") != "async":
            raise SystemExit(f"{label} flag image for {name} is missing lazy loading or async decoding.")
        if "object-contain" not in image.get("class", "").split():
            raise SystemExit(f"{label} flag image for {name} is missing object-contain sizing.")


def verify_flag_asset_responses(countries, label):
    dynamic_country_codes = {str(country.get("iso2") or "").strip().upper() for country in countries if re.fullmatch(r"[A-Za-z]{2}", str(country.get("iso2") or "").strip())}
    required_codes = FLAG_SMOKE_CODES | {"AU", "AT", "BE"} | dynamic_country_codes
    print(f"{label} SVG network coverage includes {len(dynamic_country_codes)} live country codes plus regression smoke codes.")
    if not countries:
        raise SystemExit(f"{label} has no countries available for flag asset verification.")
    for code in sorted(required_codes):
        url = flag_asset_url(code)
        request = Request(url, headers={"User-Agent": "UniGo-Flag-Asset-Check/1.0", "Accept": "image/svg+xml"})
        last_error = None
        for attempt in range(4):
            try:
                with urlopen(request, timeout=30) as response:
                    body = response.read()
                    status = response.status
                    content_type = response.headers.get_content_type()
                break
            except HTTPError as error:
                last_error = error
                if error.code not in {429, 500, 502, 503, 504} or attempt == 3:
                    raise SystemExit(f"{label} could not load the {code} SVG flag asset: HTTP {error.code}") from error
            except (URLError, TimeoutError) as error:
                last_error = error
                if attempt == 3:
                    raise SystemExit(f"{label} could not load the {code} SVG flag asset: {error}") from error
            time.sleep(2 ** attempt)
        else:
            raise SystemExit(f"{label} could not load the {code} SVG flag asset: {last_error}")
        if status != 200 or not body or b"<svg" not in body[:4096] or content_type not in {"image/svg+xml", "application/xml", "text/xml"}:
            raise SystemExit(f"{label} flag asset check failed for {code}: HTTP {status}, content type {content_type}.")
        print(f"FLAG_ASSET_HTTP_200 {code} {urlparse(url).netloc} {content_type}")
    print(f"{label} verified {len(required_codes)} live SVG flag assets, including exceptional territory fallbacks.")


def require_visible(parser, value, field, label):
    expected = normalize_text(value)
    if expected and expected.casefold() not in normalize_text(parser.text).casefold():
        raise SystemExit(f"{label} does not render the API {field} value.")


def validate_country_page(parser, country, base_url, label):
    slug = country["slug"]
    name = country["name"]
    canonical = f"{base_url.rstrip('/')}/visa-services/{slug}/"
    title = parser.title or parser.meta.get("og:title", "")
    description = parser.meta.get("description", "")
    og_title = parser.meta.get("og:title", "")
    og_url = parser.meta.get("og:url", "")
    robots = parser.meta.get("robots", "").lower()
    visible = normalize_text(parser.text).casefold()

    if name.casefold() not in visible:
        raise SystemExit(f"{label} does not render the expected country name: {name}.")
    verify_country_flag_images(parser, [country], label)
    if name.casefold() not in title.casefold():
        raise SystemExit(f"{label} title/OG title does not include the country name: {name}.")
    if not description.strip():
        raise SystemExit(f"{label} is missing its SEO description.")

    expected_description = (
        country.get("seo_description")
        or country.get("short_description")
        or f"Explore {name} visa requirements for Bangladeshi passport holders, entry rules, required documents and visa assistance from UniGo Bangladesh."
    )
    if normalize_text(description) != normalize_text(expected_description):
        raise SystemExit(f"{label} SEO description does not match the country API data.")

    if country.get("seo_title") and country["seo_title"].casefold() not in og_title.casefold():
        raise SystemExit(f"{label} Open Graph title does not match the country API SEO title.")
    if parser.canonical.rstrip("/") + "/" != canonical:
        raise SystemExit(f"{label} canonical is missing or incorrect: {parser.canonical!r}.")
    if og_url.rstrip("/") + "/" != canonical:
        raise SystemExit(f"{label} Open Graph URL is missing or incorrect: {og_url!r}.")
    if "noindex" in robots:
        raise SystemExit(f"{label} is marked noindex.")

    for field in ("short_description", "overview", "visa_information", "capital"):
        require_visible(parser, country.get(field), field, label)

    requirement = country.get("requirement")
    if requirement is None:
        if "no currently published and verified tourism requirement is available" not in visible:
            raise SystemExit(f"{label} does not explain that no verified tourism requirement is currently published.")
        return

    if requirement.get("passport_nationality_iso3") != "BGD" or requirement.get("travel_purpose") != "tourism":
        raise SystemExit(f"{label} contains a requirement for the wrong passport nationality or travel purpose.")
    if requirement.get("verification_status") != "verified" or requirement.get("is_published") is not True:
        raise SystemExit(f"{label} contains a requirement that is not verified and published.")

    for phrase in ("Bangladeshi ordinary passport", "Travel purpose: Tourism", "Visa and entry requirements", "Verified information"):
        if phrase.casefold() not in visible:
            raise SystemExit(f"{label} is missing the expected verified-requirement section text: {phrase}.")

    text_fields = (
        "requirement_type",
        "maximum_permitted_stay",
        "entry_count",
        "application_fee",
        "processing_time",
        "application_channel",
        "passport_validity_rule",
        "blank_passport_pages_rule",
        "return_ticket_rule",
        "proof_of_funds_rule",
        "accommodation_rule",
        "travel_insurance_rule",
        "health_requirements",
        "transit_requirements",
    )
    for field in text_fields:
        require_visible(parser, requirement.get(field), field, label)

    boolean_fields = (
        ("Visa required", "visa_required"),
        ("Visa free", "visa_free_available"),
        ("Visa on arrival", "visa_on_arrival_available"),
        ("eVisa available", "evisa_available"),
    )
    for field_label, field in boolean_fields:
        value = requirement.get(field)
        expected_value = "Yes" if value is True else "No" if value is False else "Not specified"
        if field_label.casefold() not in visible or expected_value.casefold() not in visible:
            raise SystemExit(f"{label} is missing the rendered {field_label} value.")

    for document in requirement.get("required_documents") or []:
        require_visible(parser, document, "required document", label)

    iso2 = str(country.get("iso2") or "").upper()
    applicant_checklists = requirement.get("applicant_checklists") or []
    expected_applicant_types = {
        "employee",
        "self_employed_or_business_owner",
        "student",
        "retired",
    }
    actual_applicant_types = {
        checklist.get("applicant_type")
        for checklist in applicant_checklists
        if isinstance(checklist, dict)
    }
    if iso2 in SCHENGEN_ISO2 and (
        len(applicant_checklists) != 4
        or actual_applicant_types != expected_applicant_types
    ):
        raise SystemExit(f"{label} does not expose all four Schengen applicant-specific checklist profiles.")

    for checklist in applicant_checklists:
        documents = checklist.get("documents") or []
        if not documents:
            raise SystemExit(f"{label} has an empty applicant checklist: {checklist.get('applicant_type')}.")
        for document in documents:
            require_visible(parser, document.get("name"), "applicant-specific checklist document", label)
        checklist_source = checklist.get("source_url")
        if checklist_source and checklist_source not in parser.anchors:
            raise SystemExit(f"{label} is missing an applicant checklist source link.")

    source_backed_fragments = {
        "DE": [
            "Original personal bank statements for at least the last 6 months",
            "Memorandum and Articles of Association",
            "All photocopies on A4 paper",
        ],
        "DK": [
            "Printed and signed Schengen Visa Application Cover Letter generated through ApplyVisa",
            "Completed and signed VU2 online invitation form",
            "Evidence of establishment and ties in Bangladesh",
        ],
        "NL": [
            "Online completed and signed Schengen application form with its unique code",
            "Additional ties where relevant: caregiver evidence",
            "Round-trip airline reservation with Passenger Registration Number",
        ],
        "SE": [
            "Completed, signed and dated Swedish Schengen application form 119031",
            "For self-employed applicants: City Corporation trade licence",
            "For non-Bangladeshi applicants: Bangladesh residence permit valid at least 3 months",
        ],
        "HR": [
            "original bank statements for savings/current accounts covering the last 3 months",
            "salary certificates for the last 3 months",
            "notarised guardian consent",
        ],
    }
    for fragment in source_backed_fragments.get(iso2, []):
        require_visible(parser, fragment, "source-backed applicant checklist", label)

    sources = requirement.get("sources") or []
    if not any(source.get("source_type") == "official" and source.get("is_primary") is True for source in sources):
        raise SystemExit(f"{label} has no published primary official source.")
    for source in sources:
        require_visible(parser, source.get("source_name"), "official source name", label)
        source_url = source.get("source_url")
        if source_url and source_url not in parser.anchors:
            raise SystemExit(f"{label} is missing an official source link from the API.")
    checked_at = requirement.get("official_source_checked_at")
    if checked_at and parser.meta.get("visa-information-last-verified") != checked_at:
        raise SystemExit(f"{label} verification-date metadata does not match the public visa API.")


def verify_directory_links(parser, countries, label):
    missing = sorted(
        country["slug"]
        for country in countries
        if f"/visa-services/{country['slug']}/" not in parser.anchors
    )
    if missing:
        raise SystemExit(f"{label} is missing country-directory links: {', '.join(missing)}")
    verify_country_flag_images(parser, countries, label)


def verify_exact_set(expected, actual, label):
    missing = sorted(expected - actual)
    extra = sorted(actual - expected)
    print(f"{label} missing slugs: {', '.join(missing) if missing else 'none'}")
    print(f"{label} extra slugs: {', '.join(extra) if extra else 'none'}")
    if missing or extra:
        raise SystemExit(f"{label} does not match the authoritative API country directory.")


def snapshot(api_url, expected_file):
    base = api_url.rstrip("/")
    if not base:
        raise SystemExit("NEXT_PUBLIC_API_URL is not configured.")

    content_version = os.environ.get("UNIGO_CONTENT_VERSION", "").strip()
    countries_url = base + "/countries"
    if content_version:
        countries_url += "?content_version=" + quote(content_version, safe="")
    body = fetch_bytes(countries_url)
    payload = json.loads(body.decode("utf-8"))
    if (
        payload.get("success") is not True
        or not isinstance(payload.get("data"), list)
        or not payload["data"]
        or not isinstance(payload.get("meta", {}).get("filters", {}).get("categories"), list)
        or not isinstance(payload.get("meta", {}).get("filters", {}).get("services"), list)
    ):
        raise SystemExit("Public country directory API returned an unsuccessful or empty response.")

    requirements_body = fetch_bytes(base + "/visa-requirements?passport=BGD&purpose=tourism")
    requirements_payload = json.loads(requirements_body.decode("utf-8"))
    if requirements_payload.get("success") is not True or not isinstance(requirements_payload.get("data"), list):
        raise SystemExit("Public BGD tourism visa requirement API returned an unsuccessful or invalid response.")

    requirements_by_iso2 = {}
    for requirement in requirements_payload["data"]:
        country_data = requirement.get("country") or {}
        iso2 = str(country_data.get("iso2") or "").upper()
        if (
            not re.fullmatch(r"[A-Z]{2}", iso2)
            or requirement.get("passport_nationality_iso3") != "BGD"
            or requirement.get("travel_purpose") != "tourism"
            or requirement.get("verification_status") != "verified"
            or requirement.get("is_published") is not True
        ):
            raise SystemExit("Public visa API returned a record outside the verified, published BGD tourism scope.")
        if iso2 in requirements_by_iso2:
            raise SystemExit(f"Public visa API returned duplicate BGD tourism requirements for {iso2}.")
        sources = requirement.get("sources") or []
        if not any(source.get("source_type") == "official" and source.get("is_primary") is True for source in sources):
            raise SystemExit(f"Public visa API record for {iso2} has no primary official source.")
        requirements_by_iso2[iso2] = requirement

    countries = []
    seen_slugs = set()
    seen_iso2 = set()
    for item in payload["data"]:
        slug = item.get("slug", "")
        name = item.get("name", "")
        iso2 = str(item.get("iso2", "")).upper()
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or not name or not re.fullmatch(r"[A-Z]{2}", iso2):
            raise SystemExit("Public country directory API returned a malformed country record.")
        if slug in seen_slugs or iso2 in seen_iso2:
            raise SystemExit(f"Public country directory API returned a duplicate country slug or ISO2: {slug}.")
        seen_slugs.add(slug)
        seen_iso2.add(iso2)

        requirement = requirements_by_iso2.get(iso2)
        if requirement:
            show_url = base + f"/visa-requirements/{iso2}?passport=BGD&purpose=tourism"
            show_payload = json.loads(fetch_bytes(show_url).decode("utf-8"))
            if show_payload.get("success") is not True or not isinstance(show_payload.get("data"), dict):
                raise SystemExit(f"Public visa detail API returned an invalid record for {iso2}.")
            detail_requirement = show_payload["data"]
            if (
                detail_requirement.get("id") != requirement.get("id")
                or detail_requirement.get("passport_nationality_iso3") != "BGD"
                or detail_requirement.get("travel_purpose") != "tourism"
                or detail_requirement.get("verification_status") != "verified"
                or detail_requirement.get("is_published") is not True
            ):
                raise SystemExit(f"Public visa detail API does not match the verified, published list record for {iso2}.")
            list_sources = {
                source.get("source_url")
                for source in requirement.get("sources") or []
                if source.get("source_type") == "official" and source.get("source_url")
            }
            detail_sources = {
                source.get("source_url")
                for source in detail_requirement.get("sources") or []
                if source.get("source_type") == "official" and source.get("source_url")
            }
            if not list_sources.issubset(detail_sources):
                raise SystemExit(f"Public visa detail API is missing official source links for {iso2}.")
            requirement_country = detail_requirement.get("country") or {}
            if requirement_country.get("slug") != slug or requirement_country.get("name") != name:
                raise SystemExit(f"Public country and visa detail APIs disagree about the identity of {iso2}.")
            requirement = detail_requirement

        countries.append({
            "slug": slug,
            "name": name,
            "iso2": iso2,
            "is_published": bool(item.get("is_published", False)),
            "capital": item.get("capital") or "",
            "short_description": item.get("short_description") or "",
            "overview": item.get("overview") or "",
            "visa_information": item.get("visa_information") or "",
            "seo_title": item.get("seo_title") or "",
            "seo_description": item.get("seo_description") or "",
            "requirement": requirement,
        })

    orphaned = sorted(set(requirements_by_iso2) - seen_iso2)
    if orphaned:
        raise SystemExit("Published BGD tourism requirements are missing from the country directory: " + ", ".join(orphaned))

    missing = REQUIRED_SLUGS - seen_slugs
    if missing:
        raise SystemExit("Japan and Australia must remain in the public directory: " + ", ".join(sorted(missing)))

    Path(expected_file).write_text(json.dumps(countries, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Public country directory API HTTP 200; {len(countries)} eligible countries.")
    print("Authoritative API slugs: " + ", ".join(sorted(seen_slugs)))
    print(f"Public BGD tourism requirements API HTTP 200; {len(requirements_by_iso2)} verified and published records.")
    print(f"Country-specific visa detail endpoints HTTP 200; {len(requirements_by_iso2)} records matched the public list API.")


def verify_static(site_dir, base_url, expected_file):
    countries = expected_countries(expected_file)
    verify_flag_asset_responses(countries, "Static build")
    expected = {item["slug"] for item in countries}
    sitemap_path = Path(site_dir) / "sitemap.xml"
    if not sitemap_path.is_file() or sitemap_path.stat().st_size == 0:
        raise SystemExit("Generated sitemap is missing or empty.")
    sitemap_slugs = country_slugs_from_sitemap(sitemap_path.read_bytes(), "Generated sitemap")
    verify_exact_set(expected, sitemap_slugs, "Generated sitemap")
    file_slugs = static_country_slugs(site_dir)
    verify_exact_set(expected, file_slugs, "Generated static country pages")

    directory_path = Path(site_dir) / "visa-services" / "index.html"
    if not directory_path.is_file() or directory_path.stat().st_size == 0:
        raise SystemExit("Generated visa-services directory page is missing or empty.")
    directory_parser = parse_html(directory_path.read_bytes(), "Generated visa-services directory")
    verify_directory_links(directory_parser, countries, "Generated visa-services directory")

    for country in countries:
        html_path = Path(site_dir) / "visa-services" / country["slug"] / "index.html"
        parser = parse_html(html_path.read_bytes(), f"Generated {country['slug']} page")
        validate_country_page(parser, country, base_url, f"Generated {country['slug']} page")
    print(f"Generated directory links, page content and SEO metadata verified for all {len(countries)} countries.")


def verify_live(base_url, expected_file):
    countries = expected_countries(expected_file)
    verify_flag_asset_responses(countries, "Live deployment")
    expected = {item["slug"] for item in countries}
    base = base_url.rstrip("/")

    homepage = fetch_bytes(base + "/")
    print(f"HTTP 200 verified: {base}/ ({len(homepage)} bytes)")

    sitemap_body = fetch_bytes(base + "/sitemap.xml")
    print(f"HTTP 200 verified: {base}/sitemap.xml ({len(sitemap_body)} bytes)")
    live_sitemap_slugs = country_slugs_from_sitemap(sitemap_body, "Live sitemap")
    verify_exact_set(expected, live_sitemap_slugs, "Live sitemap")

    directory_body = fetch_bytes(base + "/visa-services/")
    directory_parser = parse_html(directory_body, "Live visa-services directory")
    verify_directory_links(directory_parser, countries, "Live visa-services directory")
    print(f"HTTP 200 verified: {base}/visa-services/; all {len(countries)} directory links rendered.")

    for country in countries:
        url = f"{base}/visa-services/{country['slug']}/"
        body = fetch_bytes(url)
        parser = parse_html(body, f"Live {country['slug']} page")
        validate_country_page(parser, country, base, f"Live {country['slug']} page")
        print(f"HTTP 200 and country content/SEO verified: {url} ({len(body)} bytes)")

    print(f"Live country-directory parity verified for all {len(countries)} eligible countries.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--phase", choices=["snapshot", "static", "live"], required=True)
    parser.add_argument("--api-url", default="")
    parser.add_argument("--site-dir", default="out")
    parser.add_argument("--base-url", default="https://unigo-bd.com")
    parser.add_argument("--expected-file", default="expected-country-directory.json")
    args = parser.parse_args()
    verify_flag_component_source()

    if args.phase == "snapshot":
        snapshot(args.api_url, args.expected_file)
    elif args.phase == "static":
        verify_static(args.site_dir, args.base_url, args.expected_file)
    else:
        verify_live(args.base_url, args.expected_file)


if __name__ == "__main__":
    main()
