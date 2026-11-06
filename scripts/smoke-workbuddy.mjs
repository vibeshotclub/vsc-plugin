// Run with Node.js 22+: node scripts/smoke-workbuddy.mjs
// Starts a local fixture and installs the pinned bridge with npx; no VSC account is used.
import http from "node:http";
import fs from "node:fs";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const server = http.createServer(async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405);
    return res.end();
  }
  let body = "";
  for await (const chunk of req) body += chunk;
  const msg = JSON.parse(body);
  if (msg.id === undefined) {
    res.writeHead(202);
    return res.end();
  }
  let result;
  if (msg.method === "initialize")
    result = {
      protocolVersion: msg.params.protocolVersion,
      capabilities: { tools: {} },
      serverInfo: { name: "vsc-smoke-fixture", version: "1.0.0" },
    };
  else if (msg.method === "tools/list")
    result = {
      tools: [
        {
          name: "vsc_whoami",
          description: "Fixture identity",
          inputSchema: { type: "object", properties: {} },
        },
      ],
    };
  else if (msg.method === "tools/call")
    result = { content: [{ type: "text", text: "fixture-ok" }] };
  else result = {};
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result }));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const config = JSON.parse(
  fs.readFileSync(new URL("../adapters/workbuddy/mcp.json", import.meta.url)),
).mcpServers.vsc;
const args = config.args.map((v) =>
  v === "https://vibeshot.club/api/mcp" ? `http://127.0.0.1:${server.address().port}/mcp` : v,
);
const child = spawn(config.command, args, { stdio: ["pipe", "pipe", "pipe"] });
let buffer = "",
  stderr = "";
const responses = new Map();
child.stderr.on("data", (d) => (stderr += d));
child.stdout.on("data", (d) => {
  buffer += d;
  let i;
  while ((i = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, i);
    buffer = buffer.slice(i + 1);
    try {
      const m = JSON.parse(line);
      if (responses.has(m.id)) {
        responses.get(m.id)(m);
        responses.delete(m.id);
      }
    } catch {}
  }
});
const rpc = (id, method, params) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(Error("Bridge RPC timed out: " + method + " " + stderr.slice(-500))),
      60000,
    );
    responses.set(id, (m) => {
      clearTimeout(timer);
      resolve(m);
    });
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });
try {
  const init = await rpc(1, "initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "vsc-smoke", version: "1.0.0" },
  });
  assert(init.result);
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
  const list = await rpc(2, "tools/list", {});
  assert.equal(list.result.tools[0].name, "vsc_whoami");
  const call = await rpc(3, "tools/call", { name: "vsc_whoami", arguments: {} });
  assert.equal(call.result.content[0].text, "fixture-ok");
  console.log(
    "PASS: exact pinned WorkBuddy bridge launches, initializes, lists tools and proxies a tool call against a local HTTP-only MCP fixture. OAuth was not simulated.",
  );
} finally {
  child.stdin.end();
  child.kill("SIGTERM");
  server.closeAllConnections();
  server.close();
}
