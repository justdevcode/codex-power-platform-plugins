# Codex Power Platform Plugins

This repository is a Codex plugin marketplace containing a Codex-compatible Canvas Apps plugin.

## Structure

```text
.
├─ .agents/
│  └─ plugins/
│     └─ marketplace.json
└─ plugins/
   └─ canvas-apps-codex/
      ├─ .codex-plugin/
      │  └─ plugin.json
      ├─ .mcp.json
      ├─ AGENTS.md
      ├─ README.md
      ├─ skills/
      ├─ agents/
      └─ references/
```

The `.agents/plugins/marketplace.json` file tells Codex where the plugin lives inside this repo. The actual plugin is under `plugins/canvas-apps-codex/`.

## Install the plugin

Add the published marketplace repository to Codex:

```powershell
codex plugin marketplace add https://github.com/justdevcode/codex-power-platform-plugins.git --ref main
```

Adding the marketplace only makes the plugin available. You still need to install the plugin before its skills and MCP server are available in Codex.

Start Codex and run the plugins command:

```text
/plugins
```

In the plugins view:

1. Find the **Power Platform Plugins** marketplace.
2. Select **Canvas Apps for Codex**.
3. Install the plugin.

After installation, restart Codex if prompted.

## Verify the installation

After installing the plugin:

```text
/mcp
```

Confirm `canvas-authoring` is listed.

Then run:

```text
$configure-canvas-mcp
```

Open the target Canvas App in Power Apps Studio, then provide the Power Apps Studio URL when prompted.

## Source and attribution

The plugin is adapted from Microsoft's Power Platform skills repository:

```text
https://github.com/microsoft/power-platform-skills/tree/main/plugins/canvas-apps
```

It also references the earlier Codex port by Ratnam Mishra:

```text
https://github.com/Ratnam-Mishra/canvas-apps-plugin-codex
```

This repository is not an official Microsoft release.
