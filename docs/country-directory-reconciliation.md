# Country directory reconciliation

The public country directory and the static frontend are separate release surfaces. The frontend build snapshots the authoritative `/countries` API and generates country pages and `sitemap.xml` from that snapshot.

The deployment workflow now runs on a 15-minute schedule as a reconciliation fallback, in addition to normal pushes, manual runs, and the `visa-content-updated` repository dispatch event. Each run rebuilds from the current API response and verifies the generated static export and deployed sitemap against the same country snapshot.

A successful deployment must report zero missing or extra country slugs and confirm that every expected country page is reachable. This scheduled deployment is intentionally a safety net; backend content publication should also dispatch `visa-content-updated` immediately when cross-repository dispatch credentials are configured.
