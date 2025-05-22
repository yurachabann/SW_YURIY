
  const fileIn = document.getElementById('imagen');
  const preview = document.getElementById('preview');
  fileIn.addEventListener('change', e => {
    const f = e.target.files[0];
    if (f) preview.src = URL.createObjectURL(f);
  });

