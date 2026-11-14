# Visa directory publishing verification

The public visa-services directory is generated from the live UniGo country-directory API. A country is eligible when its country record is published or it has an effective, verified and published Bangladesh-passport tourism requirement.

For each backend visa publication:

1. Fetch `/api/countries` and record every eligible country slug.
2. Fetch `/api/visa-requirements?passport=BGD&purpose=tourism` and confirm the new record is verified, published and has a primary official source.
3. Build the static frontend with the production `NEXT_PUBLIC_API_URL`.
4. Confirm each API slug has `out/visa-services/<slug>/index.html` and a matching sitemap URL.
5. Deploy and request every expected `/visa-services/<slug>/` URL.
6. Check HTTP status, country-specific rendered content, canonical metadata and directory links. Report missing and extra slugs separately.

The current backend directory after the 14 November 2026 Vietnam publication contains: Australia, Canada, Japan, United Kingdom and Viet Nam (`viet-nam`).

The canonical public route is `/visa-services/<slug>/`. Do not assume `/countries/<slug>/` is a frontend route.

A backend import or API publication alone is not proof that the static public page has been deployed.