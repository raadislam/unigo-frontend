# Non-Italy Schengen checklist frontend sync — 15 November 2026

The backend production database has been updated from the existing Bangladesh Schengen source audit. This marker requests a fresh static export so the published country pages consume the latest verified API checklist data.

The frontend country page already renders the four applicant-specific checklist profiles and their source links. The country-directory verification script now asserts that all four profiles and every document/source link are actually present in the rendered HTML.

Country-specific regression checks cover Germany/Estonia, Denmark/Norway, Netherlands/Poland, Sweden-represented destinations and Croatia. Italy remains covered by the previous Italy VFS update. Unverified dynamic checklists remain explicitly unverified; this rebuild must not invent missing requirements.

Source records and country-specific conditions are maintained in the backend seeder and its audit:
https://github.com/raadislam/unigo-backend/pull/79

The rendered-page validator requires four applicant profiles only for the 29 Schengen destinations; other destinations may legitimately have no Schengen-specific profiles. A fresh static rebuild is required after this validation correction.
