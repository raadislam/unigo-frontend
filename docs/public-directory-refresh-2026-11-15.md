# Public directory refresh — 15 November 2026

## Reason

The live-directory audit compared the current public country API with the deployed sitemap and found that the API includes the newly published Tristan da Cunha destination while the deployed sitemap does not.

The existing deployment workflow correctly rebuilds the static country directory from the authoritative API snapshot. This documentation-only change is intentionally used to trigger that normal deployment after the backend publication, without changing country data or application behavior.

## Required verification

- Rebuild static pages from the current public API.
- Verify generated sitemap and country-page parity against the API snapshot.
- Deploy the static export to the existing Hostinger target.
- Verify the live sitemap, directory links, country pages, SEO metadata and SVG flags.

No visa requirement, destination status, source record or production database row is changed by this refresh.
