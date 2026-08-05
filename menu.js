/* ハンバーガーメニュー — モバイル・タブレット用 */
(function () {
  var btn = document.querySelector('.hamburger');
  var menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  var DESKTOP = window.matchMedia('(min-width: 981px)');

  function setOpen(open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  }

  btn.addEventListener('click', function () {
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });

  // メニュー内のリンクを押したら閉じる（同一ページ内の #contact 対応）
  Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });

  // Escapeキーで閉じ、フォーカスをボタンに戻す
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      btn.focus();
    }
  });

  // デスクトップ幅に戻したら開いたままにしない
  function onBreakpoint() { if (DESKTOP.matches) setOpen(false); }
  if (DESKTOP.addEventListener) DESKTOP.addEventListener('change', onBreakpoint);
  else if (DESKTOP.addListener) DESKTOP.addListener(onBreakpoint);

  setOpen(false);
})();
