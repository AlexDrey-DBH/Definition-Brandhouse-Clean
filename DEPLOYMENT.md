# Deployment Notes

This repository is prepared for GitHub Pages using GitHub Actions.

## First-Time Setup

1. Create a new GitHub repository.
2. Add this folder as the repository contents.
3. Commit to the `main` branch.
4. In GitHub, open **Settings > Pages**.
5. Under **Build and deployment**, choose **GitHub Actions**.
6. Push or rerun the workflow.

## Custom Domain

The `CNAME` file currently contains:

```text
defbrandhouse.com
```

If the first deploy fails because of a domain or DNS issue, temporarily remove the `CNAME` file, deploy the site, then reconnect the custom domain in GitHub Pages once DNS is ready.

## No Build Step

This site is intentionally dependency-free. Do not run `npm install`, `npm build`, or add a framework unless the site is intentionally rebuilt later.
