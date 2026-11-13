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


def validate_country_page(parser, country, base_url, label):
    slug = country["slug"]
    name = country["name"]
    canonical = f"{base_url.rstrip('/')}/visa-services/{slug}/"
    title = parser.title or parser.meta.get("og:title", "")
    description = parser.meta.get("description", "")
    og_url = parser.meta.get("og:url", "")
    robots = parser.meta.get("robots", "").lower()
    visible = parser.text.casefold()

    if name.casefold() not in visible:
        raise SystemExit(f"{label} does not render the expected country name: {name}.")
    if name.casefold() not in title.casefold():
        raise SystemExit(f"{label} title/OG title does not include the country name: {name}.")
    if not description.strip():
        raise SystemExit(f"{label} is missing its SEO description.")
    if parser.canonical.rstrip("/") + "/" != canonical:
        raise SystemExit(f"{label} canonical is missing or incorrect: {parser.canonical!r}.")
    if og_url.rstrip("/") + "/" != canonical:
        raise SystemExit(f"{label} Open Graph URL is missing or incorrect: {og_url!r}.")
    if "noindex" in robots:
        raise SystemExit(f"{label} is marked noindex.")


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
    if payload.get("success") is not True or not isinstance(payload.get("data"), list) or not payload["data"]:
        raise SystemExit("Public country directory API returned an unsuccessful or empty response.")
    countries = []
    seen = set()
    for item in payload["data"]:
        slug = item.get("slug", "")
        name = item.get("name", "")
        iso2 = item.get("iso2", "")
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or not name or not iso2:
            raise SystemExit("Public country directory API returned a malformed country record.")
        if slug in seen:
            raise SystemExit(f"Public country directory API returned a duplicate slug: {slug}.")
        seen.add(slug)
        countries.append({
            "slug": slug,
            "name": name,
            "iso2": iso2,
            "is_published": bool(item.get("is_published", False)),
        })
    missing = REQUIRED_SLUGS - seen
    if missing:
        raise SystemExit("Japan and Australia must remain in the public directory: " + ", ".join(sorted(missing)))
    Path(expected_file).write_text(json.dumps(countries, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Public country directory API HTTP 200; {len(countries)} eligible countries.")
    print("Authoritative API slugs: " + ", ".join(sorted(seen)))


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
