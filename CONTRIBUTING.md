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

Never edit `generated/` or `public/svg/` by hand: `bun run icons` rebuilds them from `icons/`.

Logos belong to their owners. Only add them to identify the tool or service they stand for, and take them from the
official source.

Report security problems privately, as [SECURITY.md](SECURITY.md) describes, and not in a public issue.
Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
