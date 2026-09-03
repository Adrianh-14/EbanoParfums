import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'mobile.css'), 'utf8');
const section = (id) => html.match(new RegExp(`<section id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];

test('opening screen contains the tree and logo, not sales messages or CTAs', () => {
  const cover = section('hero');
  assert.ok(cover);
  assert.ok(cover.includes('tree-desktop.webp'));
  assert.ok(cover.includes('tree-mobile.webp'));
  assert.ok(cover.includes('id="heroLogo"'));
  assert.ok(cover.includes('logo-horizontal.webp'));
  assert.ok(!/<h[1-6]\b|<p\b|hero-actions|hero-desc|hero-sub/.test(cover));
  assert.ok(!cover.includes('https://wa.link/'));
  assert.ok(!cover.includes('catalogo.treinta.co'));
  assert.match(cover, /class="hero-discover" href="#presentacion"/);
});

test('SEO heading and original commercial messages remain visible below the cover', () => {
  const intro = section('presentacion');
  assert.ok(intro);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(intro, /<h1[^>]+id="store-title"/);
  for (const copy of ['Perfumes originales', 'en Higüey y República Dominicana',
    'Perfumería árabe y de diseñador al detalle y por mayor en La Altagracia.',
    'En Ébano Parfums trabajamos con fragancias originales de Lattafa, Dior, Carolina Herrera',
    'Ver catálogo al detalle', 'Consultar por WhatsApp']) assert.ok(intro.includes(copy));
  assert.ok(html.indexOf('id="hero"') < html.indexOf('id="presentacion"'));
  assert.ok(!/display:\s*none|visibility:\s*hidden/.test(intro));
  assert.match(css, /#hero \{ height: 100vh; height: 100svh;/);
});

test('gift guidance is original occasion copy, not fabricated customer reviews', () => {
  const gifts = section('regalos');
  assert.equal((gifts.match(/<article\b/g) || []).length, 3);
  for (const heading of ['Para tu pareja', 'Para un cumpleaños', 'Para un aniversario']) assert.ok(gifts.includes(heading));
  assert.ok(gifts.includes('presupuesto'));
  assert.ok(gifts.includes('Confirma la disponibilidad y la entrega'));
  assert.ok(gifts.includes('href="envios.html"'));
  assert.ok(!gifts.includes('Review'));
  assert.ok(!gifts.includes('AggregateRating'));
  assert.ok(html.indexOf('id="regalos"') > html.indexOf('id="coleccion"'));
});

test('all local homepage links and assets resolve, including cache-versioned files', () => {
  for (const [, ref] of html.matchAll(/(?:src|href|srcset)="([^"#]+|#[^"]+)"/g)) {
    if (/^(?:https?:|tel:|data:)/.test(ref) || ref === '#') continue;
    const [resource, fragment] = ref.split('#');
    const path = resolve(root, resource.split('?')[0] || 'index.html');
    assert.ok(existsSync(path), `Missing ${ref}`);
    if (fragment) assert.ok(readFileSync(path, 'utf8').includes(`id="${fragment}"`), `Missing anchor ${ref}`);
  }
});

test('canonical, social previews, sitemap and structured data use the verified www host', () => {
  assert.ok(html.includes('rel="canonical" href="https://www.ebanoparfums.com/"'));
  assert.ok(!html.includes('https://ebanoparfums.com'));
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const store = graph.find((node) => node['@type'] === 'Store');
  assert.equal(store.telephone, '+1-849-458-1549');
  assert.equal(store.address.addressLocality, 'Higüey');
  assert.equal(store.url, 'https://www.ebanoparfums.com/');
  assert.equal(store.contactPoint.url, 'https://wa.link/jnib6m');
  const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('https://ebanoparfums.com'));
  assert.ok(sitemap.includes('<lastmod>2026-09-03</lastmod>'));
});

test('cover remains usable without animation and floating chat does not flash over it', () => {
  assert.ok(html.includes('class="whatsapp-float is-over-cover"'));
  assert.ok(css.includes('.whatsapp-float.is-over-cover { visibility: hidden;'));
  assert.ok(css.includes('prefers-reduced-motion: reduce'));
  assert.ok(!/<canvas\b/.test(html));
  const script = readFileSync(resolve(root, 'site.js'), 'utf8');
  assert.ok(script.includes("coverObserver.observe(brandCover)"));
  assert.ok(!script.includes('requestAnimationFrame'));
});
