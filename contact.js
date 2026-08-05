(() => {
  const fallbackCopy = (value) => {
    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    if (!ok) throw new Error('copy failed');
  };

  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copyEmail || '';
      const section = button.closest('.ibs-contact');
      const status = section?.querySelector('.ibs-contact__status');
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          fallbackCopy(value);
        }
        button.textContent = 'コピーしました';
        if (status) status.textContent = `${value} をコピーしました。`;
      } catch (error) {
        if (status) status.textContent = 'コピーできませんでした。メールアドレスを選択してコピーしてください。';
      }
      window.setTimeout(() => {
        button.textContent = 'コピーする';
        if (status) status.textContent = '';
      }, 2600);
    });
  });
})();
