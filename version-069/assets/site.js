(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function start() {
            stop();
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

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var value = Number(dot.getAttribute("data-hero-dot"));
                show(value);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function initSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-movie-search]"));
        if (!inputs.length) {
            return;
        }

        function apply(value) {
            var keyword = String(value || "").trim().toLowerCase();
            var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
            var visible = 0;
            cards.forEach(function (card) {
                var content = String(card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                var matched = !keyword || content.indexOf(keyword) !== -1;
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            Array.prototype.slice.call(document.querySelectorAll("[data-empty-state]")).forEach(function (state) {
                state.classList.toggle("show", visible === 0);
            });
        }

        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                apply(input.value);
            });
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]")).forEach(function (button) {
            button.addEventListener("click", function () {
                var value = button.getAttribute("data-filter-chip") || "";
                inputs.forEach(function (input) {
                    input.value = value;
                });
                apply(value);
            });
        });
    }

    function attachHls(video, streamUrl) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return null;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            return hls;
        }
        video.src = streamUrl;
        return null;
    }

    window.setupMoviePlayer = function (streamUrl) {
        onReady(function () {
            var shell = document.querySelector("[data-player]");
            var trigger = document.querySelector("[data-player-trigger]");
            var video = document.getElementById("movieVideo");
            var hasBound = false;
            var hlsInstance = null;

            if (!shell || !trigger || !video || !streamUrl) {
                return;
            }

            function bind() {
                if (hasBound) {
                    return;
                }
                hlsInstance = attachHls(video, streamUrl);
                hasBound = true;
            }

            function play() {
                bind();
                shell.classList.add("is-playing");
                video.controls = true;
                var result = video.play();
                if (result && typeof result.catch === "function") {
                    result.catch(function () {
                        shell.classList.remove("is-playing");
                    });
                }
            }

            trigger.addEventListener("click", play);
            video.addEventListener("click", function () {
                if (!hasBound || video.paused) {
                    play();
                }
            });
            window.addEventListener("pagehide", function () {
                if (hlsInstance && typeof hlsInstance.destroy === "function") {
                    hlsInstance.destroy();
                }
            });
        });
    };

    onReady(function () {
        initMenu();
        initHero();
        initSearch();
    });
}());
