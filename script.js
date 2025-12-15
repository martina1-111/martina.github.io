document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    const movieVideos = [
        { id: "xaSqnQR0G2w", title: "Movie 01" },
        { id: "ee-3TQvW5gM", title: "Movie 02" },
        { id: "Dmlf-n2Imp8", title: "Movie 03" },
        { id: "H2wptUnWpXU", title: "Movie 04" },
        { id: "W_HYgUDwvOc", title: "Movie 05" },
        { id: "IJNwhMJiHc8", title: "Movie 06" },
        { id: "f8tT4SMlZCc", title: "Movie 07" },
        { id: "8uGQI4pLSbY", title: "Movie 08" },
        { id: "9tCDuMkgqWY", title: "Movie 09" },
        { id: "WvpiN-fBc4w", title: "Movie 10" },
        { id: "sPmodSfENCo", title: "Movie 11" },
        { id: "T7VwIYroqUg", title: "Movie 12" },
        { id: "wQNNAotOI-4", title: "Movie 13" },
        { id: "5QnNN70VDQA", title: "Movie 14" },
        { id: "AlQTWNvVNNY", title: "Movie 15" }
    ];

    const buildCarousel = (carousel, videos) => {
        if (!carousel || !videos.length) return;

        const track = document.createElement("div");
        track.className = "carousel-track";
        const dots = document.createElement("div");
        dots.className = "carousel-dots";
        const windowEl = document.createElement("div");
        windowEl.className = "carousel-window";
        windowEl.appendChild(track);

        carousel.innerHTML = "";
        carousel.appendChild(windowEl);
        carousel.appendChild(dots);

        videos.forEach((video, idx) => {
            const slide = document.createElement("div");
            slide.className = "carousel-slide";
            const embed = document.createElement("div");
            embed.className = "video-embed";
            embed.dataset.videoId = video.id;
            embed.dataset.title = video.title;
            slide.appendChild(embed);
            track.appendChild(slide);

            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("aria-label", `${video.title} を表示`);
            dot.addEventListener("click", () => {
                goTo(idx);
                restart();
            });
            dots.appendChild(dot);
        });

        const total = videos.length;
        let index = 0;
        let timer;

        const goTo = i => {
            index = (i + total) % total;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
                dot.classList.toggle("active", dotIndex === index);
            });
        };

        const stop = () => {
            if (timer) clearInterval(timer);
        };

        const restart = () => {
            stop();
            timer = setInterval(() => goTo(index + 1), 3000);
        };

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", restart);

        goTo(0);
        restart();
    };

    document.querySelectorAll('[data-carousel="movie"]').forEach(carousel => {
        buildCarousel(carousel, movieVideos);
    });

    document.querySelectorAll(".video-embed").forEach(container => {
        const videoId = container.dataset.videoId;
        const title = container.dataset.title || "YouTube video";
        if (videoId && !videoId.startsWith("VIDEO_ID")) {
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&mute=1&playsinline=1`;
            iframe.title = title;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";
            container.appendChild(iframe);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "placeholder";
            placeholder.textContent = container.dataset.caption || "YouTubeリンクをここに設定してください。";
            container.appendChild(placeholder);
        }
    });

    // 動画クリックでコメント入力ポップアップ
    const modal = document.createElement("div");
    modal.className = "comment-modal hidden";
    modal.innerHTML = `
        <div class="comment-backdrop"></div>
        <div class="comment-dialog">
            <button class="comment-close" aria-label="閉じる">×</button>
            <p class="comment-title">ひと言メモ</p>
            <p class="comment-target"></p>
            <label class="comment-label">
                制作時期・日付
                <input class="comment-date" type="text" placeholder="例: 2024年12月 / 2024.12.10" />
            </label>
            <textarea class="comment-input" rows="3" placeholder="ひと言コメントをここに"></textarea>
            <div class="comment-actions">
                <button class="btn ghost small comment-cancel">閉じる</button>
                <button class="btn primary small comment-save">メモする</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const showModal = targetTitle => {
        modal.classList.remove("hidden");
        modal.querySelector(".comment-target").textContent = targetTitle || "この動画";
        modal.querySelector(".comment-input").value = "";
        modal.querySelector(".comment-date").value = "";
    };
    const hideModal = () => modal.classList.add("hidden");

    modal.querySelector(".comment-backdrop").addEventListener("click", hideModal);
    modal.querySelector(".comment-close").addEventListener("click", hideModal);
    modal.querySelector(".comment-cancel").addEventListener("click", hideModal);
    modal.querySelector(".comment-save").addEventListener("click", () => {
        const text = modal.querySelector(".comment-input").value.trim();
        const date = modal.querySelector(".comment-date").value.trim();
        if (text || date) {
            alert(`メモしました${date ? ` [時期: ${date}]` : ""}${text ? `\n${text}` : ""}`);
        }
        hideModal();
    });

    document.querySelectorAll(".video-embed").forEach(container => {
        container.addEventListener("click", event => {
            event.preventDefault();
            const title = container.dataset.title || "この動画";
            showModal(title);
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // 現在年月を表示（例: 2025年12月現在）
    const currentHint = document.querySelector('[data-current-month]');
    if (currentHint) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        currentHint.textContent = `${year}年${month}月現在`;
    }
});
