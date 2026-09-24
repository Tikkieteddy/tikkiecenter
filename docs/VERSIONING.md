# Version Automation

`package.json` is the source of truth for the semantic version. The website shows only the major version in its footer and reveals the full build version on hover or keyboard focus.

## Version rules

- Breaking change: `npm run version:major`
- Backward-compatible feature: `npm run version:minor`
- Bug fix or small improvement: `npm run version:patch`

The build step automatically generates `src/generated/build-info.ts` in this format:

`V.MAJOR.MINOR.PATCH+YYYYMMDD.ROUND`

The date and copyright year use the `Asia/Bangkok` timezone. `ROUND` uses the positive integer in `BUILD_ROUND` when supplied by CI; otherwise it uses the number of commits created during the current Bangkok calendar day, falling back to `1` when Git history is unavailable.

Do not manually edit `src/generated/build-info.ts`.
