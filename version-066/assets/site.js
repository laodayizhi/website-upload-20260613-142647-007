(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(text) {
    return String(text || "").toLowerCase().trim();
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        stop();
        show(i);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-page-search]");
      var select = scope.querySelector("[data-sort-select]");
      var list = scope.querySelector("[data-card-list]");
      var empty = scope.querySelector("[data-empty-state]");
      if (!list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));
      cards.forEach(function (card, i) {
        card.setAttribute("data-order", String(i));
      });

      function apply() {
        var term = normalize(input ? input.value : "");
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-score"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.textContent
          ].join(" "));
          var matched = !term || haystack.indexOf(term) !== -1;
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      function sortCards() {
        var mode = select ? select.value : "default";
        var sorted = cards.slice();
        sorted.sort(function (a, b) {
          if (mode === "year") {
            return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
          }
          if (mode === "score") {
            return Number(b.getAttribute("data-score")) - Number(a.getAttribute("data-score"));
          }
          if (mode === "title") {
            return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
          }
          return Number(a.getAttribute("data-order")) - Number(b.getAttribute("data-order"));
        });
        sorted.forEach(function (card) {
          list.appendChild(card);
        });
        apply();
      }

      if (input) {
        if (query) {
          input.value = query;
        }
        input.addEventListener("input", apply);
      }
      if (select) {
        select.addEventListener("change", sortCards);
      }
      sortCards();
    });
  }

  function hideBrokenImages() {
    document.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.style.opacity = "0";
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    hideBrokenImages();
  });
})();
