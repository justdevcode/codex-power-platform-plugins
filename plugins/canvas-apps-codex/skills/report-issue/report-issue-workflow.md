# Report Issue

Prepare and, only after explicit approval, file a public GitHub issue for the Canvas Apps
Codex plugin or its Microsoft upstream workflow.

**Initial request:** $ARGUMENTS

Before gathering details, warn the user that the issue will be public. Do not include
credentials, internal URLs, tenant or environment IDs, customer data, proprietary code,
access tokens, or other sensitive information.

## 1. Identify the Package and Destination

Read `${PLUGIN_ROOT}/.codex-plugin/plugin.json` and record its `name` and `version`.

Choose the issue destination from the reported problem:

- Codex packaging, installation, hooks, marketplace behavior, or a Codex-only adaptation:
  `justdevcode/codex-power-platform-plugins`.
- Behavior reproduced in the unmodified Microsoft Canvas Apps workflow or its shared reference
  guidance: `microsoft/power-platform-skills` with plugin name `canvas-apps`.
- If the cause is unclear, default to the JustDev repository and state that maintainers can
  upstream it after triage.

Tell the user which public repository will receive the issue before requesting approval.

## 2. Gather Details

Extract everything already supplied in `$ARGUMENTS`, then ask only for missing information:

1. Skill or command being used.
2. Concise bug description.
3. Steps to reproduce.
4. Expected behavior.
5. Actual behavior.
6. Optional logs or screenshots.

Ask whether the user wants environment details collected before running any environment command.
If approved, collect only:

- OS name and version.
- `codex --version`.
- `pac help` version information, when PAC CLI is relevant and installed.
- Plugin package name and version from the manifest.

If a command is unavailable, record `not installed` rather than installing anything. Redact
sensitive values from collected output and ask the user to review it.

Use `update_plan` for progress tracking when it is available. Otherwise keep the workflow state
in the conversation; do not require a separate task tool.

## 3. Preview

Show the complete issue exactly as it will be filed:

```text
===== ISSUE PREVIEW =====

Repository: <owner/repository>
Title: [Bug] <short summary>

Plugin: <canvas-apps-codex or canvas-apps>
Codex Package Version: <version>
Skill / Command: <skill or N/A>

Bug Description:
<description>

Steps to Reproduce:
<steps>

Expected Behavior:
<expected>

Actual Behavior:
<actual>

Relevant Logs / Screenshots:
<logs or None>

Environment:
<environment details or None>

Labels: bug

---
This issue was prepared using the $report-issue skill.

===== END PREVIEW =====
```

Remind the user that the destination is public and ask for explicit approval. If they request
changes, update the preview and ask again. Do not create the issue without approval.

## 4. Create the Issue

After approval, verify that `gh` is installed and authenticated. Create the issue with
`gh issue create` against the approved repository. Use a temporary body file or another safe
argument mechanism that preserves formatting; do not interpolate untrusted issue text into an
executable shell command.

Apply only the `bug` label unless another label has been verified to exist in the destination
repository. Capture and display the created issue URL.

If authentication, permissions, validation, or network access fails, do not retry indefinitely.
Report the exact failure and leave the approved title and body ready for the user to submit
manually.

## 5. Finish

Return the issue URL when creation succeeds. Otherwise return the final approved issue content and
the destination repository. Never claim an issue was created unless `gh` returned its URL.
