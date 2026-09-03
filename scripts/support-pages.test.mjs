import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = [
  'atencion-al-cliente.html', 'envios.html', 'devoluciones.html',
  'terminos-y-condiciones.html', 'politica-de-privacidad.html', 'cookies.html',
];
const drafts = pages.slice(2);
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const home = read('index.html');
const sitemap = read('sitemap.xml');

for (const page of pages) {
  test(`${page}: semantic, accessible, linked static document`, () => {
    const html = read(page);
    assert.match(html, /<html lang="es">/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.match(html, /<title>[^<]+Ébano Parfums<\/title>/);
    assert.match(html, /name="viewport"/);
    assert.match(html, /class="skip-link" href="#contenido"/);
    assert.ok(html.includes(`rel="canonical" href="https://www.ebanoparfums.com/${page}"`));
    assert.ok(html.includes(`href="${page}" aria-current="page"`));
    assert.match(html, /https:\/\/wa\.link\/jnib6m/);
    assert.match(html, /https:\/\/catalogo\.treinta\.co\/ebanoparfums/);
    assert.ok(!html.includes('href="#"'));
    assert.ok(!html.includes('<form'));
    assert.ok(!/<script(?! type="application\/ld\+json")/.test(html));
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(ids.length, new Set(ids).size);
    for (const [, schema] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const data = JSON.parse(schema);
      assert.equal(data['@graph'][0].url, `https://www.ebanoparfums.com/${page}`);
    }
    for (const [, tag] of html.matchAll(/(<a\b[^>]+>)/g)) {
      if (tag.includes('target="_blank"')) assert.ok(tag.includes('rel="noopener"'));
    }
  });

  test(`${page}: every local resource and fragment exists`, () => {
    const html = read(page);
    for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (/^(?:https?:|tel:|data:)/.test(ref)) continue;
      const [file, fragment] = ref.split('#');
      const target = file ? resolve(root, dirname(page), file.split('?')[0]) : resolve(root, page);
      assert.ok(existsSync(target), `Missing ${ref}`);
      if (fragment) assert.ok(readFileSync(target, 'utf8').includes(`id="${fragment}"`), `Missing anchor ${ref}`);
    }
    for (const link of pages) assert.ok(html.includes(`href="${link}"`));
  });
}

test('homepage connects all six footer destinations', () => {
  const footer = home.match(/<footer\b[\s\S]*?<\/footer>/)[0];
  for (const page of pages) assert.ok(footer.includes(`href="${page}"`));
});

test('unapproved policies are visibly marked, noindex and excluded from sitemap', () => {
  for (const page of pages) {
    const html = read(page);
    if (drafts.includes(page)) {
      assert.ok(html.includes('content="noindex, follow"'));
      assert.ok(html.includes('Borrador · pendiente de aprobación'));
      assert.ok(!sitemap.includes(`https://www.ebanoparfums.com/${page}`));
    } else {
      assert.ok(html.includes('content="index, follow"'));
      assert.ok(sitemap.includes(`https://www.ebanoparfums.com/${page}`));
    }
  }
});

test('lightweight local fonts and native disclosure controls', () => {
  const css = read('pages.css');
  assert.ok(css.includes('prefers-reduced-motion:reduce'));
  assert.ok(css.includes(':focus-visible'));
  assert.ok(css.includes('min-height:44px'));
  for (const [, resource] of css.matchAll(/url\('([^']+)'\)/g)) assert.ok(existsSync(resolve(root, resource)));
  for (const page of pages) assert.match(read(page), /<details class="mobile-menu"><summary>/);
  assert.match(read('atencion-al-cliente.html'), /<details><summary>/);
  assert.match(read('envios.html'), /<details><summary>/);
});
