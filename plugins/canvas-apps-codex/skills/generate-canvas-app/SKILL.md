---
name: generate-canvas-app
version: 2.1.1-codex.1
description: Compatibility wrapper for older prompts. Use when the user asks to create, build, or generate a Power Apps Canvas App. Delegates to the unified canvas-app workflow in CREATE mode.
author: Microsoft Corporation / Codex adaptation
---

# Generate a Canvas App

This is a compatibility wrapper. The preferred workflow is `$canvas-app`.

Use the unified `canvas-app` workflow in CREATE mode for the following requirements:

$ARGUMENTS

Follow:

```text
../canvas-app/SKILL.md
```

When applying that workflow, treat the user's request as a new-app generation request. Still run `sync_canvas` first and detect the current app state. If the synced app is not empty, warn the user that the current Studio session appears to contain an existing app and ask before overwriting or making broad changes.
