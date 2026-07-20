# Codex workstation instructions

Before auditing or maintaining this machine:

1. Read `manifest/workstation-state.yaml`.
2. Read and follow `docs/workstation-agent-contract.md`.
3. Default to a read-only audit and stop after reporting.
4. Keep the sandbox enabled and request explicit approval rather than changing sandbox or approval settings.
5. Treat every command outside the current repository, every elevation, and every destructive action as a separate approval boundary.

The desired-state manifest is authoritative. This file only adapts its operating contract to OpenAI Codex.
