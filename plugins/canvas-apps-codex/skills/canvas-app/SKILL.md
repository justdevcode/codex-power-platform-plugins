---
name: canvas-app
description: Creates or edits a Power Apps Canvas App through the Canvas Authoring MCP coauthoring session. Handles staged experience design, direct and partitioned targeted edits, planned multi-screen changes, responsive layout, and compile-error convergence. Trigger on requests to create, build, generate, modify, update, change, fix, or edit a Canvas App or .pa.yaml files.
---

# Create or Edit a Canvas App

Create or edit a Power Apps canvas app using the user's request and conversation context.

## Establish the Workspace and Capabilities

Read `${PLUGIN_ROOT}/references/CodexRuntime.md` before app tools or file changes.
It defines the installed root, tool schema checks, snapshot reconciliation, specialist
execution and finalization rules. Connect through `$configure-canvas-mcp` if needed.
Use the existing app workspace and a fresh external sync snapshot; preserve local drafts
and Markdown artifacts through the documented three-way reconciliation. Do not synchronize
into the authored working directory. Stop on failed sync or unresolved conflicts.

CREATE uses `canvas-create-functionality`, `canvas-create-screens`,
`canvas-create-layout`, `canvas-create-discovery`, and `canvas-create-builder`.
Planned EDIT uses `canvas-app-planner` and `canvas-screen-builder`. These are bundled
instruction files dispatched with Codex tools, with a sequential inline fallback.
The coordinator owns synchronization and compilation. Use only exposed tools whose
schemas have been checked; optional imagery and diagnostic operations have explicit
unavailable-capability handling in CodexRuntime.

## Reference reuse

References are immutable during a conversation. Reuse successfully read content in the same context; read again only when a previous result failed, was truncated, or did not cover the needed section. Use bounded ranges for large files. A specialist has a separate context and must read its own required references.

This does not apply to `[working directory]`: YAML is reconciled against a fresh Studio snapshot before each authoring turn under CodexRuntime, and files may change during work. Read current affected source before editing or resuming; retained planning artifacts do not establish current document state or authorization.

## Route by intent and current state

Unless the request is harmful, inspect the requested target and synchronized YAML. Distinguish a missing target screen, an existing blank screen without meaningful visible leaf controls, and a populated screen; empty containers do not make a screen populated.

| Request | Workflow |
|---|---|
| Establish a new app experience, including a one-screen app | `${PLUGIN_ROOT}/references/CreateWorkflow.md` |
| Change an existing app, including adding a missing screen or a leaf to a blank screen | `${PLUGIN_ROOT}/references/EditWorkflow.md` |

Load only the selected workflow. A creation request does not authorize overwriting a meaningful existing app; clarify replacement intent first.

CREATE follows its five stages, approval, implementation and validation references. It never uses the EDIT planner or Planned EDIT handoff.

Direct and sequential Partitioned EDIT stay in this context without planner, builders or planning/acceptance artifacts. Planned EDIT, including the Partitioned runtime fallback, uses the planner and then `${PLUGIN_ROOT}/references/PlannedEditHandoff.md`. That reference owns handoff acceptance, screen waves and shared-file application.

## Shared authoring invariants

1. **Metadata:** Describe selected controls in the implementing context. For new controls, copy the returned creation keywords, required variants and component identity; list/query identities are not necessarily YAML `Control` values. Set only supported inputs and read only exposed outputs. Refresh document-dependent descriptions after relevant changes.
2. **Preservation:** In EDIT, retain existing names, versions, untouched properties, live bindings, layout and feedback outside the approved delta. Current metadata is not permission to upgrade. If a required change conflicts with the preserved contract, report that conflict rather than normalize the app.
3. **Enum syntax:** Use the exact returned enum identity, escaped as a Power Fx identifier when needed: `='ButtonCanvas.Appearance'.Primary` for a dotted name, `=ButtonAppearance.Primary` only when that name is returned, and `=DecimalPrecision.'1'` for a non-simple member.
4. **Names:** New control names are app-wide unique. Builders use the assigned screen prefix after the control-type abbreviation, such as `conDiscNavBar`. Preserve existing names on Modify; renaming can break consumers on other screens.
5. **Scope:** Implement requested or approved actions that are not harmful, not universal CRUD or speculative features. Exclude harmful clauses from planning and implementation; coverage and completion requirements do not require harmful actions. Use each workflow's source, identity, feedback and preservation contracts. Failed discovery is not an empty result or permission to substitute mock data.
6. **Ownership:** Builders write exactly one assigned screen. The coordinator owns `App.pa.yaml`, `_EditorState.pa.yaml`, shared contracts and compilation. Do not edit or compile while a worker can still change the affected files.
7. **Initialization:** CREATE reuses `Screen1` for the landing screen and sets `App.StartScreen` to `=Screen1`. Do not introduce navigation from `App.OnStart` or the landing screen's `OnVisible`. Initialize shared data once, not on every screen visit; compact mock data is valid only within its approved scope.
8. **Compilation:** Apply and compile shared initialization before screen dispatch, then compile after each wave. Follow `${PLUGIN_ROOT}/references/CreateValidation.md` for CREATE or `${PLUGIN_ROOT}/references/ValidationWorkflow.md` for EDIT. Repair in place while verified progress continues; pending-screen references require building those screens, not deleting navigation.
9. **Completion:** Finish workers, inspections, repairs and artifact writes before the final successful `compile_canvas`. It must be the final app-work tool call before the summary; later work requires repeating the final gate. Do not claim completion with unresolved blocking issues, or runtime behavior from static evidence.
