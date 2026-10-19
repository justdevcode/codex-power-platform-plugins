# Codex Runtime Contract

Read this before authoring or specialist work. These Codex host rules take precedence over
upstream examples of tool names, dispatch, synchronization and version repair. They do not
expand the user's authorized scope. The coordinator owns connection, synchronization,
shared YAML, compilation and communication; specialists own only assigned outputs.

## Installed root and tools

Resolve `${PLUGIN_ROOT}` from the installed skill's location (two directories above its
skill folder), or the explicit plugin root supplied by the coordinator. Verify the manifest
and references there. Never guess it from the current directory or an app repository.
Use absolute paths and Codex filesystem tools; use `apply_patch` with unique current-source
anchors instead of assuming Claude `Read`, `Write`, `Edit(old_str)` or `Bash` tools exist.

Contract evidence: the locally cached stable MCP package 1.1.29 was initialized and its
`tools/list` inspected without connecting to Studio. Its protocol server version reported
1.1.0.0. These are distinct versions. Recheck the active declarations because the unpinned
stable launch can resolve another package.

Inspect the actual exposed Canvas Authoring tool declarations before use. Host prefixes
may differ; bind a reference's operation to an exposed tool only after checking its
description and input schema. Tool names in prose do not register tools. Never fabricate
a missing operation, argument or successful result. Call `connect` before app operations.

| Operation | Contract and availability handling |
|---|---|
| `sync_canvas` | Takes `directoryPath`, an absolute local directory. Writes server YAML and can overwrite matching local names. Use the snapshot procedure below. |
| `compile_canvas` | The inspected schema requires `directoryPath`, an absolute app directory; recheck the active declaration. It validates/applies YAML; success does not prove interaction, rendering or persistence. Required for an applied-app completion claim. |
| `describe_control` | Takes `controlName` in the inspected server contract. Query the selected catalog identity, inspect complete creation keywords and properties, and refresh document-dependent metadata when relevant. |
| `assess_edit_execution` | The inspected contract accepts `assessmentJson` as an object or JSON string with the fields in EditWorkflow. The inspected server returns JSON in an MCP text content block. Parse that JSON and validate `executionTier` and `reasonCodes`, or explicit `validationError`; do not parse arbitrary prose as a tier. If missing, incompatible, denied or failed, report that fact and use the conservative Planned fallback without claiming a server assessment or inventing reason codes. |
| Applied-app diagnostics | Optional in EDIT only. `get_accessibility_errors` and `get_appchecker_errors` are exposed operations described as accessibility and app-quality diagnostics, respectively, with empty-object input schemas in the inspected server. Call with `{}` under that contract. Inspect the active schema, call only a compatible exposed operation, and report its actual output. They are not aliases for upstream `check_accessibility` or `check_app`; no response-shape or coverage equivalence is assumed. Missing diagnostics remain explicitly unrun and do not replace manual conformance or compilation. Never call these diagnostics in CREATE. |
| Stock imagery | `search_stock_images` is optional and was not exposed in the inspected environment. Only use it if a later session actually exposes a documented compatible schema; inspect the returned assets rather than assuming title/thumbnail fields. Otherwise use existing app media or user-provided assets. If imagery is essential and neither is available, return a specific feasibility gap for an asset or approved design change. Do not invent URLs, silently omit required imagery or claim an image search occurred. |

Required app discovery that fails is a blocker, not an empty catalog or permission to mock
data. An unavailable optional capability is reported only when relevant. Do not call
experimental blank-app creation or account removal tools as substitutes for missing tools.

## Snapshot synchronization and resume

The app working directory holds YAML and workflow Markdown. Never synchronize directly
into an existing working directory, repository root or plugin directory. At the start of
an authoring turn, or when resuming, reconcile Studio state before editing:

1. Wait for active writers to finish or stop them and confirm they stopped. Identify the
   connected environment/app and reuse its known working directory. Do not infer app identity
   merely from `App.pa.yaml`; ask when the target is ambiguous. For a new workspace choose a
   dedicated empty directory, not the repository/plugin root. Retain existing planning files.
2. Create a fresh empty snapshot directory outside the working directory and plugin, then
   call `sync_canvas(directoryPath: snapshot)`. On failure stop before mutation. Inspect all
   returned YAML, including `App.pa.yaml` and editor state; an incomplete snapshot is not a
   deletion instruction. Keep this snapshot immutable during reconciliation.
3. Compare three states per file: last reconciled server snapshot (base), current working
   YAML (local), and fresh server snapshot (remote). Retain a baseline snapshot outside the
   working directory and record its absolute path and environment/app identity in the
   coordinator-owned `[working directory]/canvas-sync-state.md`. It is a synchronization
   record, not a planning or acceptance artifact; Direct/Partitioned may use it.
4. With a verified base: unchanged local takes remote changes; unchanged remote preserves
   local drafts; equal local/remote needs no merge. If both differ from base and from one
   another, inspect and reconcile non-overlapping changes, preserving current user intent.
   Conflicting edits require a decision; never choose a side silently. Treat additions and
   deletions by the same rule. Never delete a locally modified file because remote lacks it.
5. Without a verified base (legacy workspace, lost snapshot, or changed app identity), equal
   files are safe; import remote into an empty workspace. For differing existing files,
   inspect both and establish which changes to retain before writing. Preserve the draft
   and report unresolved conflicts. Do not assume remote is newer or local is disposable.
6. Apply only reconciled YAML changes with filesystem tools. Preserve Markdown, unrelated
   files and uncommitted drafts. Record the fresh remote snapshot as the new base only after
   reconciliation succeeds; local pending changes remain differences against that base.
   Do not label them applied until compilation and relevant round-trip checks succeed.
7. Revalidate artifact revisions, approval, resource contracts and build status against
   reconciled YAML. Reuse unaffected plans. Do not resynchronize mid-build or let a hook
   overwrite the working copy. A later user request starts reconciliation again.

Retain the current base for later turns; if it disappears, use the no-base rule. Do not
store credentials in the sync record. Remove only disposable snapshots created by this
workflow, after checking their resolved paths and that they are not the active base.
Final round-trip verification uses a separate disposable snapshot and never overwrites
the working copy. The existing final verification/retry gates still apply.

## Specialist dispatch

Files under `agents/` are instruction sources, not automatically registered agent types.
For each assigned role, use available Codex `spawn_agent` with a unique task name and a
message directing it to read the absolute `agents/<role>.md` file. Supply the immutable
plugin root, working directory, original intent, scope/approval, artifact paths/revisions
and exact file ownership required by that role. Do not use `Task`, `task(...)`, `agent_type`,
`mode=sync`, model names or Claude/Copilot tool allowlists as executable Codex configuration.

CREATE stages 1-4 run sequentially with separate focused contexts; the coordinator checks
each artifact before the next stage. CREATE and Planned EDIT builders run in waves of at
most three, or fewer when host capacity is lower. Never run writers for the same file or
compile while any worker can mutate the app. Join every worker/follow-up before a gate.
Use host agent messaging/status tools to request targeted repairs; do not regenerate screens.

If delegation is unavailable or a worker cannot access required filesystem/MCP tools,
follow that role's instructions inline, sequentially, with the same ownership and gates.
If work already began, stop/join the worker and inspect its outputs before taking ownership.
Preserve experience-only stage boundaries even inline. Partitioned EDIT remains sequential
in the coordinator; do not add parallel dispatch merely because Codex supports it.

## Authorization and finalization

Use the user's existing authorization and explicit constraints. Present the concrete
experience proposal for CREATE and Planned EDIT; record approval evidence and covered
revisions. Prior explicit approval of that proposal remains valid. Ordinary unspecified
creation requests do not authorize an undisclosed mock substitution or replacement of an
existing app. Ask only for missing material decisions or uncovered scope; no per-stage
approval, duplicate mock approval, or extra Direct/Partitioned approval is needed.

Complete worker joins, filesystem inspection, evidence, optional EDIT diagnostics and
snapshot cleanup before final compilation. Keep `compile_canvas` the final app-work tool
call before the success summary; any later app work requires repeating that gate. Follow
higher-priority host instructions if they require other actions, and never conceal a
post-compile mutation. Report static conformance, compilation, server verification and
rendered/runtime testing separately.
