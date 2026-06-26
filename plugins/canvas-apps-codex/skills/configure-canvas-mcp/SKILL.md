---
name: configure-canvas-mcp
version: 2.1.0-codex.1
description: Configure the bundled Canvas Authoring MCP server for the current Power Apps Studio coauthoring session. Use when the user says configure MCP, set up MCP server, MCP not working, connect Canvas Apps MCP, canvas-authoring not available, MCP not configured, or set up canvas apps. Do not continue if prerequisites are missing; direct the user to install .NET 10 SDK first.
author: Microsoft Corporation / Codex adaptation
---

# Configure the Canvas Authoring MCP Server

This skill connects the bundled Canvas Authoring MCP server to the user's current Power Apps coauthoring session.

The MCP server is bundled by this plugin through `.mcp.json`. Do **not** write the server transport command to `~/.codex/config.toml`.

## Instructions

### 0. Check prerequisites

Verify that .NET 10 SDK or higher is installed:

```bash
dotnet --list-sdks
```

If a version `10.x.y` or higher is not listed, stop and tell the user:

> .NET 10 SDK is required to run the Canvas Authoring MCP server. Please install it first, restart Codex, and run this skill again: https://dotnet.microsoft.com/download/dotnet/10.0

If the user says it is already installed but the command still does not show it, explain that Codex may not be seeing `dotnet` on PATH. Ask them to confirm that `dotnet --list-sdks` works from the same terminal used to launch Codex.

### 1. Ask for the Studio URL

Ask the user for the full URL of their Canvas App Studio session if they have not already provided it.

The user should copy the URL from the browser address bar while the app is open in Power Apps Studio. It should look similar to:

```text
https://make.powerapps.com/e/Default-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/canvas/?action=edit&app-id=...
```

Tell the user to confirm coauthoring is enabled and keep the Power Apps Studio browser tab open for the entire Codex session. The MCP server communicates with Power Apps through the coauthoring session tied to that tab. Closing the tab can prevent `compile_canvas` and `sync_canvas` from working.

### 2. Extract parameters from the URL

Parse the following from the Studio URL:

- `environment_id`
- `app_id`
- `maker_hostname`
- `cluster_category`

Common URL patterns include:

```text
https://make.powerapps.com/e/<environment-id>/canvas/?action=edit&app-id=/providers/Microsoft.PowerApps/apps/<app-id>
https://make.powerapps.com/environments/<environment-id>/canvas/apps/<app-id>
```

Parsing rules:

- URL-decode values first.
- Environment ID is usually after `/e/`, after `/environments/`, or in an `environment` / `environmentId` query parameter.
- App ID may be in `app-id`, `appid`, `appId`, or a path segment after `/apps/`.
- If `app-id` contains `/providers/Microsoft.PowerApps/apps/<id>`, extract only `<id>`.
- Maker hostname is the URL hostname.

Determine `cluster_category` from the maker hostname:

| Maker hostname | cluster_category |
|---|---|
| `make.powerapps.com` | `prod` |
| `make.preview.powerapps.com` | `prod` |
| `make.gov.powerapps.us` | `gov` |
| `make.high.powerapps.us` | `high` |
| `make.apps.appsplatform.us` | `dod` |
| `make.powerapps.cn` | `china` |
| Any other hostname | `test` |

### 3. Connect the MCP server

Call the Canvas Authoring MCP server connect tool. It should normally be named:

```text
mcp__canvas-authoring__connect
```

Call it with:

```json
{
  "environment_id": "<extracted environment id>",
  "app_id": "<extracted app id>",
  "cluster_category": "<derived cluster category>"
}
```

Optional parameters:

- `login_hint`: include only if the user explicitly asked to connect as a specific account or UPN.
- `auth_flow`: include only if the user explicitly requested a specific auth flow, such as `browser` or `broker`.

Do not guess `login_hint` or `auth_flow`.

If the connect call fails, report the exact error and suggest checking that:

1. The Studio URL is correct and the browser tab is still open.
2. Coauthoring is enabled in the app settings.
3. .NET 10 SDK is correctly installed.
4. If sign-in failed, the user may need to specify `auth_flow` or `login_hint`.

### 4. Confirm

After the connection succeeds, tell the user:

> Canvas Authoring MCP server is configured for your coauthoring session.

Then suggest this verification:

```text
List available Canvas App controls
```

That should invoke `list_controls` through the `canvas-authoring` MCP server.
