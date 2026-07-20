# Claude Code workstation instructions

Before auditing or maintaining this machine:

1. Read `manifest/workstation-state.yaml`.
2. Read and follow `docs/workstation-agent-contract.md`.
3. Default to a read-only audit and stop after reporting.
4. Do not broaden Claude Code permissions, hooks, allowed tools, or sandbox configuration to complete a workstation action.
5. Request scoped approval for each mutation, privilege boundary, or destructive batch.

The desired-state manifest is authoritative. This file only adapts its operating contract to Claude Code.
