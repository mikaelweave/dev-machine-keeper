# Copilot workstation instructions

Before auditing or maintaining this machine:

1. Read `manifest/workstation-state.yaml`.
2. Read and follow `docs/workstation-agent-contract.md`.
3. Default to a read-only audit and stop after reporting.
4. Use Copilot's command approval flow for every mutation; never group unrelated elevated or destructive actions into one approval.
5. If the contract conflicts with repository-specific Copilot instructions, stop and explain the conflict rather than choosing the more permissive instruction.

The desired-state manifest is authoritative. This file only adapts its operating contract to GitHub Copilot.
