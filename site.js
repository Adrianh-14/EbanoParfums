// Progressive enhancement: all sales content and links work without JavaScript.
document.documentElement.classList.add('js');

const navigation = document.querySelector('#nav');
const menuToggle = document.querySelector('.menu-toggle');
const menuLinks = document.querySelector('#navLinks');
const mobileLayout = window.matchMedia('(max-width: 968px)');

function setMenuOpen(open, restoreFocus = false) {
  menuLinks.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});
menuLinks.addEventListener('click', (event) => {
  if (event.target.closest('a') && mobileLayout.matches) setMenuOpen(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false, true);
  }
});
document.addEventListener('click', (event) => {
  if (!navigation.contains(event.target)) setMenuOpen(false);
});
navigation.addEventListener('focusout', (event) => {
  if (!navigation.contains(event.relatedTarget)) setMenuOpen(false);
});
mobileLayout.addEventListener('change', () => setMenuOpen(false));

// Observe the header threshold after layout instead of forcing a synchronous
// layout by reading scrollY while the first screen is still being styled.
const navigationMarker = document.querySelector('#navMarker');
if ('IntersectionObserver' in window && navigationMarker) {
  const navigationObserver = new IntersectionObserver(([entry]) => {
    navigation.classList.toggle('scrolled', !entry.isIntersecting);
  });
  navigationObserver.observe(navigationMarker);
} else {
  const updateNavigation = () => navigation.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', updateNavigation, { passive: true });
  window.addEventListener('load', updateNavigation, { once: true });
}

// Avoid covering the hero or contact text with a duplicate WhatsApp action.
if ('IntersectionObserver' in window) {
  const floatingContact = document.querySelector('.whatsapp-float');
  const brandCover = document.querySelector('#hero');
  // The opening screen is reserved for the logo and tree. Keep chat elsewhere.
  if (brandCover) {
    const coverObserver = new IntersectionObserver((entries) => {
      floatingContact.classList.toggle('is-over-cover', entries.some((entry) => entry.isIntersecting));
    }, { threshold: .2 });
    coverObserver.observe(brandCover);
  }
  const visibleContactLinks = new Set();
  const contactObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleContactLinks.add(entry.target);
      else visibleContactLinks.delete(entry.target);
    }
    floatingContact.classList.toggle('is-redundant', visibleContactLinks.size > 0);
  }, { threshold: .5 });
  document.querySelectorAll('.hero-secondary, #waCard').forEach((element) => contactObserver.observe(element));
}

// One short, non-blocking arrival per section on desktop. Never hide content.
const motion = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 969px)');
if (motion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('reveal-arrived');
      observer.unobserve(entry.target);
    }
  }, { threshold: .1 });
  document.querySelectorAll('.section-header, .product-card, .local-card').forEach((element) => observer.observe(element));
}
