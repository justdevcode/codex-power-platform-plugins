# Canvas Apps for Codex

A Codex-compatible port of Microsoft's Canvas Apps plugin for creating, editing, validating,
and syncing Power Apps Canvas Apps through a live Power Apps Studio coauthoring session.

Prepared for release as **3.1.0-codex.1**, adapting Microsoft Canvas Apps plugin
**v3.1.0** at the incorporated source snapshot
[`8a10052386a56376bb47162a0e2094d727164b94`](https://github.com/microsoft/power-platform-skills/commit/8a10052386a56376bb47162a0e2094d727164b94).

**Repository static validation passed; live Power Apps Studio testing was skipped.**
See [validation](#validation) for coverage and remaining limitations.

## Capabilities

- Create an app through functionality, screens, composition, feasibility and implementation stages.
- Assess edits as Direct, sequential Partitioned, or Planned; preserve unaffected behavior.
- Generate and modify `.pa.yaml` files with responsive layouts and Power Fx.
- Validate changes through `compile_canvas` and converge on clean diagnostics.
- Guide users through adding Studio-managed data sources and connectors.
- Reconcile Studio snapshots with local drafts before edits; retain planning artifacts.

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

The MCP launch now selects the stable package channel. Optional server tools are detected
from their actual schemas. Missing stock-image search does not prevent using existing or
user-provided assets; essential missing imagery remains an explicit feasibility gap.
Diagnostic operations are optional EDIT evidence, not proof of runtime behavior.

## Codex adaptations

The Microsoft workflow and reference documents are retained as closely as possible. Host-specific
changes are limited to:

- `.codex-plugin/plugin.json` packaging and the existing marketplace identity.
- Codex `$skill-name` invocation syntax and supported skill frontmatter.
- Codex subagent dispatch, with an inline sequential fallback when subagents are unavailable.
- Codex filesystem, planning, and user-input conventions.
- A Codex `UserPromptSubmit` hook using `${PLUGIN_ROOT}`, retaining its output protocol and
  registration while reminding the coordinator to reconcile an external snapshot.
- A Codex MCP server map under the supported `mcpServers` wrapper in `.mcp.json`.

The reference set includes 29 upstream v3.1.0 documents plus `references/CodexRuntime.md`.
CREATE has five specialist roles; EDIT has a planner and screen builder. The coordinator
owns shared YAML and compilation. See CodexRuntime for tool contracts, sequential fallback,
workspace reconciliation and control-version preservation. Installed hooks require host
trust; a missing or untrusted reminder does not remove the skill's synchronization rules.

## Validation

For this release preparation, `node scripts/validate-canvas-plugin.cjs` and
`git diff --check` passed. The repository validator checks JSON, package and marketplace
identity, the wrapped MCP map, hook registration, four skill entrypoints, seven specialist
frontmatters, 173 concrete plugin references, Markdown fences and 44 ordered QA checks.
Frontmatter validation covers the package's restricted YAML subset, not general YAML.

During the upgrade, the hook compiled with zero warnings/errors and passed five isolated
input/output checks. The cached stable MCP package 1.1.29 exposed the inspected schemas
and passed five pure assessment cases without connecting to Studio. These checks do not
prove fresh installation or live app behavior.

**Live Power Apps Studio testing was skipped.** App compilation/application, snapshot
reconciliation, real control metadata, diagnostic responses, rendering, navigation,
mutations, accessibility and persistence remain unverified in a live session. Installed
Codex hook activation and specialist tool access were also not tested.

The official Python validators could not run because Python was unavailable. The bundled
plugin validator checks the supported `mcpServers` wrapper; fresh target-host ingestion
remains unverified. Stock-image search was absent from the inspected server, so workflows
use existing/user-provided assets or report an essential-asset blocker. No equivalence with
unavailable upstream tool names is assumed.

## Attribution

Adapted from [Microsoft's Power Platform skills repository](https://github.com/microsoft/power-platform-skills/tree/main/plugins/canvas-apps)
under the MIT License. This port is independently maintained and is not an official Microsoft
release or endorsement.
