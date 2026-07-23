# Contract

`machine.yaml` is what I want on this machine. This file is how you're allowed to get there.

It guides a cooperative agent. It is not a sandbox or a substitute for operating-system permissions.

## Default

Work top to bottom in file order. Check each item before installing and skip what's already there.

`machine.yaml` is the only source of desired state — never infer it from what's currently on the
machine, and never add anything to it unless I ask.

## How to check and install

| Section | Check | Install |
| --- | --- | --- |
| `windows.winget` | `winget list --id <id> --exact` | `winget install --id <id> --exact` |
| `windows.downloads` | is it already there? | show me the script first, then run it |
| `windows.by_hand` | — | show me the steps; I do them |
| `wsl` | `wsl --status` | `wsl --install` (admin, needs a reboot) |
| `wsl.archlinux.pacman` | `pacman -Q <name>` | `sudo pacman -S --needed <name>` |
| `wsl.archlinux.npm` | `npm ls -g --prefix ~/.local` | `npm i -g --prefix ~/.local <name>` |

Use the ids exactly as written. Don't guess one, don't fuzzy-match, don't substitute a package that
looks equivalent. If an id doesn't resolve, stop and tell me.

If a command isn't in this table, ask before running it.

## Ask first

- Anything needing administrator or WSL root
- Running anything from `downloads` — show me the contents first
- Anything that removes, overwrites, or resets config that already exists
- Reboots

Approval for one step is not approval for the next.

## Never

- Remove packages I didn't ask you to remove
- Overwrite my Windows Terminal settings without showing me the diff
- Put credentials, tokens, or keys in this repo, in commands, or in output
- Disable a security control to make something install
- Edit agent permission files to skip an approval

## When something fails

Say exactly what failed and stop. Don't retry with `--force`, broader permissions, or a different
package. A half-finished rebuild reported honestly is more useful than a green summary that isn't
true.
