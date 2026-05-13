# Host configurations

This agent runs on **OpenClaw** by default (see top-level `openclaw.json`). It uses **two** MCPs in tandem:

1. **`sera-mcp`** (canonical execution layer — clone separately from [github.com/Josh-sera/sera-mcp](https://github.com/Josh-sera/sera-mcp))
2. **`sera-fx-tools`** (this repo — `mcp/sera-fx-tools/`, read-only thinking tools)

Every host below registers BOTH MCPs. Snippets assume `sera-mcp` is built at `$HOME/sera-mcp/dist/index.js` — change the path if yours differs.

| Host | Setup |
|---|---|
| OpenClaw | Out of the box — `openclaw.json` is in repo root, `openclaw start` from this dir |
| Hermes | Add the `mcpServers` block from `hermes.mcp.json` to your Hermes config |
| NanoClaw | Drop `nanoclaw.mcp.json` into your NanoClaw workspace root as `.mcp.json` |
| Claude Code | Two `claude mcp add` invocations — see below |
| Claude Desktop | Standard `mcpServers` block, see `claude-desktop.json` |
| Cursor | Settings → MCP → use the same JSON as Claude Desktop |
| OpenAI Agents SDK | Two `MCPServerStdio` entries (one per MCP) |

## Hermes

Hermes (Nous Research, [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)) supports MCP natively as of v0.13.0 AND can import OpenClaw skills via `~/.hermes/skills/openclaw-imports/`. Two paths:

**Path 1 — register both MCPs directly in Hermes:** see `hermes.mcp.json` in this folder.

**Path 2 — symlink the skills + knowledge into Hermes (still register MCPs from Path 1):**

```bash
ln -s "$(pwd)/skills" ~/.hermes/skills/sera-fx
ln -s "$(pwd)/knowledge" ~/.hermes/knowledge/sera-fx
```

## NanoClaw

NanoClaw ([github.com/nanocoai/nanoclaw](https://github.com/nanocoai/nanoclaw)) uses Docker-isolated agent sessions and reads `.mcp.json` from the workspace root.

```bash
cp hosts/nanoclaw.mcp.json /path/to/your/nanoclaw/workspace/.mcp.json
```

NanoClaw spawns both MCPs inside the agent container. The container needs `npx` + Node (default image has both). The `sera-mcp` dist must be reachable inside the container — mount it or rebuild.

## Claude Code

```bash
# 1. Register the canonical execution MCP (sera-mcp)
claude mcp add sera --scope user \
  --env SERA_NETWORK=mainnet \
  --env POLICY_PRESET=standard \
  -- node $HOME/sera-mcp/dist/index.js

# 2. Register the thinking MCP (this repo)
claude mcp add sera-fx-tools --scope user \
  -- npx tsx /absolute/path/to/sera-fx-agent/mcp/sera-fx-tools/index.ts
```

Verify in any session: call `sera.doctor` then `fx_corridor_pulse` with `{ base: "USD", quote: "SGD" }`.

## Claude Desktop / Cursor

See `claude-desktop.json` for a complete `mcpServers` block (both MCPs).

## OpenAI Agents SDK

```python
from openai_agents.mcp import MCPServerStdio

execution = MCPServerStdio({
  "command": "node",
  "args": ["/absolute/path/to/sera-mcp/dist/index.js"],
  "env": {"SERA_NETWORK": "mainnet", "POLICY_PRESET": "standard"},
})

thinking = MCPServerStdio({
  "command": "npx",
  "args": ["tsx", "/absolute/path/to/sera-fx-agent/mcp/sera-fx-tools/index.ts"],
})
```

## Anything else MCP-capable

Both MCPs are plain stdio JSON-RPC. Cline, Continue, Windsurf, Zed, Goose, your own SDK build — register both and you get all 32 sera.* execution tools + 7 fx_* thinking tools.

## What if I only want the thinking tools?

You can run `sera-fx-tools` alone — every tool is read-only and hits public Sera REST endpoints. The agent's prompts will refuse any execution-flavored requests since `sera.*` won't be available, but pulse / vol / arb / basis / carry / prediction-edge analysis all still work.
