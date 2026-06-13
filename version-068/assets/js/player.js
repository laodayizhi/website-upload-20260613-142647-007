import { H as Hls } from './hls-vendor.js';

export function setupPlayer(source) {
  const video = document.querySelector('[data-player-video]');
  const overlay = document.querySelector('[data-play-overlay]');
  const button = document.querySelector('[data-play-button]');
  let attached = false;
  let hls = null;

  if (!video || !source) {
    return;
  }

  const attach = () => {
    if (attached) {
      return;
    }

    attached = true;
    video.controls = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        enableWorker: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  };

  const start = () => {
    attach();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  if (overlay) {
    overlay.addEventListener('click', start);
  }

  if (button) {
    button.addEventListener('click', start);
  }

  video.addEventListener('click', () => {
    if (!attached) {
      start();
    }
  });

  window.addEventListener('beforeunload', () => {
    if (hls) {
      hls.destroy();
    }
  });
}
