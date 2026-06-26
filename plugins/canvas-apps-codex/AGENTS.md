# AGENTS.md — Canvas Apps for Codex

This file provides guidance to Codex when working with the **canvas-apps-codex** plugin.

## What this plugin is

This is a Codex-compatible adaptation of Microsoft's Canvas Apps plugin from `microsoft/power-platform-skills/plugins/canvas-apps`.

The plugin helps Codex author Power Apps Canvas Apps by working with `.pa.yaml` source files and the Canvas Authoring MCP server (`canvas-authoring`). The MCP server communicates with a live Power Apps Studio coauthoring session. The Power Apps Studio browser tab must remain open for the whole session; closing it can break `sync_canvas`, `compile_canvas`, and save/preview behaviour.

## Codex packaging

This plugin is packaged for Codex, not Claude. The plugin root contains:

```text
.codex-plugin/plugin.json       ← Codex plugin manifest
.mcp.json                       ← Bundled Canvas Authoring MCP server config
AGENTS.md                       ← Agent guidance for Codex
CLAUDE.md                       ← Compatibility note pointing back to AGENTS.md
README.md                       ← Plugin-level documentation
references/
  TechnicalGuide.md             ← YAML syntax, controls, layout, Power Fx conventions
  DesignGuide.md                ← Visual and UX design guidance
  QAChecks.md                   ← Runtime anti-pattern checks for self-QA
  PlanTemplates.md              ← CREATE and EDIT plan structures
agents/
  canvas-app-planner.md         ← Planning instructions used by the canvas-app skill
  canvas-screen-builder.md      ← Screen implementation instructions used by the canvas-app skill
skills/
  canvas-app/SKILL.md           ← Unified create/edit Canvas App workflow
  configure-canvas-mcp/SKILL.md ← Connects the bundled MCP server to a Studio session
  add-data-source/SKILL.md      ← Guides users through adding data sources in Studio
  generate-canvas-app/SKILL.md  ← Compatibility wrapper for create requests
  edit-canvas-app/SKILL.md      ← Compatibility wrapper for edit requests
  report-issue/SKILL.md         ← Prepares a safe issue report
```

## MCP configuration

The Canvas Authoring MCP server is bundled through `.mcp.json`, and `.codex-plugin/plugin.json` points to it with:

```json
"mcpServers": "./.mcp.json"
```

Do not define the main `canvas-authoring` transport command manually in `~/.codex/config.toml` for this plugin. Codex may still use `config.toml` for plugin-scoped MCP enablement and tool approval policy.

## Main workflow

1. User opens the target Canvas App in Power Apps Studio.
2. User enables coauthoring if required and keeps the Studio tab open.
3. User runs `$configure-canvas-mcp`.
4. The skill verifies `.NET 10 SDK`, extracts environment/app details from the Studio URL, and calls the `canvas-authoring` MCP connect tool.
5. User runs `$canvas-app` with create or edit requirements.
6. The skill syncs the current app state, detects CREATE or EDIT mode, plans the work, updates `.pa.yaml` files, and validates with `compile_canvas`.

## Skills

| Skill | Description |
|---|---|
| `$canvas-app` | Preferred unified workflow for create and edit requests |
| `$configure-canvas-mcp` | Connects the bundled Canvas Authoring MCP server to the current Studio session |
| `$add-data-source` | Guides the user to add a data source or connector in Power Apps Studio |
| `$generate-canvas-app` | Compatibility wrapper that routes to `$canvas-app` in CREATE mode |
| `$edit-canvas-app` | Compatibility wrapper that routes to `$canvas-app` in EDIT mode |
| `$report-issue` | Creates a safe, reviewable issue report draft |

## Codex adaptation rules

The Microsoft upstream instructions include some Claude-specific concepts such as `AskUserQuestion`, `EnterPlanMode`, `ExitPlanMode`, and `Task`. In this Codex adaptation:

- Ask the user directly in chat when input or approval is required.
- Present a markdown plan and wait for explicit approval instead of using plan-mode tools.
- Use Codex subagent support if available. If not available, read the files in `agents/` and execute those instructions inline.
- Build screens sequentially if Codex cannot run subagents in parallel.
- Use `${PLUGIN_ROOT}` where Codex exposes it. If unavailable, resolve the plugin root as the directory containing `.codex-plugin/plugin.json`.

## Safety and quality

- Do not guess Power Apps control properties. Use `describe_control` output and the reference docs.
- Do not ignore `compile_canvas` failures. Fix and re-run until clean, or clearly report remaining errors.
- Do not ask the user to add sensitive data to public issue reports.
- Validate in a test app before using the plugin against important production apps.
