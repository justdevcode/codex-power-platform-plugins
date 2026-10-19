# AGENTS.md — Canvas Apps for Codex

This plugin authors Power Apps Canvas Apps through a live Studio coauthoring session.
Keep the Studio tab open. Read references/CodexRuntime.md before app work; it owns host
capability checks, snapshot reconciliation, Codex dispatch and authorization conventions.

## Architecture and entrypoints

Preserve .codex-plugin/plugin.json, the wrapped Codex .mcp.json server map, marketplace
identity, hooks/hooks.json registration, and the four supported skills:

- $canvas-app: staged CREATE and Direct / Partitioned / Planned EDIT.
- $configure-canvas-mcp: connect to the open Studio session.
- $add-data-source: guide Studio-managed connection changes and verify them.
- $report-issue: preview an issue, choose the correct repository and obtain submission approval.

The former generate/edit compatibility wrappers remain removed. Do not import upstream
.plugin, .claude-plugin, root Copilot hooks or host-specific skill frontmatter.

## Specialists and references

CREATE uses canvas-create-functionality, canvas-create-screens, canvas-create-layout,
canvas-create-discovery and canvas-create-builder. The first four run sequentially.
EDIT planning uses canvas-app-planner; Planned EDIT screens use canvas-screen-builder.
These agents/*.md files are instruction sources supplied explicitly to Codex spawn_agent,
not registered agent types. Keep each role's context and output ownership bounded.
Use at most three concurrent builders, subject to host capacity; join the whole wave
before compiling. If delegation or worker tools are unavailable, execute the same roles
inline and sequentially. Partitioned EDIT is sequential in the coordinator.

References are loaded on demand. CreateWorkflow routes to experience stages,
CreateImplementation, CreateBuilderCore, topic modules and CreateValidation. EditWorkflow
routes to EditConformance, PlanModel and its artifact documents, PlannedEditHandoff and
ValidationWorkflow. BehaviorCore, MutationBehavior, DataBehavior and the control/layout/
Power Fx/YAML guides provide scoped rules. QAChecks has 44 checks; CREATE uses its own
conformance routing rather than loading all legacy checks. PlanTemplates is retired.

## Ownership and synchronization

Call connect before app operations. Inspect actual tool schemas; do not invent missing
operations or equate similar names. Optional diagnostics/imagery and assessment fallback
are defined in CodexRuntime. The coordinator owns App.pa.yaml, _EditorState.pa.yaml,
shared contracts, synchronization and compilation. Builders own one screen; the EDIT
planner writes only plans and never compiles or writes app YAML.

Synchronize only into fresh external snapshots. Reconcile current working YAML against
the retained server baseline and new snapshot, preserving local drafts and Markdown.
Resolve conflicts before editing; no hook or specialist may overwrite the working copy.
Use a separate snapshot for final server verification. Never derive the immutable plugin
root from the app workspace, and never synchronize into the installed plugin.

## Quality and preservation

- Describe selected controls directly; copy complete creation keywords for new instances.
- Preserve existing names, versions, bindings, layout and feedback outside the approved delta.
- Never independently add or strip a version suffix, or migrate preserved controls merely
  because current metadata differs. Reconcile incompatible contracts explicitly.
- New control names are app-wide unique. Use exact returned enums and supported properties.
- Compile shared initialization, after builder waves and after targeted repairs.
- Repair existing screens in place; do not regenerate them for compiler diagnostics.
- Complete all workers and evidence before final compilation. Distinguish static checks,
  compile results, server-state verification and actual rendered/runtime tests.
- Keep Codex issue routing and explicit public-submission approval intact.

## Release baseline

Package 3.1.0-codex.1 incorporates Microsoft Canvas Apps v3.1.0 from source snapshot
8a10052386a56376bb47162a0e2094d727164b94. Repository static validation passed; live Power Apps
Studio testing was skipped. See README.md's Validation section for coverage and unresolved
host/runtime validation limits. This baseline records incorporated source, not live-test
certification. Preserve these qualifications in release communications.
