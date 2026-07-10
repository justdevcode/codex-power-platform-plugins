---
name: edit-canvas-app
version: 2.1.1-codex.1
description: Compatibility wrapper for older prompts. Use when the user asks to modify, update, change, or edit an existing Power Apps Canvas App. Delegates to the unified canvas-app workflow in EDIT mode.
author: Microsoft Corporation / Codex adaptation
---

# Edit a Canvas App

This is a compatibility wrapper. The preferred workflow is `$canvas-app`.

Use the unified `canvas-app` workflow in EDIT mode for the following requirements:

$ARGUMENTS

Follow:

```text
../canvas-app/SKILL.md
```

When applying that workflow, run `sync_canvas`, inspect the existing `.pa.yaml` files, and choose the simple or complex edit path from the unified skill. If the synced app appears empty, explain that the current app looks empty and offer to switch to CREATE mode.
