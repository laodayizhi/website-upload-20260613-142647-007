(() => {
    const ready = (fn) => {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    };

    ready(() => {
        const menuButton = document.querySelector("[data-menu-toggle]");
        const mobileNav = document.querySelector("[data-mobile-nav]");
        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", () => {
                mobileNav.classList.toggle("is-open");
                document.body.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
            });
        }

        const inputs = document.querySelectorAll("[data-search-input]");
        inputs.forEach((input) => {
            const root = input.closest("main") || document;
            const cards = Array.from(root.querySelectorAll("[data-card]"));
            const empty = root.querySelector("[data-empty-state]");
            const apply = () => {
                const keyword = input.value.trim().toLowerCase();
                let shown = 0;
                cards.forEach((card) => {
                    const text = [
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.genre,
                        card.dataset.tags,
                        card.textContent
                    ].join(" ").toLowerCase();
                    const visible = !keyword || text.includes(keyword);
                    card.classList.toggle("is-hidden", !visible);
                    if (visible) {
                        shown += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("show", shown === 0);
                }
            };
            input.addEventListener("input", apply);
            apply();
        });

        const hero = document.querySelector("[data-hero-stage]");
        if (hero) {
            const slides = Array.from(hero.querySelectorAll(".hero-slide-data"));
            const title = hero.querySelector("[data-hero-title]");
            const desc = hero.querySelector("[data-hero-desc]");
            const label = hero.querySelector("[data-hero-label]");
            const link = hero.querySelector("[data-hero-link]");
            const poster = hero.querySelector("[data-hero-poster]");
            const dots = Array.from(hero.querySelectorAll("[data-hero-dots] button"));
            let index = 0;
            const show = (next) => {
                if (!slides.length) {
                    return;
                }
                index = (next + slides.length) % slides.length;
                const slide = slides[index];
                hero.style.backgroundImage = `url('${slide.dataset.image}')`;
                if (title) title.textContent = slide.dataset.title || "";
                if (desc) desc.textContent = slide.dataset.desc || "";
                if (label) label.textContent = slide.dataset.label || "精选影视";
                if (link) link.href = slide.dataset.link || "./index.html";
                if (poster) {
                    poster.src = slide.dataset.image || "";
                    poster.alt = `${slide.dataset.title || "影片"}封面`;
                }
                dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
            };
            dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));
            show(0);
            window.setInterval(() => show(index + 1), 5200);
        }

        document.querySelectorAll("[data-player]").forEach((player) => {
            const video = player.querySelector("video");
            const button = player.querySelector("[data-play-button]");
            const status = player.querySelector("[data-player-status]");
            const stream = player.dataset.stream;
            let started = false;
            let hlsInstance = null;

            const setStatus = (message) => {
                if (status) {
                    status.textContent = message || "";
                }
            };

            const start = () => {
                if (!video || !stream) {
                    setStatus("播放暂不可用，请稍后再试");
                    return;
                }
                if (button) {
                    button.classList.add("is-hidden");
                }
                setStatus("正在加载...");
                if (!started) {
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = stream;
                    } else if (typeof Hls !== "undefined" && Hls.isSupported()) {
                        hlsInstance = new Hls({ enableWorker: true });
                        hlsInstance.loadSource(stream);
                        hlsInstance.attachMedia(video);
                        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                            video.play().then(() => setStatus("")).catch(() => setStatus("点击视频继续播放"));
                        });
                        hlsInstance.on(Hls.Events.ERROR, () => setStatus("播放暂不可用，请稍后再试"));
                    } else {
                        setStatus("播放暂不可用，请稍后再试");
                        return;
                    }
                    started = true;
                }
                video.play().then(() => setStatus("")).catch(() => setStatus("点击视频继续播放"));
            };

            if (button) {
                button.addEventListener("click", start);
            }
            if (video) {
                video.addEventListener("click", () => {
                    if (!started || video.paused) {
                        start();
                    } else {
                        video.pause();
                    }
                });
                video.addEventListener("playing", () => setStatus(""));
                video.addEventListener("error", () => setStatus("播放暂不可用，请稍后再试"));
                window.addEventListener("beforeunload", () => {
                    if (hlsInstance) {
                        hlsInstance.destroy();
                    }
                });
            }
        });
    });
})();
