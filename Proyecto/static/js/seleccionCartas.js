document.addEventListener('DOMContentLoaded', () => {
    const MAX = 10;
    const form = document.getElementById('form-seleccion');
    if (!form) return;
  
    const checkboxes = form.querySelectorAll('input[type="checkbox"][name="cartas[]"]');
    const contador = document.getElementById('contador');
    if (!contador) return;
  
    function updateUI() {
      const seleccionadas = Array.from(checkboxes).filter(cb => cb.checked).length;
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