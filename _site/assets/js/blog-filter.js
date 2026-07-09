(function () {
  var buttons = document.querySelectorAll('.blog-filter');
  var items = document.querySelectorAll('.post-summary');
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      items.forEach(function (item) {
        var show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });
})();
