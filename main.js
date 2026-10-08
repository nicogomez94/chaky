const revealItems = document.querySelectorAll('.fade-in');
const revealStyles = [
  ['.statement-heading, .feature-copy, .section-heading, .inner-hero-copy, .custom-hero-copy, .custom-form-intro', 'reveal-left'],
  ['.statement-body, .custom-form, .faq-list, .product-copy', 'reveal-right'],
  ['.feature-art, .inner-hero-art, .custom-hero-art, .product-visual', 'reveal-zoom'],
  ['.craft-card, .collection-card, .process-item, .quick-link', 'reveal-tilt'],
  ['.consult-strip, .featured-product', 'reveal-clip']
];
revealStyles.forEach(([selector, style]) => {
  document.querySelectorAll(selector).forEach(item => item.classList.add(style));
});
document.querySelectorAll('.craft-card, .collection-card, .process-item, .quick-link').forEach((item, index) => {
  item.style.setProperty('--reveal-delay', `${(index % 3) * 110}ms`);
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  revealItems.forEach(item => observer.observe(item));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-active');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.feature-banner').forEach(section => sectionObserver.observe(section));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
  document.querySelectorAll('.feature-banner').forEach(section => section.classList.add('section-active'));
}

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
menuButton?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const hero = document.querySelector('.home-hero');
const parallaxObject = document.querySelector('[data-parallax]');
if (hero && parallaxObject && matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    parallaxObject.style.transform = `translateX(calc(-50% + ${x * 13}px)) translateY(${y * 10}px)`;
  });
  hero.addEventListener('pointerleave', () => { parallaxObject.style.transform = 'translateX(-50%)'; });
}

if (matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);
  document.body.classList.add('has-custom-cursor');

  let x = -100, y = -100, targetX = -100, targetY = -100, moving = false;
  const animateRing = () => {
    x += (targetX - x) * 0.22;
    y += (targetY - y) * 0.22;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.25) requestAnimationFrame(animateRing);
    else moving = false;
  };
  window.addEventListener('pointermove', event => {
    targetX = event.clientX;
    targetY = event.clientY;
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    document.body.classList.add('cursor-visible');
    if (!moving) { moving = true; requestAnimationFrame(animateRing); }
  }, { passive: true });
  document.addEventListener('pointerover', event => {
    const target = event.target instanceof Element ? event.target : null;
    document.body.classList.toggle('cursor-hover', Boolean(target?.closest('a, button, summary, .swatch')));
    document.body.classList.toggle('cursor-text', Boolean(target?.closest('input:not([type="checkbox"]), textarea, select')));
  });
  document.addEventListener('pointerdown', () => document.body.classList.add('cursor-pressed'));
  document.addEventListener('pointerup', () => document.body.classList.remove('cursor-pressed'));
  document.addEventListener('pointerleave', () => document.body.classList.remove('cursor-visible'));
}

const form = document.querySelector('#custom-form');
if (form) {
  const piece = new URLSearchParams(location.search).get('pieza');
  const pieceSelect = form.querySelector('#pieza');
  if (piece && [...pieceSelect.options].some(option => option.value === piece)) pieceSelect.value = piece;

  const colors = [...form.querySelectorAll('input[name="color"]')];
  const hint = form.querySelector('#color-hint');
  colors.forEach(color => color.addEventListener('change', () => {
    const selected = colors.filter(item => item.checked);
    if (selected.length > 3) {
      color.checked = false;
      hint.textContent = 'Podés elegir hasta 3 colores.';
      hint.classList.add('error');
    } else {
      hint.textContent = selected.length ? `${selected.length} ${selected.length === 1 ? 'color elegido' : 'colores elegidos'}.` : 'Podés elegir uno, dos o tres colores.';
      hint.classList.remove('error');
    }
  }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const selectedColors = data.getAll('color');
    const message = [
      'Hola Rua Chaky, quisiera consultar por un poncho.',
      `Mi nombre: ${data.get('nombre')}`,
      `Es para: ${data.get('destinatario')}`,
      `Me interesa: ${data.get('pieza')}`,
      `Colores de referencia: ${selectedColors.length ? selectedColors.join(', ') : 'A conversar'}`,
      `Mi idea: ${data.get('detalle') || 'Quisiera recibir asesoramiento.'}`
    ].join('\n');
    window.open(`https://wa.me/5493835521144?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
}
