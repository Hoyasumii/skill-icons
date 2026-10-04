# Security Policy

## Supported versions

Only the latest deployment, built from `main`, receives security fixes.

## Reporting a vulnerability

Please do not open a public issue. Report it privately through
[GitHub's private vulnerability reporting](https://github.com/Hoyasumii/skill-icons/security/advisories/new), or by
email to alanreisanjo@gmail.com.

Include what an attacker can do and the steps to reproduce it. You should get an answer within a week. Once a fix is
deployed, the advisory is published with credit to you, unless you prefer otherwise.

## Scope

Things worth reporting include, among others:

- a way to inject markup or script into the SVGs the API serves (`/icons`, `/api/svgs`), for example through the query
  parameters;
- a way to make the Worker fetch or read anything other than the bundled icons;
- a cross-site scripting hole in the builder site.

Vulnerabilities in the upstream [tandpfun/skill-icons](https://github.com/tandpfun/skill-icons) belong there.
