---
title: Example Security
sidebar_position: 1
---

This document describes the security considerations for textbook code examples that execute in readers' browsers.

## Overview

Textbook examples run in LiveCodes iframes. LiveCodes uses sandboxed iframes to isolate example code from the parent page.

## Threat Model

### Threats we address

| Threat                                    | Mitigation                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------ |
| Example reads parent page cookies/storage | LiveCodes iframe sandboxing; `allow-same-origin` is NOT set by default               |
| Example exfiltrates repository secrets    | CI validation runs with no secrets in environment                                    |
| Malicious PR injects code into deployment | `pull_request_target` is never used; untrusted code never has deployment credentials |
| Example modifies other examples' state    | Each example runs in its own iframe context                                          |
| Infinite loop or resource exhaustion      | LiveCodes has execution timeouts                                                     |
| Example reads local filesystem            | iframe sandboxing prevents filesystem access                                         |

### Threats we do not address

| Threat                                   | Notes                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| Malicious content merged by a maintainer | Requires social engineering; out of scope for technical controls          |
| LiveCodes supply-chain compromise        | Mitigated by pinning the `livecodes` package version and using Dependabot |

## CI Security Rules

1. Never use `pull_request_target` for untrusted code execution.
2. Validation workflows have no deployment credentials.
3. Deployment only occurs on verified `main` branch pushes.
4. GitHub token permissions are minimal (`contents: read`).

## Relaxing Sandbox Attributes

Do not relax iframe sandbox attributes without:

1. A documented requirement explaining why the relaxation is necessary.
2. A security review confirming the impact is acceptable.
3. An update to this document describing the change and rationale.

## Reporting Security Issues

See `SECURITY.md` in the repository root.
