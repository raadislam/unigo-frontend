import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from xml.etree import ElementTree

REQUIRED_SLUGS = {"japan", "australia"}


class PageInspector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title_parts = []
        self.text_parts = []
        self.anchors = set()
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
    request = Request(url, headers={"User-Agent": "UniGo-Country-Parity-Check/1.0", "Accept": "text/html,application/xml,application/json"})
    with urlopen(request, timeout=45) as response:
        body = response.read()
        status = response.status
    if status != 200 or not body:
        raise SystemExit(f"HTTP verification failed: {url} returned {status} or an empty body.")
    return body


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

    body = fetch_bytes(base + "/countries")
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

    if args.phase == "snapshot":
        snapshot(args.api_url, args.expected_file)
    elif args.phase == "static":
        verify_static(args.site_dir, args.base_url, args.expected_file)
    else:
        verify_live(args.base_url, args.expected_file)


if __name__ == "__main__":
    main()
