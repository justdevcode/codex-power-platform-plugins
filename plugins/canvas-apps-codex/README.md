# Canvas Apps for Codex

A Codex-compatible port of Microsoft's Canvas Apps plugin for creating, editing, validating,
and syncing Power Apps Canvas Apps through a live Power Apps Studio coauthoring session.

This release tracks Microsoft Canvas Apps plugin **v3.0.3** at commit
[`0b9b038`](https://github.com/microsoft/power-platform-skills/commit/0b9b0389607c6c45c1dfee2714f4c12f152111f3).

## Capabilities

- Create a Canvas App from natural-language requirements.
- Make direct targeted edits or plan complex multi-screen changes.
- Generate and modify `.pa.yaml` files with responsive layouts and Power Fx.
- Validate changes through `compile_canvas` and converge on clean diagnostics.
- Guide users through adding Studio-managed data sources and connectors.
- Inject a prompt-time reminder to sync the current coauthoring session before edits.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0).
- Codex with plugin support.
- Access to the target Power Platform environment and Canvas App.
- Power Apps Studio open with coauthoring enabled. Keep the Studio tab open throughout the
  session; closing it ends the coauthoring connection.

Verify the SDK with:

```powershell
dotnet --list-sdks
```

## Skills

| Skill | Purpose |
|---|---|
| `$canvas-app` | Unified create and edit workflow; automatically selects CREATE or EDIT mode |
| `$configure-canvas-mcp` | Connect the bundled Canvas Authoring MCP server to the open Studio app |
| `$add-data-source` | Guide a Studio data-source or connector addition and verify it |
| `$report-issue` | Prepare a public issue safely and create it only after approval |

The former `$generate-canvas-app` and `$edit-canvas-app` compatibility wrappers were removed in
v3. Use `$canvas-app` for both workflows.

## Connect and use

1. Open the target app in Power Apps Studio and enable coauthoring.
2. Keep the Studio browser tab open.
3. Run `$configure-canvas-mcp` and provide the full Studio URL.
4. Run `$canvas-app` with the app requirements or requested changes.

The plugin bundles the MCP server command through `.mcp.json`; do not duplicate that command in
`~/.codex/config.toml`. The connect workflow supports optional `auth_flow`, `login_hint`,
`tenant_id`, and `force_account_select` values when a user requests them or sign-in recovery
requires them. It never derives identity or tenant values from the Studio URL.

## Codex adaptations

The Microsoft workflow and reference documents are retained as closely as possible. Host-specific
changes are limited to:

- `.codex-plugin/plugin.json` packaging and the existing marketplace identity.
- Codex `$skill-name` invocation syntax and supported skill frontmatter.
- Codex subagent dispatch, with an inline sequential fallback when subagents are unavailable.
- Codex filesystem, planning, and user-input conventions.
- A Codex `UserPromptSubmit` hook using `${PLUGIN_ROOT}`.
- A direct Codex MCP server map in `.mcp.json`.

The complete v3 reference set is in `references/`: YAML syntax, controls, layouts, GridLayout,
Power Fx, design, QA, plan templates, create/edit routing, and validation convergence.

## Attribution

Adapted from [Microsoft's Power Platform skills repository](https://github.com/microsoft/power-platform-skills/tree/main/plugins/canvas-apps)
under the MIT License. This port is independently maintained and is not an official Microsoft
release or endorsement.
