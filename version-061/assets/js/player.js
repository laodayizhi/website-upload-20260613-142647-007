(function () {
  window.initMoviePlayer = function (source) {
    var video = document.getElementById('movie-player');
    var button = document.getElementById('movie-play-button');
    var hlsInstance = null;
    var ready = false;

    if (!video || !button || !source) {
      return;
    }

    function attach() {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      attach();
      button.classList.add('is-hidden');
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    button.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (!ready) {
        play();
      }
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
