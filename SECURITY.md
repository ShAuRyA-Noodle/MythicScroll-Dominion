# Security Policy

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Email: shauryapunj404@gmail.com
Subject: `[MYTHICSCROLL SECURITY] <brief description>`

Provide repro + impact + suggested fix. Acknowledgement within 48 hours. GitHub's "Security › Report a vulnerability" tab is also accepted.

## Security Controls

- Next 16.2.6 (closes the Dependabot middleware/segment-prefetch advisory chain).
- `npm overrides`: flatted ^3.4.2, picomatch ^4.0.4, postcss ^8.5.10.
- CodeQL `security-extended` on push, PR, and weekly schedule (JS/TS).
- Dependabot weekly with `semver-major` ignored.
- Branch protection on `main`: required CodeQL check, linear history, no force-push, no deletion, conversation resolution required.
