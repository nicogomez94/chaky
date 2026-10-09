const revealItems = document.querySelectorAll('.fade-in');
const revealStyles = [
  ['.statement-heading, .feature-copy, .section-heading, .inner-hero-copy, .custom-hero-copy, .custom-form-intro, .home-contact-copy', 'reveal-left'],
  ['.statement-body, .custom-form, .faq-list, .product-copy, .home-contact-form', 'reveal-right'],
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
  window.addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (event.target instanceof Element && event.target.closest('textarea, select, input')) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    event.preventDefault();
    const distance = event.deltaY * unit * 0.86;
    try { window.scrollBy({ top: distance, behavior: 'instant' }); }
    catch { window.scrollBy(0, distance); }
  }, { passive: false });
}

if (matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  const pointer = document.createElement('div');
  pointer.className = 'cursor-dot';
  pointer.setAttribute('aria-hidden', 'true');
  document.body.append(pointer);
  document.body.classList.add('has-custom-cursor');

  let x = 0, y = 0, targetX = 0, targetY = 0, moving = false, started = false;
  const follow = () => {
    x += (targetX - x) * 0.24;
    y += (targetY - y) * 0.24;
    pointer.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.2) requestAnimationFrame(follow);
    else moving = false;
  };
  window.addEventListener('pointermove', event => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!started) {
      x = targetX;
      y = targetY;
      started = true;
    }
    document.body.classList.add('cursor-visible');
    if (!moving) { moving = true; requestAnimationFrame(follow); }
  }, { passive: true });
  document.addEventListener('pointerover', event => {
    const target = event.target instanceof Element ? event.target : null;
    document.body.classList.toggle('cursor-text', Boolean(target?.closest('input:not([type="checkbox"]), textarea, select')));
  });
  document.addEventListener('pointerleave', () => {
    document.body.classList.remove('cursor-visible');
    started = false;
  });
}

const homeContactForm = document.querySelector('#home-contact-form');
homeContactForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!homeContactForm.reportValidity()) return;
  const data = new FormData(homeContactForm);
  const message = [
    'Hola Rua Chaky, quisiera hacer una consulta.',
    `Mi nombre: ${data.get('nombre')}`,
    `Mi contacto: ${data.get('contacto')}`,
    `Me interesa: ${data.get('interes')}`,
    `Mi mensaje: ${data.get('mensaje')}`
  ].join('\n');
  window.open(`https://wa.me/5493835521144?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

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
