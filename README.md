# Mangools MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node 18+](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

Model Context Protocol (MCP) server that exposes the full [Mangools SEO API](https://apidocs.mangools.com/) as **77 individual tools** for [Claude Code](https://claude.com/claude-code) and other MCP clients.

Covers every product in the Mangools suite:

| Product | What it does | Tools |
|---|---|---|
| **KWFinder** | Keyword research, related/competitor keywords, KD, trends, lists | 19 |
| **SERPWatcher** | Rank tracking, trackings, reports, annotations, tags | 26 |
| **SERPChecker** | Detailed SERP analysis with ~50 SEO metrics per result | 3 |
| **LinkMiner** | Backlink discovery, URL metrics, exports | 9 |
| **SiteProfiler** | Domain authority overview, audience, competitors, top content | 6 |
| **AI Search Watcher** | Brand visibility across ChatGPT, Gemini, Claude, Google AI Overview, … | 12 |
| **Shared (locations)** | Geotargeting locations used across products | 2 |
| | **Total** | **77** |

Every tool was smoke-tested live against the Mangools API. 75/77 work as documented. The remaining 2 (`serpchecker/serps/reset` and `serpchecker/serps/{serp_id}/snapshot`) appear to be Mangools-side issues — see [Known limitations](#known-limitations).

---

## Prerequisites

- **Node.js ≥ 18** (uses native `fetch`).
- **pnpm** (or npm / yarn — examples use pnpm).
- A **Mangools API token** — get one at [mangools.com/api-token](https://mangools.com/api-token). The free plan works for basic endpoints; paid plans unlock the full surface.
- An MCP-capable client — these instructions target **Claude Code**, but any MCP client supporting `stdio` transport works (Claude Desktop, Cline, etc.).

## Install

```bash
git clone https://github.com/l-media/mangools-mcp-server.git
cd mangools-mcp-server
pnpm install
pnpm build
```

The build produces `dist/index.js` — that's the entry point your MCP client will run.

## Configure Claude Code

There are two scopes for MCP config:

- **Project-scoped** (`.mcp.json` in your project root) — recommended when you only need Mangools for a specific project.
- **User-scoped** (`~/.claude.json` or via `claude mcp add`) — recommended when you want Mangools available everywhere.

### Option A: project-scoped `.mcp.json`

Copy the template and edit it:

```bash
cp .mcp.json.example .mcp.json
```

Then open `.mcp.json` and fill in two things — the absolute path to `dist/index.js` and your API token:

```json
{
  "mcpServers": {
    "mangools": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/mangools-mcp-server/dist/index.js"],
      "env": {
        "MANGOOLS_API_TOKEN": "your_real_token_here"
      }
    }
  }
}
```

> **Security:** `.mcp.json` is git-ignored in this repo so your token never gets committed. If you add this MCP server to another project, make sure that project's `.gitignore` covers `.mcp.json` too.

### Option B: user-scoped via CLI

From any directory:

```bash
claude mcp add mangools \
  --scope user \
  --env MANGOOLS_API_TOKEN=your_real_token_here \
  -- node /ABSOLUTE/PATH/TO/mangools-mcp-server/dist/index.js
```

### Activate the server

In Claude Code:

```
/mcp
```

You should see `mangools` listed as **connected**. The 77 tools will appear under the `mcp__mangools__*` prefix.

## Usage examples

Once connected, you can ask Claude Code things like:

- *"Get keyword limits for my Mangools account."* → `kwfinder_get_limits`
- *"Show me related keywords for 'seo tools' in the US in English."* → `kwfinder_get_related_keywords` with `kw=seo tools`, `location_id=2840`, `language_id=1`
- *"Get a SERP analysis for 'best vpn' in the UK."* → `serpchecker_get_serps` with `kw=best vpn`, `location_id=2826`
- *"List all my SERPWatcher trackings and pull details for each one."* → `serpwatcher_get_trackings` → loop → `serpwatcher_get_tracking_detail`
- *"What's the backlink profile of mangools.com?"* → `siteprofiler_get_backlink_profile` with `url=mangools.com`
- *"Which AI models can I monitor in AI Search Watcher?"* → `aiwatcher_get_models`

The `mangools_get_locations` and `mangools_get_location` tools help you discover/resolve `location_id` values for any geotargeted query.

## Tool reference

All tools follow a consistent input shape:

- **Path parameters** (e.g. `tracking_id`, `list_id`, `id`) are explicit named fields when the endpoint includes them.
- **`query`** — optional object whose entries become URL querystring params. Arrays become repeated keys; objects are JSON-encoded.
- **`body`** — optional JSON body, sent as `application/json`. Only present on non-GET methods.

Every tool's description includes the HTTP method and path, so when you read the tool list in your MCP client you immediately see what each one calls.

### Discovered body schemas

A few endpoints have body requirements the Mangools docs don't spell out clearly. These were confirmed via live 422 responses:

| Endpoint | Required body fields |
|---|---|
| `POST /kwfinder/lists` | `name`, `keyword_ids[]` |
| `POST /kwfinder/keywords` (CSV export) | `keyword_ids[]` (IDs from `/keyword-imports`, **not** raw strings), `location_id`, `language_id` |
| `POST /kwfinder/gap-analysis` | `domain` (not `base_url`), `competitors[]` (≤5), `location_id` — `language_id` is rejected |
| `POST /serpwatcher/trackings` | `domain`, `keywords[]`, `location_id`, `platform_id` (1=mobile, 2=desktop) |
| `POST /serpwatcher/multiple-trackings` | `domain`, `keywords[]`, `location_ids[]`, `platform_ids[]` |
| `POST /serpwatcher/.../tracked-keywords` | `keywords[]` |
| `DELETE /serpwatcher/.../tracked-keywords` | `tracked_keyword_ids[]` |
| `POST /serpwatcher/.../reports` | `name` (also accepts `type`, `emails[]`, `triggers[]`) |
| `POST /serpwatcher/.../annotations` | `date`, `text` |
| `POST /serpwatcher/.../tags` | `name` |
| `POST /aiwatcher/monitor` | `platform_id`, `brand`, `domain`, `models[]`, `prompts[]` |
| `POST /aiwatcher/prompts/generate` | `platform_id`, `brand`, `domain` |
| `POST /aiwatcher/monitor/{id}/prompts` | `prompts[]` |
| `DELETE /aiwatcher/prompts` | `prompt_ids[]` |

### Quirks worth knowing

- **`POST /kwfinder/competitor-keywords`** reads its params from the **querystring**, not from a JSON body, despite being a POST.
- **All `/siteprofiler/*` endpoints take `url=`, not `domain=`** — passing `domain=` returns `422 "Parameter url is mandatory"`.
- **Idempotent deletes**: `DELETE /kwfinder/lists/{list_id}` returns `204` even when the list doesn't exist.
- **Legacy SERPWatcher tracking endpoint**: `GET /serpwatcher/trackings/{tracking_id}` may return `404` for trackings that exist and respond fine to `/detail`. Prefer `/detail` and `/stats`.

### Response sizes

Several endpoints return very large JSON (hundreds of KB to multiple MB). The MCP tool returns 200 OK with full data, but your client may truncate. Endpoints to watch:

- `kwfinder_get_related_keywords`, `kwfinder_get_competitor_keywords`, `kwfinder_get_suggested_keywords`, `kwfinder_gap_analysis`
- `linkminer_get_links`
- `siteprofiler_get_overview`, `siteprofiler_get_backlink_profile`
- `serpwatcher_get_tracking_detail`, `serpwatcher_get_tracking_stats`, `serpwatcher_get_tracked_keywords` (for trackings with many keywords)

Paginate where possible (`page`, `links_per_domain`) or filter aggressively.

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MANGOOLS_API_TOKEN` | yes | — | Your Mangools API key. |
| `MANGOOLS_BASE_URL` | no | `https://api.mangools.com/v3` | Override the API base URL (rarely needed). |

## Known limitations

These are **Mangools-side issues**, not bugs in the MCP server — the tool wiring is correct, the API itself behaves unexpectedly:

- **`GET /serpchecker/serps/reset`** returns `500 RangeError: "n must be a non-negative number"` for every parameter combination tried, including the canonical example from the official docs (`?kw=string&location_id=0`). Workaround: use the regular `serpchecker_get_serps` (already serves fresh-enough data via cache).
- **`GET /serpchecker/serps/{serp_id}/snapshot`** returns `401 AuthError: "Unknown client"` even with a valid `serp_id` returned moments earlier by `/serpchecker/serps`. The endpoint appears restricted to Mangools' web-app session, not API tokens. Workaround: use the `serp_source_url` field returned inside `/serpchecker/serps` — it points directly to the S3-hosted HTML snapshot.

Both issues have been reported to Mangools support. The corresponding MCP tools still exist (`serpchecker_reset_serps`, `serpchecker_get_snapshot`) so they'll work automatically once Mangools fixes them server-side.

## Architecture

```
src/
├── endpoints.ts   declarative list of all 77 endpoints (method, path, name, description)
├── client.ts      fetch wrapper: x-access-token header, path-param substitution, query string, JSON body
└── index.ts       MCP server bootstrap, dynamic tool registration, stdio transport
```

Adding a new endpoint is a single entry in `src/endpoints.ts` — the server registers it automatically. The HTTP client handles all parameter substitution.

## Development

```bash
pnpm install
pnpm dev          # tsc --watch
```

For local manual testing of the stdio interface, you can pipe JSON-RPC into a fresh process:

```bash
MANGOOLS_API_TOKEN=dummy node -e '
const { spawn } = require("child_process");
const child = spawn("node", ["dist/index.js"], { stdio: ["pipe","pipe","inherit"], env: { ...process.env } });
child.stdout.on("data", d => console.log(d.toString()));
child.stdin.write(JSON.stringify({jsonrpc:"2.0",id:1,method:"initialize",params:{protocolVersion:"2024-11-05",capabilities:{},clientInfo:{name:"probe",version:"0"}}})+"\n");
setTimeout(()=>process.exit(0), 1000);
'
```

You should see an `InitializeResult` come back announcing the 77 tools.

## Contributing

Bug reports and PRs welcome at [github.com/l-media/mangools-mcp-server](https://github.com/l-media/mangools-mcp-server). For the underlying API behaviour, please report to Mangools directly — this repo only wraps their API.

## License

[MIT](./LICENSE) © Lince Media LLC

---

This project is not affiliated with or endorsed by Mangools. "Mangools", "KWFinder", "SERPWatcher", "SERPChecker", "LinkMiner", "SiteProfiler" and "AI Search Watcher" are trademarks of their respective owners.
