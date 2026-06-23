# Definition Brandhouse Website

Static website for Definition Brandhouse.

## Structure

- `index.html` is the main homepage.
- Service pages live at the repository root, for example `branding.html`, `website-builds.html`, `public-relations.html`, and `google-ads.html`.
- Campaign or support pages also live at the root, including `shari.html`, `shari-help.html`, and `get-started.html`.
- `assets/css/styles.css` contains the shared site styling.
- `assets/js/main-homepage.js` contains lightweight interactive behavior used by select pages.
- `assets/images/` contains favicons, logos, work samples, and page imagery.
- `.github/workflows/pages.yml` deploys the static site to GitHub Pages.
- `CNAME` sets the custom domain to `defbrandhouse.com`.

## Local Preview

Open `index.html` directly in a browser to preview the homepage.

Because this is a static site, no build step, package install, framework, or server is required.

## GitHub Pages

In GitHub:

1. Go to **Settings > Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to the `main` branch.
4. Watch the deploy workflow under **Actions**.

The workflow publishes the repository root, so pages and assets should remain in their current folders unless the workflow is updated.

## Editing Notes

- Keep shared design changes in `assets/css/styles.css`.
- Keep images inside `assets/images/`.
- Use relative links like `branding.html` or `assets/images/example.webp` so the site works in both local preview and GitHub Pages.
