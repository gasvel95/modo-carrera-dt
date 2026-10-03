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
  assert.match(html, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-1935863210203708/);
  assert.match(html, /crossorigin="anonymous"/i);
  assert.equal(html.match(/<script[^>]+adsbygoogle\.js/g)?.length, 1);
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

test("serves original guides, club histories and institutional pages", async () => {
  const guides = await render("/guias");
  assert.equal(guides.status, 200);
  assert.match(await guides.text(), /Del primer contrato a la gloria/);

  const clubs = await render("/clubes");
  assert.equal(clubs.status, 200);
  const clubsHtml = await clubs.text();
  assert.match(clubsHtml, /INSTITUCIONES CON HISTORIA/);
  assert.match(clubsHtml, /River Plate/);
  assert.match(clubsHtml, /Primera D/);

  for (const path of ["/privacidad", "/terminos", "/contacto"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /MODO CARRERA/);
  }
});

test("serves the articles section", async () => {
  const index = await render("/articulos");
  assert.equal(index.status, 200);
  assert.match(await index.text(), /pir.mide del f.tbol argentino/i);
  const article = await render("/articulos/copa-argentina-camino-al-titulo");
  assert.equal(article.status, 200);
  assert.match(await article.text(), /Copa Argentina/);
  const sitemap = await (await render("/sitemap.xml")).text();
  assert.match(sitemap, /\/articulos\/formaciones-y-tacticas-basicas/);
});

test("serves club pages and contact email", async () => {
  const club = await render("/clubes/boca");
  assert.equal(club.status, 200);
  assert.match(await club.text(), /Boca Juniors/);
  assert.match(await (await render("/contacto")).text(), /oddloop2542@gmail\.com/);
});

test("renders verified club facts", async () => {
  const html = await (await render("/clubes/almirante")).text();
  assert.match(html, /1 de julio de 1912/);
  assert.match(html, /Fragata Presidente Sarmiento/);
});

test("renders verified Primera B club facts", async () => {
  const html = await (await render("/clubes/villa_sc")).text();
  assert.match(html, /25 de abril de 1925/);
  assert.match(html, /Genacio S.lice/);
});

test("renders verified lower-division club facts", async () => {
  const html = await (await render("/clubes/mercedes_d")).text();
  assert.match(html, /12 de mayo de 1875/);
  assert.match(html, /Decano de Am.rica/);
});
