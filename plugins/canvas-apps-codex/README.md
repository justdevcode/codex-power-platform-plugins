# Canvas Apps for Codex

A Codex-compatible Power Platform plugin for creating, editing, validating, and syncing Microsoft Power Apps Canvas Apps using natural language.

This plugin is adapted from Microsoft's official Canvas Apps plugin in the `microsoft/power-platform-skills` repository and adjusted so it can be installed and used as an OpenAI Codex plugin.

## What this plugin does

This plugin helps Codex work with Power Apps Canvas Apps through the Canvas Authoring MCP server.

It supports:

- configuring Codex to connect to a Power Apps Studio coauthoring session
- creating new Canvas Apps from natural language requirements
- editing existing Canvas Apps
- adding data sources through guided Power Apps Studio steps
- planning app screens and app structure
- writing `.pa.yaml` source files
- validating generated Canvas App source
- running additional Canvas App quality checks

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Codex CLI or Codex IDE extension with plugin support
- Access to the target Power Platform environment
- Access to the target Canvas App
- Power Apps Studio coauthoring enabled where required

The `$configure-canvas-mcp` skill checks `.NET 10 SDK` using:

```bash
dotnet --list-sdks
```

If no version `10.x.y` or higher is listed, install .NET 10 SDK, restart Codex, and run the configure skill again.

## Codex-specific changes

The original Microsoft plugin was not copied as-is. This version includes Codex-specific packaging and workflow adjustments.

Key changes include:

- added a Codex plugin manifest at `.codex-plugin/plugin.json`
- added bundled MCP configuration through `.mcp.json`
- converted the MCP file to Codex's direct server-map format
- removed the need to manually define the Canvas Authoring MCP server transport command in `~/.codex/config.toml`
- adapted the configure workflow so the MCP server is registered by the plugin and then connected to a Power Apps Studio session
- added compatibility entry points for `$generate-canvas-app` and `$edit-canvas-app`
- adjusted Claude-specific workflow wording so it makes sense in Codex

## Folder structure

This folder is the actual Codex plugin package.

```text
canvas-apps-codex/
├─ .codex-plugin/
│  └─ plugin.json
├─ .mcp.json
├─ AGENTS.md
├─ CLAUDE.md
├─ README.md
├─ skills/
├─ agents/
└─ references/
```

The parent repository may also contain:

```text
.agents/plugins/marketplace.json
```

That marketplace file is not part of this plugin package itself. It tells Codex where this plugin lives inside the repo.

## MCP configuration

The Canvas Authoring MCP server is defined in this plugin's `.mcp.json` file.

The plugin manifest points to it with:

```json
"mcpServers": "./.mcp.json"
```

This means the MCP server transport command is bundled with the plugin.

You should not need to manually add the main MCP server command to:

```text
~/.codex/config.toml
```

Codex may still use `config.toml` for plugin-scoped MCP settings such as enabling or disabling the server, or setting tool approval behaviour.

## Main skills

The preferred skill is:

```text
$canvas-app
```

Additional skills include:

```text
$configure-canvas-mcp
$add-data-source
$generate-canvas-app
$edit-canvas-app
$report-issue
```

`$generate-canvas-app` and `$edit-canvas-app` are compatibility wrappers. The preferred workflow is the unified `$canvas-app` skill.

## Typical usage

1. Open the Canvas App in Power Apps Studio.
2. Turn on coauthoring if required.
3. Copy the full Power Apps Studio URL.
4. In Codex, run:

```text
$configure-canvas-mcp
```

5. Provide the Power Apps Studio URL when prompted.
6. Confirm that the Canvas Authoring MCP server is connected.
7. Use:

```text
$canvas-app
```

to create or edit the app.

## Updating from Microsoft upstream

When Microsoft updates the original Canvas Apps plugin, compare and selectively update these folders/files:

```text
AGENTS.md
.mcp.json
skills/
agents/
references/
README.md
```

Do not blindly overwrite Codex-specific files unless intended:

```text
.codex-plugin/plugin.json
README.md
```

Also check for Claude-specific concepts such as:

```text
Task
AskUserQuestion
EnterPlanMode
ExitPlanMode
.plugin/plugin.json
```

These usually need Codex adaptation.

## Attribution

This plugin is adapted from Microsoft's Power Platform skills repository:

```text
https://github.com/microsoft/power-platform-skills/tree/main/plugins/canvas-apps
```

This adaptation is not an official Microsoft release and should not imply Microsoft sponsorship or endorsement.
