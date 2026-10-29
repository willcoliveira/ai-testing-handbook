# Visual tests (tests/site/e2e/visual.spec.ts) in the Playwright image, so local and CI Linux render
# the same pixels. Adapted from willcoliveira/playwright-ts-template.
# The tag MUST match the installed @playwright/test version (the Site workflow's lint job checks it):
# the image already contains the matching browsers, so no `playwright install`. The digest pins the
# multi-arch index the tag pointed at (audit 2026-10-28; a re-tagged image no longer builds here).
# Dependabot (docker ecosystem) moves the digest; a Playwright bump changes the tag by hand, then
# the digest: `curl -sI -H 'Accept: application/vnd.oci.image.index.v1+json'
# https://mcr.microsoft.com/v2/playwright/manifests/v<version>-noble | grep -i docker-content-digest`.
# Build from the repo root:  docker build --platform linux/amd64 -f tests/site/Dockerfile -t hb-visual .
FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea

ENV CI=1
# WORKDIR creates /app as root; hand it to the unprivileged user the image
# ships with so `npm ci` can create node_modules and tests can write reports.
WORKDIR /app
RUN chown pwuser:pwuser /app

COPY --chown=pwuser:pwuser package*.json ./
USER pwuser
RUN npm ci --ignore-scripts

COPY --chown=pwuser:pwuser . .

# SITE_TEST=1 build (with the type specimen), then the @visual spec on chromium, tablet, mobile-chrome
CMD ["npm", "run", "test:visual"]
