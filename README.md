# Codex Power Platform Plugins

A Codex plugin marketplace for Power Platform development workflows.

## Available plugin

### Canvas Apps for Codex

`plugins/canvas-apps-codex` creates and edits Power Apps Canvas Apps through the Canvas Authoring
MCP server and a live Power Apps Studio coauthoring session.

The current package is `3.0.3-codex.1`, based on Microsoft Canvas Apps plugin v3.0.3 at commit
[`0b9b038`](https://github.com/microsoft/power-platform-skills/commit/0b9b0389607c6c45c1dfee2714f4c12f152111f3).

Its supported skill entrypoints are:

- `$canvas-app`
- `$configure-canvas-mcp`
- `$add-data-source`
- `$report-issue`

## Install

Add this repository as a marketplace:

```powershell
codex plugin marketplace add https://github.com/justdevcode/codex-power-platform-plugins.git --ref main
```

Start Codex, open `/plugins`, select **Power Platform Plugins**, and install
**Canvas Apps for Codex**. Restart Codex when prompted.

After installation, open `/mcp` and confirm that `canvas-authoring` is listed. Then open the target
Canvas App in Power Apps Studio, keep its coauthoring tab open, and run `$configure-canvas-mcp`.

## Repository structure

```text
.agents/plugins/marketplace.json       Marketplace definition
plugins/canvas-apps-codex/             Codex plugin package
  .codex-plugin/plugin.json            Package manifest
  .mcp.json                            Canvas Authoring server registration
  hooks/                               Prompt-time sync reminder
  skills/                              User-facing workflows
  agents/                              Planner and screen-builder instructions
  references/                          Microsoft v3 authoring guidance
```

## Attribution

The Canvas Apps plugin is adapted from
[Microsoft's Power Platform skills repository](https://github.com/microsoft/power-platform-skills/tree/main/plugins/canvas-apps)
and retains Microsoft-authored workflow and reference material under the MIT License. This
repository is independently maintained and is not an official Microsoft release.
