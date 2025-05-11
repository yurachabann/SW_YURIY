document.addEventListener('DOMContentLoaded', () => {
  const MAX = 1;

  document.querySelectorAll('.seleccion-grupo').forEach(grupo => {
    const checkboxes = grupo.querySelectorAll('input[type="checkbox"]');
    const contador   = grupo.querySelector('.contador');

    function updateUI() {
      const seleccionadas = [...checkboxes].filter(cb => cb.checked).length;
      contador.textContent = `Seleccionadas: ${seleccionadas}/${MAX}`;

      checkboxes.forEach(cb => {
        if (!cb.checked) {
          cb.disabled = (seleccionadas >= MAX);
        }
        cb.parentNode.classList.toggle('checked', cb.checked);
      });
    }

    checkboxes.forEach(cb => cb.addEventListener('change', updateUI));

    updateUI();
  });
});
