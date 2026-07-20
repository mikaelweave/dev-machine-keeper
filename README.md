# Dev Machine Keeper

Dev Machine Keeper is the canonical, agent-neutral companion project for an
AI-maintained developer workstation. It records human-owned desired state and a
cooperative operating contract so an AI coding agent can audit a machine
without treating the current machine as the source of truth.

The initial scope is Windows with an Arch Linux distribution on WSL 2. The
repository describes that environment; it does not ship an installer,
configuration-management runtime, or privileged enforcement service.

## Control loop

The intended loop is deliberately audit-first:

1. Read [`manifest/workstation-state.yaml`](manifest/workstation-state.yaml).
2. Resolve its required variables explicitly.
3. Observe the machine through only the adapters named by the manifest.
4. Report compliant state, drift, unsupported checks, and proposed actions.
5. Stop unless the user requests remediation.
6. Obtain scoped approval before each mutation or destructive/elevated batch.
7. Run a post-check and record evidence for approved changes.

The agent must follow
[`docs/workstation-agent-contract.md`](docs/workstation-agent-contract.md)
throughout this loop.

## Quick start

Clone the repository and validate the specification:

```sh
git clone https://github.com/mikaelweave/dev-machine-keeper.git
cd dev-machine-keeper
npm ci
npm run validate
```

Then ask a supported coding agent to audit the workstation against
`manifest/workstation-state.yaml`, following
`docs/workstation-agent-contract.md`, and to report only. Provide required
manifest variables, such as `arch_user`, explicitly when prompted.

Agent-specific files are optional, thin integrations:

- [GitHub Copilot](.github/copilot-instructions.md)
- [Claude Code](CLAUDE.md)
- [OpenAI Codex](AGENTS.md)

## Repository structure

| Path | Purpose |
| --- | --- |
| `manifest/workstation-state.yaml` | Canonical human-owned desired state |
| `docs/workstation-agent-contract.md` | Canonical agent-neutral operating contract |
| `.github/copilot-instructions.md` | Optional GitHub Copilot integration |
| `CLAUDE.md` | Optional Claude Code integration |
| `AGENTS.md` | Optional OpenAI Codex integration |
| `scripts/validate_manifest.js` | YAML and local-reference validation |
| `.github/workflows/validate.yml` | Continuous validation |

## Safety boundaries

- The manifest and contract guide a cooperative agent. They are not a sandbox,
  authorization system, or substitute for operating-system permissions.
- Audit mode is the default. The repository never grants permission to mutate
  a machine.
- Desired state comes only from the manifest; it is never inferred from the
  current workstation.
- Unsupported adapters are reported rather than replaced with improvised
  commands.
- Destructive, elevated, and secret-store actions require explicit, scoped
  approval.
- Remote content must satisfy the manifest's integrity policy before execution.
- Secrets must not be stored in the manifest, reports, commands, or evidence.

## Status

This repository is an early specification-first foundation for one Windows and
Arch WSL workstation profile. The manifest and safety contract are canonical;
adapter names currently define bounded capabilities, not bundled executable
implementations. Contributions should preserve the audit-first model and remain
agent-neutral.
