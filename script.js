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
    // フォールバック: もしIntersectionObserverが発火しなくても表示されるように
    setTimeout(() => {
        document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
    }, 200);

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
        const controls = document.createElement("div");
        controls.className = "carousel-controls";
        const windowEl = document.createElement("div");
        windowEl.className = "carousel-window";
        windowEl.appendChild(track);

        carousel.innerHTML = "";
        carousel.appendChild(windowEl);
        carousel.appendChild(controls);

        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "carousel-arrow prev";
        prevBtn.setAttribute("aria-label", "前の動画へ");
        prevBtn.textContent = "‹";

        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "carousel-arrow next";
        nextBtn.setAttribute("aria-label", "次の動画へ");
        nextBtn.textContent = "›";

        controls.appendChild(prevBtn);
        controls.appendChild(dots);
        controls.appendChild(nextBtn);

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

        prevBtn.addEventListener("click", () => {
            goTo(index - 1);
            restart();
        });

        nextBtn.addEventListener("click", () => {
            goTo(index + 1);
            restart();
        });

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", restart);

        goTo(0);
        restart();
    };

    document.querySelectorAll('[data-carousel="movie"]').forEach(carousel => {
        buildCarousel(carousel, movieVideos);
    });

    // 動画クリックでメタ情報表示（事前入力）
    const modal = document.createElement("div");
    modal.className = "comment-modal hidden";
    modal.innerHTML = `
        <div class="comment-backdrop"></div>
        <div class="comment-dialog">
            <button class="comment-close" aria-label="閉じる">×</button>
            <p class="comment-title">作品メモ</p>
            <div class="comment-fields">
                <p><strong>タイトル：</strong><span class="comment-title-text"></span></p>
                <p><strong>ジャンル：</strong><span class="comment-genre"></span></p>
                <p><strong>制作時期：</strong><span class="comment-date"></span></p>
                <p><strong>担当：</strong><span class="comment-role"></span></p>
            </div>
            <div class="comment-actions">
                <button class="btn ghost small comment-cancel">閉じる</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const showModal = info => {
        modal.classList.remove("hidden");
        modal.querySelector(".comment-title-text").textContent = info.title || "この動画";
        modal.querySelector(".comment-genre").textContent = info.genre || "SNS";
        modal.querySelector(".comment-date").textContent = info.date || "YouTube公開日ベース";
        modal.querySelector(".comment-role").textContent = info.role || "3DCGモデリング";
    };
    const hideModal = () => modal.classList.add("hidden");

    modal.querySelector(".comment-backdrop").addEventListener("click", hideModal);
    modal.querySelector(".comment-close").addEventListener("click", hideModal);
    modal.querySelector(".comment-cancel").addEventListener("click", hideModal);

    // 画像スライダー（2枚切替） + 詳細ポップ
    document.querySelectorAll(".image-slider").forEach(slider => {
        const imgEl = slider.querySelector("img");
        const list = (slider.dataset.images || "").split(",").map(s => s.trim()).filter(Boolean);
        if (!imgEl || !list.length) return;

        let index = 0;

        const applySrc = () => {
            imgEl.src = list[index];
        };

        const prev = document.createElement("button");
        prev.type = "button";
        prev.className = "slider-arrow prev";
        prev.setAttribute("aria-label", "前の画像");
        prev.textContent = "‹";

        const next = document.createElement("button");
        next.type = "button";
        next.className = "slider-arrow next";
        next.setAttribute("aria-label", "次の画像");
        next.textContent = "›";

        prev.addEventListener("click", e => {
            e.stopPropagation();
            index = (index - 1 + list.length) % list.length;
            applySrc();
        });
        next.addEventListener("click", e => {
            e.stopPropagation();
            index = (index + 1) % list.length;
            applySrc();
        });

        if (list.length > 1) {
            slider.appendChild(prev);
            slider.appendChild(next);
        }

        applySrc();

        slider.addEventListener("click", () => {
            showModal({
                title: slider.dataset.title || "この作品",
                genre: slider.dataset.genre || "CG",
                date: slider.dataset.date || "制作時期: 更新予定",
                role: slider.dataset.role || "3DCGモデリング"
            });
        });
    });

    // メタ情報（ジャンル/制作時期/担当）
    const videoMeta = {
        xaSqnQR0G2w: { title: "Movie 01", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        "ee-3TQvW5gM": { title: "Movie 02", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        Dmlf-n2Imp8: { title: "Movie 03", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        H2wptUnWpXU: { title: "Movie 04", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        W_HYgUDwvOc: { title: "Movie 05", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        IJNwhMJiHc8: { title: "Movie 06", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        f8tT4SMlZCc: { title: "Movie 07", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        "8uGQI4pLSbY": { title: "Movie 08", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        "9tCDuMkgqWY": { title: "Movie 09", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        "WvpiN-fBc4w": { title: "Movie 10", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        sPmodSfENCo: { title: "Movie 11", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        T7VwIYroqUg: { title: "Movie 12", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        "wQNNAotOI-4": { title: "Movie 13", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        "5QnNN70VDQA": { title: "Movie 14", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" },
        AlQTWNvVNNY: { title: "Movie 15", genre: "SNS", date: "2025年10月（YouTube公開ベース）", role: "3DCGモデリング" }
    };

    document.querySelectorAll(".video-embed").forEach(container => {
        const videoId = container.dataset.videoId;
        const meta = videoMeta[videoId] || {};
        const title = meta.title || container.dataset.title || "YouTube video";
        if (meta.genre) container.dataset.genre = meta.genre;
        if (meta.date) container.dataset.date = meta.date;
        if (meta.role) container.dataset.role = meta.role;
        container.dataset.title = title;

        if (videoId && !videoId.startsWith("VIDEO_ID")) {
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&mute=1&playsinline=1&loop=1&playlist=${videoId}`;
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

        container.addEventListener("click", event => {
            event.preventDefault();
            showModal({
                title: container.dataset.title,
                genre: container.dataset.genre,
                date: container.dataset.date,
                role: container.dataset.role
            });
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
