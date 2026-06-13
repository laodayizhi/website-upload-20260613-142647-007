(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    var searchInput = document.querySelector('[data-search-input]');

    if (query && searchInput) {
        searchInput.value = query;
    }

    var activeCategory = 'all';
    var filterButtons = document.querySelectorAll('[data-filter-btn]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var emptyMessage = document.querySelector('[data-empty-message]');

    function updateCards() {
        var term = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var shown = 0;

        cards.forEach(function (card) {
            var text = card.getAttribute('data-filter') || '';
            var cat = card.getAttribute('data-cat') || 'all';
            var matchText = !term || text.indexOf(term) !== -1;
            var matchCat = activeCategory === 'all' || activeCategory === cat;
            var show = matchText && matchCat;

            card.style.display = show ? '' : 'none';
            if (show) {
                shown += 1;
            }
        });

        if (emptyMessage) {
            emptyMessage.style.display = shown ? 'none' : 'block';
        }
    }

    if (searchInput && cards.length) {
        searchInput.addEventListener('input', updateCards);
        updateCards();
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (item) {
                item.classList.remove('active');
            });
            button.classList.add('active');
            activeCategory = button.getAttribute('data-filter-btn') || 'all';
            updateCards();
        });
    });

    document.querySelectorAll('.player-box').forEach(function (box) {
        var video = box.querySelector('video');
        var overlay = box.querySelector('.player-overlay');
        var media = video ? video.getAttribute('data-media') : '';
        var loaded = false;
        var hls = null;

        function loadMedia() {
            if (!video || !media || loaded) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = media;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(media);
                hls.attachMedia(video);
            } else {
                video.src = media;
            }

            loaded = true;
        }

        function start() {
            loadMedia();
            box.classList.add('is-playing');
            var playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {});
            }
        }

        if (overlay && video) {
            overlay.addEventListener('click', start);
            video.addEventListener('click', function () {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener('play', function () {
                box.classList.add('is-playing');
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hls && hls.destroy) {
                hls.destroy();
            }
        });
    });
})();
