# featurebase-mcp

MCP server for the [FeatureBase](https://featurebase.app) REST API. Gives any MCP-compatible AI client (Claude Code, Claude Desktop, Cursor, Windsurf, Cline, etc.) full access to your FeatureBase workspace — feedback posts, changelogs, conversations, help center, users, and more.

## Tools (44 total)

| Category | Tools | Operations |
|----------|-------|------------|
| **Posts** | 4 | list, create, update, delete |
| **Upvoters** | 2 | list, add |
| **Comments** | 4 | list, create, update, delete |
| **Changelogs** | 4 | list, create, update, delete |
| **Changelog Publishing** | 2 | publish, unpublish |
| **Changelog Subscribers** | 3 | list, add, remove |
| **Users** | 4 | get, list, upsert, delete |
| **Custom Fields** | 2 | list, get |
| **Conversations** | 6 | list, get, create, update, delete, reply |
| **Help Center** | 11 | help centers (list, get), collections (CRUD), articles (CRUD) |
| **Utility** | 2 | resolve post slug, find similar posts |

## Prerequisites

- Node.js >= 18
- A [FeatureBase](https://featurebase.app) account
- A FeatureBase API key (Settings > API in your FeatureBase dashboard)

## Setup

### 1. Clone and build

```bash
git clone https://github.com/gkpacker/featurebase-mcp.git
cd featurebase-mcp
npm install
npm run build
```

### 2. Get your API key

Go to your FeatureBase dashboard → **Settings** → **API** → copy your API key.

### 3. Configure your MCP client

#### Claude Code

```bash
claude mcp add featurebase-mcp \
  -e FEATUREBASE_API_KEY=your_api_key_here \
  -- node /absolute/path/to/featurebase-mcp/build/index.js
```

To also enable slug resolution and similar posts (requires your org URL):

```bash
claude mcp add featurebase-mcp \
  -e FEATUREBASE_API_KEY=your_api_key_here \
  -e FEATUREBASE_ORG_URL=https://yourorg.featurebase.app \
  -- node /absolute/path/to/featurebase-mcp/build/index.js
```

#### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "featurebase": {
      "command": "node",
      "args": ["/absolute/path/to/featurebase-mcp/build/index.js"],
      "env": {
        "FEATUREBASE_API_KEY": "your_api_key_here",
        "FEATUREBASE_ORG_URL": "https://yourorg.featurebase.app"
      }
    }
  }
}
```

#### Cursor / Windsurf / Other MCP clients

Follow your client's MCP server configuration docs. The server runs on **stdio** transport. The command is:

```bash
node /absolute/path/to/featurebase-mcp/build/index.js
```

Environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `FEATUREBASE_API_KEY` | Yes | Your FeatureBase API key |
| `FEATUREBASE_BASE_URL` | No | API base URL (default: `https://do.featurebase.app/v2`) |
| `FEATUREBASE_ORG_URL` | No | Your org URL (e.g. `https://yourorg.featurebase.app`). Required for `resolve_post_slug` and `find_similar_posts`. |

You can also pass these as CLI arguments: `--api-key`, `--base-url`, `--org-url`.

## Usage examples

Once configured, you can ask your AI client things like:

- "List my top 10 most upvoted feature requests"
- "Create a changelog entry for the v2.1 release"
- "Reply to the latest conversation in Portuguese"
- "List all help center articles"
- "Create a new help center article about getting started"
- "Find posts similar to 'dark mode'"
- "Show me all users who upvoted post X"
- "Update the status of post X to 'In Progress'"

## Field selection

List tools support a `select` parameter that filters response fields using [json-mask](https://github.com/nemtsov/json-mask) syntax. This reduces token usage when you only need specific fields:

```
select: "id,title,upvotes,postStatus(name)"
```

## Development

```bash
# Run in development mode (no build step)
npm run dev

# Build
npm run build

# Run the built server
npm start
```

## License

MIT
