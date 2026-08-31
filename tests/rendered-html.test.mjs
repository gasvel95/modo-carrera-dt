import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(new URL(path, "http://localhost"), { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the finished game shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Modo Carrera DT/i);
  assert.match(html, /DOS CARRERAS/);
  assert.match(html, /JUGADOR.*DEL ASCENSO/s);
  assert.match(html, /cafecito\.app\/oddloop/);
  assert.match(html, /Desarrollado por Oddloop/);
  assert.match(html, /Juego de director t.cnico argentino/i);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /simulaci.n de f.tbol/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Building your site/i);
});

test("serves crawlable AI discovery endpoints", async () => {
  const about = await render("/acerca");
  assert.equal(about.status, 200);
  const aboutHtml = await about.text();
  assert.match(aboutHtml, /CARRERA DE DIRECTOR T.CNICO/i);
  assert.match(aboutHtml, /CARRERA DE JUGADOR/i);
  assert.match(aboutHtml, /FAQPage/);

  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  const robotsText = await robots.text();
  assert.match(robotsText, /User-agent: GPTBot\s+Allow: \//);
  assert.match(robotsText, /User-agent: ClaudeBot\s+Allow: \//);
  assert.match(robotsText, /ai-train=yes/);
  assert.match(robotsText, /Sitemap: https:\/\/modocarrera\.com\.ar\/sitemap\.xml/);

  const llms = await render("/llms.txt");
  assert.equal(llms.status, 200);
  const llmsText = await llms.text();
  assert.match(llmsText, /# Modo Carrera DT/);
  assert.match(llmsText, /entrenamiento de modelos de IA/i);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const sitemapXml = await sitemap.text();
  assert.match(sitemapXml, /https:\/\/modocarrera\.com\.ar\/acerca/);
});
