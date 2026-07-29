# Security Policy

## Supported Versions

This is an educational open-source project. Security fixes are applied to the latest version only.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report vulnerabilities privately via [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability).

Include:

- A description of the vulnerability
- Steps to reproduce
- The potential impact
- Any suggested mitigation

We will acknowledge receipt within 5 business days and aim to resolve critical issues within 30 days.

## Scope

This textbook runs user-supplied code inside sandboxed iframes via LiveCodes. The primary security concerns are:

- Cross-site scripting through content injection
- Iframe sandbox escape
- Supply-chain vulnerabilities in dependencies

See `docs/maintainer-guide/example-security.md` for the full threat model.

## Out of Scope

- Vulnerabilities in the code examples themselves (examples may demonstrate intentional errors)
- Denial-of-service via computationally expensive examples
