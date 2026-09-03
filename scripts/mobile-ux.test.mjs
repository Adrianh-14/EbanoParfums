import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = readFileSync(resolve(root, 'site.js'), 'utf8');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'mobile.css'), 'utf8');

class Element extends EventTarget {
  constructor() {
    super();
    this.attrs = {};
    const classes = new Set();
    this.classList = {
      add: (name) => classes.add(name),
      contains: (name) => classes.has(name),
      toggle: (name, on) => on ? classes.add(name) : classes.delete(name),
    };
  }
  setAttribute(name, value) { this.attrs[name] = value; }
  getAttribute(name) { return this.attrs[name] || null; }
  contains(element) { return [this, this.toggle, this.links, this.anchor].includes(element); }
  focus() { this.focused = true; }
}

function harness({ observeContact = false } = {}) {
  const navigation = new Element();
  const toggle = new Element();
  toggle.setAttribute('aria-expanded', 'false');
  const links = new Element();
  const floatingContact = new Element();
  const cover = new Element();
  const marker = new Element();
  const contactLinks = [new Element(), new Element()];
  const anchor = new Element();
  anchor.closest = (selector) => selector === 'a' ? anchor : null;
  Object.assign(navigation, { toggle, links, anchor });
  const document = new Element();
  document.documentElement = new Element();
  document.querySelector = (selector) => ({ '#nav': navigation, '.menu-toggle': toggle, '#navLinks': links, '.whatsapp-float': floatingContact, '#hero': cover, '#navMarker': marker })[selector];
  document.querySelectorAll = () => contactLinks;
  const mobile = new Element();
  mobile.matches = true;
  const window = new Element();
  window.scrollY = 0;
  window.matchMedia = (query) => query === '(max-width: 968px)' ? mobile : { matches: false };
  let contactObserver;
  const observers = [];
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.observed = []; contactObserver = this; observers.push(this); }
    observe(element) { this.observed.push(element); }
  }
  if (observeContact) window.IntersectionObserver = IntersectionObserver;
  runInNewContext(source, { document, window, IntersectionObserver });
  function fire(target, type, properties = {}) {
    const event = new Event(type);
    for (const [key, value] of Object.entries(properties)) Object.defineProperty(event, key, { value });
    target.dispatchEvent(event);
  }
  return { navigation, toggle, links, anchor, document, window, mobile, fire, floatingContact, contactLinks, contactObserver, cover, observers, marker };
}

test('menu opens and closes with an accurate accessible state', () => {
  const h = harness();
  h.fire(h.toggle, 'click');
  assert.equal(h.toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(h.links.classList.contains('is-open'), true);
  h.fire(h.toggle, 'click');
  assert.equal(h.toggle.getAttribute('aria-expanded'), 'false');
});

test('Escape closes the menu and restores focus', () => {
  const h = harness();
  h.fire(h.toggle, 'click');
  h.fire(h.document, 'keydown', { key: 'Escape' });
  assert.equal(h.toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(h.toggle.focused, true);
});

test('links, outside clicks, focus leaving and breakpoint changes close the menu', () => {
  const h = harness();
  for (const close of [
    () => h.fire(h.links, 'click', { target: h.anchor }),
    () => h.fire(h.document, 'click'),
    () => h.fire(h.navigation, 'focusout', { relatedTarget: null }),
    () => h.fire(h.mobile, 'change'),
  ]) {
    h.fire(h.toggle, 'click');
    close();
    assert.equal(h.toggle.getAttribute('aria-expanded'), 'false');
  }
});

test('a tap inside navigation does not inadvertently close the menu', () => {
  const h = harness();
  h.fire(h.toggle, 'click');
  h.fire(h.document, 'click', { target: h.toggle });
  assert.equal(h.toggle.getAttribute('aria-expanded'), 'true');
});

test('floating WhatsApp hides beside a visible contact action and returns afterward', () => {
  const h = harness({ observeContact: true });
  assert.equal(h.contactObserver.observed.length, 2);
  const update = (target, isIntersecting) => h.contactObserver.callback([{ target, isIntersecting }]);
  update(h.contactLinks[0], true);
  assert.equal(h.floatingContact.classList.contains('is-redundant'), true);
  update(h.contactLinks[1], true);
  update(h.contactLinks[0], false);
  assert.equal(h.floatingContact.classList.contains('is-redundant'), true);
  update(h.contactLinks[1], false);
  assert.equal(h.floatingContact.classList.contains('is-redundant'), false);
});

test('the brand cover independently suppresses floating chat until it leaves view', () => {
  const h = harness({ observeContact: true });
  const observer = h.observers.find((item) => item.observed.includes(h.cover));
  assert.ok(observer);
  observer.callback([{ target: h.cover, isIntersecting: true }]);
  assert.equal(h.floatingContact.classList.contains('is-over-cover'), true);
  observer.callback([{ target: h.cover, isIntersecting: false }]);
  assert.equal(h.floatingContact.classList.contains('is-over-cover'), false);
});

test('header appearance follows its marker without reading geometry during startup', () => {
  const h = harness({ observeContact: true });
  const observer = h.observers.find((item) => item.observed.includes(h.marker));
  assert.ok(observer);
  observer.callback([{ target: h.marker, isIntersecting: false }]);
  assert.equal(h.navigation.classList.contains('scrolled'), true);
  observer.callback([{ target: h.marker, isIntersecting: true }]);
  assert.equal(h.navigation.classList.contains('scrolled'), false);
});

test('preserves one H1, all original sections, sales URLs and no duplicate IDs', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const id of ['hero', 'historia', 'coleccion', 'mayoristas', 'exclusividad', 'contacto', 'zonas']) {
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.ok(html.includes('https://catalogo.treinta.co/ebanoparfums'));
  assert.ok(html.includes('https://wa.link/jnib6m'));
  assert.ok(!html.includes('wa.link/i0n633'));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test('local assets exist, structured data is parseable, effects do not block mobile content', () => {
  for (const [, asset] of html.matchAll(/(?:src|href|srcset)="([^"#]+)"/g)) {
    if (/^(?:https?:|tel:|data:)/.test(asset)) continue;
    assert.ok(existsSync(resolve(root, asset.split('?')[0])), `Missing asset: ${asset}`);
  }
  JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.ok(css.includes('prefers-reduced-motion: reduce'));
  assert.ok(css.includes('html:not(.js) nav'));
  assert.ok(!source.includes('requestAnimationFrame'));
  assert.ok(!html.includes('anime.min.js'));
});
