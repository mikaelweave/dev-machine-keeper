# Workstation agent contract

Use `manifest/workstation-state.yaml` as the human-owned source of desired state for this machine.

This document guides a cooperative agent. It is not a sandbox, authorization system, or substitute for operating-system permissions.

## Default behavior

1. Default to **audit mode** when the user does not explicitly request another mode.
2. In audit mode, observe and report only. Do not install, update, remove, rewrite, prune, stop, restart, or elevate.
3. Never infer desired state from the current machine. Only the manifest defines desired state.
4. Never add a package, setting, check, adapter, path, or cleanup target to the manifest without an explicit user request.
5. Resolve every required manifest variable before auditing. If a value is missing, ask for it; do not infer it from the machine or silently edit the manifest.

## Adapter rules

1. Use only adapters declared in the manifest.
2. Treat adapter names as bounded capabilities, not invitations to invent shell commands.
3. If an adapter cannot be executed exactly and safely in the current environment, report it as unsupported and stop that check.
4. Do not replace an unsupported adapter with a plausible alternative.
5. Prefer structured or machine-readable output when the underlying tool provides it.
6. Verify declared hashes before using external assets. If mutable installer content differs from its reviewed hash, stop and request a new review.

## Audit report

Group results into:

- compliant state;
- drift;
- unsupported or inconclusive checks;
- maintenance observations and reclaimable space;
- proposed actions.

Every proposed action must show:

- manifest item and adapter;
- exact target;
- expected effect;
- risk level;
- required privilege;
- whether the action is destructive or reversible;
- the post-action evidence that would establish success.

## Approval

1. Stop after the report unless the user explicitly requests remediation.
2. Ask for scoped approval. Approval for one action or batch does not approve other actions.
3. Always require explicit approval for:
   - administrator or WSL root operations;
   - package removal;
   - file or worktree deletion;
   - cache or Docker pruning;
   - registry and security-setting changes;
   - service changes and restarts;
   - access to credential stores.
4. Never interpret "fix it," "clean up," or similar broad language as approval for destructive actions. Return a plan first.

## Privilege and secrets

1. Keep normal Windows, elevated Windows, WSL user, and WSL root actions separate.
2. Do not request elevation during audit mode.
3. Never place credentials, tokens, recovery codes, or private keys in the manifest, report, command output, or evidence log.
4. Refer to secrets by provider and key name only.

## Browser automation boundary

1. Run the `agent-browser` CLI, browser runtime, and session state natively inside WSL by default.
2. Do not invoke, discover, or connect to an `agent-browser` process running on Windows.
3. Use the manifest's native Linux Chromium and isolated WSL state for headless automation.
4. A native WSL `agent-browser` CLI may connect to a Windows browser over CDP only when the user explicitly requests that fallback.
5. For a Windows CDP fallback, use an explicit endpoint and a dedicated automation profile. Do not use auto-connect, a normal personal browser profile, or a CDP endpoint exposed beyond the Windows host and WSL boundary.
6. Treat opening the CDP endpoint and controlling the Windows browser as separately approved actions. Close the debugging browser when the task ends.
7. `agent-browser doctor` always cleans stale daemon sidecar files. Treat it as post-install validation or explicitly approved maintenance, not as a read-only audit adapter.
8. A host-only Windows CDP bridge requires WSL mirrored networking or an explicitly firewalled loopback proxy. If reaching Windows would require binding the debugging endpoint to `0.0.0.0` or another non-loopback interface, refuse the fallback.
9. If native Chromium cannot run with its sandbox enabled, report the runtime as unsupported. Do not add `--no-sandbox` to make the check pass.

## Evidence and failure

1. After an approved mutation, run the adapter's post-check.
2. Record the timestamp, adapter, target, arguments, privilege, exit status, and post-check result.
3. Report partial failure precisely. Do not return a success-shaped summary when one action failed.
4. Do not retry a destructive or elevated action with broader permissions or different arguments without new approval.

## Forbidden behavior

- Broad recursive deletion.
- Removing dirty, unpushed, or unclassified worktrees.
- Guessing package identifiers or installer URLs.
- Executing downloaded content that has not passed the manifest's integrity policy.
- Disabling security controls to make an operation succeed.
- Editing agent permission files to bypass approval.
- Treating this instruction document as proof that an action is safe.
