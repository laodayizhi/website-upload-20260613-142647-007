(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        startTimer();
      });
    });

    if (slides.length > 1) {
      startTimer();
    }
  }

  function setupFilters(root) {
    var list = root.querySelector('.js-card-list');
    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    var search = root.querySelector('.js-card-search');
    var year = root.querySelector('.js-filter-year');
    var type = root.querySelector('.js-filter-type');
    var region = root.querySelector('.js-filter-region');
    var empty = document.createElement('div');
    empty.className = 'empty-tip';
    empty.textContent = '没有找到匹配的影片';

    function value(node) {
      return node ? node.value.trim().toLowerCase() : '';
    }

    function apply() {
      var q = value(search);
      var y = value(year);
      var t = value(type);
      var r = value(region);
      var shown = 0;

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var match = true;

        if (q && haystack.indexOf(q) === -1) {
          match = false;
        }

        if (y && String(card.getAttribute('data-year') || '').toLowerCase() !== y) {
          match = false;
        }

        if (t && String(card.getAttribute('data-type') || '').toLowerCase() !== t) {
          match = false;
        }

        if (r && String(card.getAttribute('data-region') || '').toLowerCase() !== r) {
          match = false;
        }

        card.classList.toggle('is-hidden-card', !match);
        if (match) {
          shown += 1;
        }
      });

      if (!shown) {
        if (!empty.parentNode) {
          list.appendChild(empty);
        }
      } else if (empty.parentNode) {
        empty.parentNode.removeChild(empty);
      }
    }

    [search, year, type, region].forEach(function (node) {
      if (node) {
        node.addEventListener('input', apply);
        node.addEventListener('change', apply);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && search) {
      search.value = query;
      apply();
    }
  }

  setupFilters(document);
})();
