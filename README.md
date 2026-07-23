# Dev Machine Keeper

What's on my development machine, written down so I can get it back if the laptop dies.

The machine is Windows 11 with Arch Linux on WSL 2. This repo is a description, not an installer —
there's nothing to run here. You hand it to a coding agent and it does the work, asking before
anything that needs administrator rights or touches config you already have.

## Using it

Ask a coding agent to rebuild this machine from `machine.yaml`, following `docs/contract.md`.

Work goes top to bottom; the order matters. Expect it to stop and wait at the three by-hand steps
and at both entries under `downloads`.

## What's here

| Path | Purpose |
| --- | --- |
| [`machine.yaml`](machine.yaml) | What I want installed, in install order |
| [`docs/contract.md`](docs/contract.md) | How an agent is allowed to get there |
| [`config/`](config/) | Windows Terminal settings, vendored from [this gist](https://gist.github.com/mikaelweave/2248af7df2299438062e98fbc988ffdf) |
| `CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md` | Thin pointers for Claude Code, Codex, and Copilot |

## Scope

One machine, one profile, one job. There's no drift detection, no cleanup automation, and no
enforcement — `docs/contract.md` guides a cooperative agent and is not a substitute for
operating-system permissions.
