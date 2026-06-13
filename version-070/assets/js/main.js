(function () {
    var mobileButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (mobileButton && mobileNav) {
        mobileButton.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        var showSlide = function (next) {
            if (!slides.length) {
                return;
            }

            current = (next + slides.length) % slides.length;

            slides.forEach(function (slide, index) {
                slide.classList.toggle("active", index === current);
            });

            dots.forEach(function (dot, index) {
                dot.classList.toggle("active", index === current);
            });
        };

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var next = Number(dot.getAttribute("data-hero-dot"));
                showSlide(next);
            });
        });

        window.setInterval(function () {
            showSlide(current + 1);
        }, 6200);
    }

    var normalize = function (value) {
        return (value || "").toString().trim().toLowerCase();
    };

    var applyFilters = function (panel) {
        var grid = panel.parentElement.querySelector("[data-card-grid]") || document.querySelector("[data-card-grid]");

        if (!grid) {
            return;
        }

        var queryInput = panel.querySelector("[data-live-search]");
        var typeSelect = panel.querySelector("[data-type-filter]");
        var yearSelect = panel.querySelector("[data-year-filter]");
        var query = normalize(queryInput ? queryInput.value : "");
        var type = normalize(typeSelect ? typeSelect.value : "");
        var year = normalize(yearSelect ? yearSelect.value : "");
        var cards = Array.prototype.slice.call(grid.children);

        cards.forEach(function (card) {
            var text = normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-tags"),
                card.textContent
            ].join(" "));
            var cardType = normalize(card.getAttribute("data-type"));
            var cardYear = normalize(card.getAttribute("data-year"));
            var matchesQuery = !query || text.indexOf(query) !== -1;
            var matchesType = !type || cardType.indexOf(type) !== -1;
            var matchesYear = true;

            if (year === "2017") {
                var numericYear = parseInt(cardYear, 10);
                matchesYear = !numericYear || numericYear <= 2017;
            } else if (year) {
                matchesYear = cardYear.indexOf(year) !== -1;
            }

            card.classList.toggle("hidden", !(matchesQuery && matchesType && matchesYear));
        });
    };

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]")).forEach(function (panel) {
        Array.prototype.slice.call(panel.querySelectorAll("input, select")).forEach(function (control) {
            control.addEventListener("input", function () {
                applyFilters(panel);
            });
            control.addEventListener("change", function () {
                applyFilters(panel);
            });
        });
    });

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");

    if (initialQuery) {
        Array.prototype.slice.call(document.querySelectorAll("[data-live-search]")).forEach(function (input) {
            input.value = initialQuery;
            var panel = input.closest("[data-filter-panel]");
            if (panel) {
                applyFilters(panel);
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(function (player) {
        var video = player.querySelector("video");
        var button = player.querySelector("[data-play]");
        var stream = player.getAttribute("data-stream");
        var hlsInstance = null;

        var start = function () {
            if (!video || !stream) {
                return;
            }

            if (video.getAttribute("data-ready") !== "1") {
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = stream;
                }

                video.setAttribute("data-ready", "1");
            }

            player.classList.add("is-playing");
            var request = video.play();

            if (request && typeof request.catch === "function") {
                request.catch(function () {});
            }
        };

        if (button) {
            button.addEventListener("click", start);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                player.classList.add("is-playing");
            });
            video.addEventListener("ended", function () {
                player.classList.remove("is-playing");
            });
        }

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
