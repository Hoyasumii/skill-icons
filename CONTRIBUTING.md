# Contributing

Thanks for helping. The short version:

- You need [Bun](https://bun.sh). Run `bun install` first: it also installs the git hooks (husky).
- `bun run dev` starts the site and the API at <http://localhost:5173>. Before opening a pull request, run
  `bun run typecheck` and `bun run test`. `bun run knip` finds unused code and `bun run format` formats the files with Biome.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat: ...`, `fix: ...`),
  enforced by commitlint.
- Every push to `main` runs the deploy workflow (`.github/workflows/deploy.yml`): typecheck, tests and build.

## Adding or fixing an icon

1. Get the logo as an SVG from the brand's official source (press kit or brand guidelines).
2. Generate the icon: `bun skill-icon generate --name <Name> --generate ./logo.svg --category <category>`. Add
   `--background "#hex"` for a single brand-colored icon, and `--force` to overwrite an existing one.
   `bun skill-icon category list` shows the categories.
3. Use the brand's **official spelling** as the display name ("Visual Studio Code", "Next.js", "shadcn/ui"). When the
   file name differs, add an entry to `displayNames` in `shared/icon-categories.ts`.
4. Run `bun run icons` and check the result on the site, in the Dark and Light variants.

Never edit `generated/`, `public/svg/` or `packages/skill-icons/src/generated/` by hand: `bun run icons` rebuilds them from `icons/`.

Logos belong to their owners. Only add them to identify the tool or service they stand for, and take them from the
official source.

Report security problems privately, as [SECURITY.md](SECURITY.md) describes, and not in a public issue.
Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Library releases

Every push to `main` runs `.github/workflows/release.yml`. Changes to `icons/`, the library,
its generator or shared metadata rebuild and publish `@hoyasumii/skill-icons` from the SVG sources.
Pull requests typecheck, test and build the library before merging.

The release script compares the package sources with the latest stable version published on npm
and its Git tag. It preserves an unpublished version when available, otherwise advances CalVer
(`YY.M.PATCH`, starting at `.0` in a new month). It records versions in both package manifests and
`bun.lock`, adds a CHANGELOG section with added, changed and removed icons, and commits and tags
that version before publishing. Existing CHANGELOG entries are preserved, including the 26.10.2
history cutoff. Unchanged published sources do not produce another npm version.

Releases are serialized. If npm publishing fails, rerun Release from Actions on `main` (or use
`workflow_dispatch` on `main`); it reuses the unpublished version and never overwrites a tag.
If npm succeeded but GitHub release creation failed, a rerun only creates the missing release.
Explicit `v*` tag pushes are still supported and must match the library version and CHANGELOG.

Repository settings must allow the workflow's `GITHUB_TOKEN` to push release commits and tags.
Configure the npm package's [Trusted Publisher](https://docs.npmjs.com/trusted-publishers/)
with owner `Hoyasumii`, repository `skill-icons`, workflow `release.yml`, and no environment.
The workflow uses Node 24, the latest npm CLI and `id-token: write` for OIDC publishing.
A registry/authentication failure fails the job; it is never treated as a successful release.
