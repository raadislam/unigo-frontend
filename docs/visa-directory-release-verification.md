# Visa directory release verification

The public visa directory is generated from the authoritative UniGo API. Country pages must never be maintained as a separate hard-coded country list.

## Release requirements

1. Snapshot the public country directory and Bangladesh tourism visa-requirement API before the static build.
2. Build the static export from the API response.
3. Compare the complete API slug set against generated static country pages and sitemap entries.
4. Fail the build if a published API country is missing, if an unexpected page is generated, or if country content and SEO metadata are incomplete.
5. After deployment, verify the homepage, country directory, every country page and the live sitemap over HTTP.
6. Confirm canonical URLs, page titles, descriptions, and sitemap URLs use the canonical country slugs.

## Current release source

The backend release on 14 November 2026 publishes verified Bangladesh ordinary-passport tourism requirements. It includes the 29 Schengen destinations plus the previously published Australia, Canada, Japan, Maldives, United Kingdom and Vietnam records.

The Schengen pages describe the common short-stay framework. The competent embassy, local checklist, appointment channel and external service-provider charges remain destination-specific and must be confirmed from the relevant official mission.

This file documents the release process. The live API remains the source of truth for the country set and page content.
