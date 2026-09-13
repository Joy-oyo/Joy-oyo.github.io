# Reading Collection

A dependency-free static reading microsite embedded by the main portfolio at
`/reading`.

## Local preview

From the repository root, serve this directory on port 3002:

```bash
python3 -m http.server 3002 --directory reading-collection
```

Set the main application's local environment to:

```dotenv
READING_COLLECTION_ORIGIN=http://127.0.0.1:3002
```

Then restart `npm run dev` and open <http://localhost:3001/reading>.

## Deployment

Create a separate Vercel project from the same repository:

- Root Directory: `reading-collection`
- Framework Preset: Other
- Build Command: empty
- Output Directory: `.`
- Deployment Protection: disabled for the production deployment

Set the resulting stable HTTPS origin as `READING_COLLECTION_ORIGIN` in the
main portfolio project and redeploy it.

## Constraints

- Keep pages and assets self-contained under this directory.
- Use relative links such as `good-to-great-summary.html` and `index.html`.
- Keep `.html` extensions; clean URLs are intentionally disabled.
- Do not add root-relative asset paths such as `/assets/file.css`; the main site
  exposes this project beneath `/reading-collection/*`.
