(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var video = document.querySelector("[data-player-video]");
    var toggle = document.querySelector("[data-play-toggle]");
    if (!video) {
      return;
    }
    var source = video.getAttribute("data-play");
    var hls = null;

    if (source) {
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      }
    }

    function playVideo() {
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    function updateOverlay() {
      if (!toggle) {
        return;
      }
      toggle.classList.toggle("is-hidden", !video.paused);
    }

    if (toggle) {
      toggle.addEventListener("click", playVideo);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      }
    });
    video.addEventListener("play", updateOverlay);
    video.addEventListener("pause", updateOverlay);
    video.addEventListener("ended", updateOverlay);
    updateOverlay();

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
