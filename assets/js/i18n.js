(function () {
  var toggle = document.querySelector('#lang-toggle');
  if (!toggle) return;

  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    try { localStorage.setItem('lang', lang); } catch (e) {}
    toggle.querySelectorAll('[data-set-lang]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-set-lang') === lang);
    });
  }

  toggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-lang');
    setLang(current === 'ko' ? 'en' : 'ko');
  });

  setLang(document.documentElement.getAttribute('data-lang') || 'en');
})();
