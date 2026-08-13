import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the finished game shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Modo Carrera DT/i);
  assert.match(html, /NO JUGÁS/);
  assert.match(html, /cafecito\.app\/oddloop/);
  assert.match(html, /Desarrollado por Oddloop/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Building your site/i);
});
