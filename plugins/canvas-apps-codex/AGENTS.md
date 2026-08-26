# AGENTS.md — Canvas Apps for Codex

This is a Codex-compatible port of Microsoft's Canvas Apps plugin. It authors `.pa.yaml` files
through the `canvas-authoring` MCP server and a live Power Apps Studio coauthoring session.

The Studio browser tab must remain open for the entire session. Closing it ends coauthoring and
breaks `sync_canvas` and `compile_canvas` operations.

## Architecture

```text
.codex-plugin/plugin.json       Codex package metadata
.mcp.json                       Bundled Canvas Authoring MCP server
hooks/hooks.json                Codex UserPromptSubmit registration
hooks/inject-sync-reminder.cs   Advisory sync reminder
skills/                         User-facing Codex skills
agents/                         Planner and screen-builder instruction sources
references/                     Microsoft v3 authoring and validation guidance
```

The reference set contains `YamlSyntax`, `ControlGuide`, `LayoutGuide`, `GridLayoutGuide`,
`PowerFxGuide`, `DesignGuide`, `QAChecks`, `PlanTemplates`, `CreateWorkflow`, `EditWorkflow`, and
`ValidationWorkflow`.

## Skills

| Skill | Description |
|---|---|
| `$canvas-app` | Create or edit a Canvas App and automatically select the correct workflow |
| `$configure-canvas-mcp` | Connect the bundled MCP server to the current Studio session |
| `$add-data-source` | Guide a Studio-managed connection and verify it through MCP |
| `$report-issue` | Prepare a safe public issue and require approval before submission |

`$generate-canvas-app` and `$edit-canvas-app` no longer exist. Use `$canvas-app` for both modes.

## Specialist instructions

The unified skill may spawn Codex subagents that follow:

- `agents/canvas-app-planner.md` for discovery, planning artifacts, and CREATE-mode `App.pa.yaml`.
- `agents/canvas-screen-builder.md` for one screen file and its complete named QA pass.

Run builders in parallel waves of no more than three. If subagents are unavailable, follow the
same instruction files inline and process screen briefs sequentially. The orchestrator owns
compilation and EDIT-mode `App.pa.yaml` changes.

## MCP tools

The `canvas-authoring` server provides `connect`, `sync_canvas`, `compile_canvas`, `list_controls`,
`describe_control`, `list_apis`, `describe_api`, `list_data_sources`, and
`get_data_source_schema`.

Call `connect` before other tools. Call `sync_canvas` against the app's absolute working directory
before reading or changing source. Never edit `_EditorState.pa.yaml` except when the approved v3
workflow explicitly applies final order changes.

## Codex adaptation rules

- Use `$skill-name`, not Claude or Copilot slash-command syntax.
- Use Codex subagents for planner/builder dispatch and Codex progress tracking when available.
- Ask the user directly when approval or free-form information is required.
- Use filesystem inspection and `apply_patch` for source changes.
- Resolve `${PLUGIN_ROOT}` to this plugin directory if the host has not already expanded it.
- Do not copy `.plugin`, `.claude-plugin`, Copilot hook files, or unsupported skill frontmatter
  from upstream.
- Preserve `.codex-plugin/plugin.json`, the direct Codex `.mcp.json` map, and the repository's
  marketplace identity during future upstream syncs.

## Quality invariants

- Never guess control properties or enum names; use `describe_control`.
- Control names must be unique across the entire app.
- Never add a version suffix to a `Control:` value.
- Compile early, after builder waves, and after targeted repairs.
- Do not rebuild completed screens to address ordinary compile diagnostics; repair them in place.
- Do not report completion until compilation is clean or remaining diagnostics are explicit.

## Upstream baseline

This release tracks Microsoft Canvas Apps plugin v3.0.3 at commit
`0b9b0389607c6c45c1dfee2714f4c12f152111f3`. Microsoft workflow behavior is the source of truth;
the adaptations above take precedence where host packaging or tool names differ.
