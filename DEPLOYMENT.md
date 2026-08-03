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

## Intake Form CAPTCHA

The intake form uses Google reCAPTCHA verification.

Before publishing the protected form:

1. Confirm the registered domain for the reCAPTCHA key includes `defbrandhouse.com`.
2. The public site key is already set in `get-started.html`.
3. In Apps Script, open **Project Settings > Script Properties** and add:
   - Property: `RECAPTCHA_SECRET_KEY`
   - Value: the secret key from the Google reCAPTCHA admin screen
4. Redeploy the Apps Script web app so the backend verifies the CAPTCHA token before writing to Google Sheets or sending the lead email.

Do not commit the secret key to this public repository. If the script property is missing, the backend will reject submissions and email the configured notification address with the setup error.
