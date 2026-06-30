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

## Install from this GitHub repo

After pushing this repository to GitHub, add it to Codex:

```powershell
codex plugin marketplace add https://github.com/justdevcode/codex-power-platform-plugins.git --ref main
```

Then start Codex and run:

```text
/plugins
```

Install **Canvas Apps for Codex** from **Power Platform Plugins**.

## First test

After installing the plugin:

```text
/mcp
```

Confirm `canvas-authoring` is listed.

Then run:

```text
$configure-canvas-mcp
```

Provide the Power Apps Studio URL when prompted.

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
