const revealItems = document.querySelectorAll('.fade-in');
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
} else {
  revealItems.forEach(item => item.classList.add('visible'));
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
