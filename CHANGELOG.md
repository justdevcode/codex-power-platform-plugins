# Changelog

## 2.1.0-codex.1

- Rebuilt the plugin deterministically from the uploaded Microsoft `canvas-apps` plugin.
- Added Codex repo marketplace structure under `.agents/plugins/marketplace.json`.
- Added Codex plugin manifest under `.codex-plugin/plugin.json`.
- Bundled Canvas Authoring MCP server through `.mcp.json`.
- Converted MCP config to Codex direct server-map format.
- Retained .NET 10 SDK prerequisite check in `$configure-canvas-mcp`.
- Retained Microsoft sovereign cloud / cluster mapping, including `make.preview.powerapps.com` → `prod`.
- Included Microsoft `PlanTemplates.md` and `QAChecks.md`.
- Added `$edit-canvas-app` compatibility wrapper based on the Ratnam Codex port concept.
- Included and adapted `report-issue` as a safe reviewable issue-report workflow.
- Removed Claude/Open Plugins packaging folders `.claude-plugin/` and `.plugin/`.
