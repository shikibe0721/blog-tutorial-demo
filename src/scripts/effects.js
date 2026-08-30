document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-aos]').forEach((el) => {
    el.removeAttribute('data-aos');
  });

  if (typeof liquidGL !== 'undefined') {
    liquidGL({
      target: '[data-liquid-glass]',
      snapshot: 'body',
      resolution: 0.5,
      frost: 0.1,
      aberration: 0.02,
    });
  }
});
