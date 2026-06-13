(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-menu]');

    if (menuButton && menu) {
        menuButton.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    inputs.forEach(function (input) {
        var scope = document.querySelector('[data-search-scope]');
        if (!scope) {
            return;
        }
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
        input.addEventListener('input', function () {
            var value = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '') + ' ' + card.textContent).toLowerCase();
                card.classList.toggle('is-hidden', value && text.indexOf(value) === -1);
            });
        });
    });

    var video = document.querySelector('[data-player]');
    var playButton = document.querySelector('[data-play-button]');
    var shell = document.querySelector('[data-player-shell]');

    if (video) {
        var stream = video.getAttribute('data-stream');
        var attached = false;

        function attachStream() {
            if (attached || !stream) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function startPlay() {
            attachStream();
            var result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {});
            }
        }

        attachStream();

        if (playButton) {
            playButton.addEventListener('click', startPlay);
        }

        if (shell) {
            shell.addEventListener('click', function (event) {
                if (event.target === video) {
                    return;
                }
                startPlay();
            });
        }

        video.addEventListener('play', function () {
            if (shell) {
                shell.classList.add('is-playing');
            }
        });

        video.addEventListener('pause', function () {
            if (shell) {
                shell.classList.remove('is-playing');
            }
        });
    }
})();
