document.addEventListener("DOMContentLoaded", () => {
    // エンドポイントは window.CONTACT_ENDPOINT にセットするか、下記を直接書き換えてください
    const SHEETS_ENDPOINT = window.CONTACT_ENDPOINT || "";
    // ---------- 基本設定 ----------
    const defaultVideos = [
        // Movie
        { id: "xaSqnQR0G2w", title: "Movie 01", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "ee-3TQvW5gM", title: "Movie 02", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "Dmlf-n2Imp8", title: "Movie 03", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "H2wptUnWpXU", title: "Movie 04", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "W_HYgUDwvOc", title: "Movie 05", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "IJNwhMJiHc8", title: "Movie 06", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "f8tT4SMlZCc", title: "Movie 07", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "8uGQI4pLSbY", title: "Movie 08", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "9tCDuMkgqWY", title: "Movie 09", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "WvpiN-fBc4w", title: "Movie 10", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "sPmodSfENCo", title: "Movie 11", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "T7VwIYroqUg", title: "Movie 12", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "wQNNAotOI-4", title: "Movie 13", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "5QnNN70VDQA", title: "Movie 14", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        { id: "AlQTWNvVNNY", title: "Movie 15", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "video" },
        // CG
        { id: "IvZsmy8oas0", title: "CG Movie 01", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "yVxMx-P8A74", title: "CG Movie 02", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "mkumK-GRQHE", title: "CG Movie 03", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "zslrOJpWziE", title: "CG Movie 04", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "ou1uztupxsI", title: "CG Movie 05", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "HjcYQzdPwm0", title: "CG Movie 06", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "wXOhpcx_raM", title: "CG Movie 07", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "zPxjajyPxig", title: "CG Movie 08", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "o5BesyscRIU", title: "CG Movie 09", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "cuKyo7xhUJs", title: "CG Movie 10", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "GVgCpK0RKWs", title: "CG Movie 11", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" },
        { id: "XTdRArvaU-g", title: "CG Movie 12", genre: "SNS", date: "2025年10月", role: "3DCGモデリング", category: "cg" }
    ];

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

    const applyReveal = () => {
        document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
        setTimeout(() => {
            document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
        }, 200);
    };

    const loadVideos = async () => {
        try {
            const res = await fetch("data/videos.json", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.videos)) return data.videos;
            }
        } catch (e) {
            console.warn("video.json load failed, fallback to default", e);
        }
        return defaultVideos;
    };

    const iframeSrc = id =>
        `https://www.youtube.com/embed/${id}?rel=0&autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&controls=0&modestbranding=1&fs=0&showinfo=0&iv_load_policy=3`;

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
            const iframe = document.createElement("iframe");
            iframe.src = iframeSrc(video.id);
            iframe.title = video.title || "YouTube video";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";
            embed.appendChild(iframe);
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

    // 汎用カードカルーセル（画像3枚表示など）
    const buildCardCarousel = (carousel, items) => {
        if (!carousel || !items.length) return;
        const perView = Number(carousel.dataset.show || 1);

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
        controls.appendChild(dots);

        items.forEach((item, idx) => {
            const slide = document.createElement("div");
            slide.className = "carousel-slide";
            slide.style.flex = `0 0 ${100 / perView}%`;

            slide.innerHTML = `
                <a class="card-link" href="${item.link || "#"}" target="_blank" rel="noopener">
                    <div class="card-thumb">
                        <img class="card-thumb-img" src="${item.img}" alt="${item.title || "thumbnail"}">
                    </div>
                    <div class="card-body">
                        <p class="card-tag">${item.tag || ""}</p>
                        <h4>${item.title || ""}</h4>
                        <p class="card-desc">${item.desc || ""}</p>
                    </div>
                </a>
            `;
            track.appendChild(slide);

        });

        const total = items.length;
        const maxIndex = Math.max(0, total - perView);
        let index = 0;
        let timer;

        for (let d = 0; d <= maxIndex; d++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("aria-label", `スライド${d + 1} を表示`);
            dot.addEventListener("click", () => {
                goTo(d);
                restart();
            });
            dots.appendChild(dot);
        }

        const goTo = i => {
            const next = (i + total) % total;
            index = next > maxIndex ? 0 : next;
            track.style.transform = `translateX(-${(index * 100) / perView}%)`;
            dots.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
                dot.classList.toggle("active", dotIndex === index);
            });
        };

        const stop = () => { if (timer) clearInterval(timer); };
        const restart = () => {
            stop();
            timer = setInterval(() => goTo(index + 1), 3000);
        };

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", restart);

        goTo(0);
        restart();
    };

    const highlightItems = [
        { title: "インタビュー掲載", desc: "働き方・制作に関するインタビュー", img: "assets/others/interview.webp", tag: "Others", link: "others.html" },
        { title: "登壇", desc: "新しい働き方AWARDで登壇・発表", img: "assets/others/stage.jpg", tag: "Others", link: "others.html" },
        { title: "青山学院大学HP掲載", desc: "研究ラボ成果の掲載記事", img: "assets/others/aogaku.jpg", tag: "Others", link: "others.html" },
        { title: "ソフトバンク生成AIコンテスト", desc: "アイデア提案", img: "assets/others/softbank-ai.png", tag: "Others", link: "others.html" },
        { title: "スポーツ庁コンペ 優秀賞", desc: "健康まちづくりデザインコンペ2025", img: "assets/others/award-digital-hollywood.png", tag: "Others", link: "others.html" },
        { title: "パンフレット制作 03", desc: "パンフレットデザイン", img: "graphics/g-pamphlet-03.webp", tag: "Graphics", link: "graphics.html" },
        { title: "パンフレット制作 04", desc: "パンフレットデザイン", img: "graphics/g-pamphlet-04.webp", tag: "Graphics", link: "graphics.html" },
        { title: "パンフレット制作 05", desc: "パンフレットデザイン", img: "graphics/g-pamphlet-05.webp", tag: "Graphics", link: "graphics.html" },
        { title: "MESSAGE展 出展", desc: "展示作品", img: "graphics/MESSAGE展.webp", tag: "Graphics", link: "graphics.html" },
        { title: "NaTure", desc: "点描イラスト", img: "graphics/NaTure.webp", tag: "Graphics", link: "graphics.html" }
    ];

    const renderList = (container, category, videoData) => {
        const list = videoData.filter(v => v.category === category);
        container.innerHTML = "";
        list.forEach(item => {
            const card = document.createElement("div");
            card.className = "video-card reveal";
            const embed = document.createElement("div");
            embed.className = "video-embed";
            const iframe = document.createElement("iframe");
            iframe.src = iframeSrc(item.id);
            iframe.title = item.title || "YouTube video";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";
            embed.appendChild(iframe);

            const meta = document.createElement("div");
            meta.className = "video-meta";
            meta.innerHTML = `
                <h3>${item.title || "Untitled"}</h3>
                <p class="meta-line">ジャンル: ${item.genre || "-"}</p>
                <p class="meta-line">制作時期: ${item.date || "-"}</p>
                <p class="meta-line">担当: ${item.role || "-"}</p>
            `;

            card.appendChild(embed);
            card.appendChild(meta);
            container.appendChild(card);
        });
    };

    const bindModal = () => {
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

        document.body.addEventListener("click", event => {
            const embed = event.target.closest(".video-embed");
            if (!embed) return;
            event.preventDefault();
            const card = embed.closest(".video-card");
            const title = card.querySelector("h3")?.textContent || "この動画";
            const lines = card.querySelectorAll(".meta-line");
            showModal({
                title,
                genre: lines[0]?.textContent?.replace("ジャンル: ", "") || "SNS",
                date: lines[1]?.textContent?.replace("制作時期: ", "") || "YouTube公開日ベース",
                role: lines[2]?.textContent?.replace("担当: ", "") || "3DCGモデリング"
            });
        });
    };

    // ---------- Contact form ----------
    const bindContactForm = () => {
        const form = document.getElementById("contact-form");
        if (!form) return;

        let counter = 0;

        form.addEventListener("submit", async event => {
            event.preventDefault();
            const formData = new FormData(form);
            const name = formData.get("name")?.toString().trim();
            const furigana = formData.get("furigana")?.toString().trim();
            const company = formData.get("company")?.toString().trim();
            const email = formData.get("email")?.toString().trim();
            const phone = formData.get("phone")?.toString().trim();
            const message = formData.get("message")?.toString().trim();

            if (!name || !email || !message) {
                alert("必須項目（お名前、メールアドレス、お問い合わせ内容）を入力してください。");
                return;
            }

            counter += 1;
            const payload = {
                subject: `サイトからの問い合わせ#${counter}`,
                name,
                furigana,
                company,
                email,
                phone,
                message
            };

            try {
                if (!SHEETS_ENDPOINT) {
                    throw new Error("送信先エンドポイントが未設定です。window.CONTACT_ENDPOINT にURLをセットしてください。");
                }
                await fetch(SHEETS_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    mode: "no-cors",
                    cache: "no-store"
                });
            } catch (err) {
                console.error(err);
                // no-cors のため結果は判定しない
            }

            form.reset();
            window.location.href = "thanks.html";
        });
    };

    const bindGalleryLinks = () => {
        document.querySelectorAll(".gallery-card[data-link]").forEach(card => {
            const url = card.dataset.link;
            if (!url) return;
            card.style.cursor = "pointer";
            card.addEventListener("click", () => {
                window.open(url, "_blank", "noopener");
            });
        });
    };

    const initAnchors = () => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener("click", event => {
                const targetId = link.getAttribute("href");
                const target = document.querySelector(targetId);
                if (!target) return;
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    };

    const initCurrentMonth = () => {
        const currentHint = document.querySelector('[data-current-month]');
        if (currentHint) {
            const now = new Date();
            currentHint.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月現在`;
        }
    };

    const bindMenuToggle = () => {
        let toggle = document.querySelector(".menu-toggle");
        let nav = document.querySelector(".site-nav") || document.querySelector(".site-header nav");
        if (!nav) return;
        nav.classList.add("site-nav");
        if (!toggle) {
            toggle = document.createElement("button");
            toggle.className = "menu-toggle";
            toggle.setAttribute("aria-label", "メニュー");
            toggle.textContent = "☰";
            const layout = document.querySelector(".nav-layout");
            if (layout) {
                layout.insertBefore(toggle, nav);
            }
        }
        toggle.addEventListener("click", () => {
            const opened = nav.classList.toggle("open");
            document.body.classList.toggle("nav-open", opened);
        });
    };

    const init = async () => {
        applyReveal();
        const videoData = await loadVideos();

        document.querySelectorAll("[data-carousel]").forEach(carousel => {
            const cat = carousel.dataset.carousel;
            if (cat === "highlight") {
                buildCardCarousel(carousel, highlightItems);
            } else {
                const vids = videoData.filter(v => v.category === cat);
                buildCarousel(carousel, vids);
            }
        });

        document.querySelectorAll("[data-list]").forEach(container => {
            const category = container.dataset.list;
            renderList(container, category, videoData);
        });

        applyReveal();
        bindModal();
        bindContactForm();
        bindGalleryLinks();
        bindMenuToggle();
        initAnchors();
        initCurrentMonth();
    };

    init();
});

// ---------- Splash (one-time, full overlay, auto fade) ----------
document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash");
    if (!splash) return;

    const SPLASH_KEY = "splashSeenV2";
    const seen = localStorage.getItem(SPLASH_KEY) === "true";
    if (seen) return;

    const slides = [
        { title: "ソフトバンク様3D映像制作", desc: "展示向け3Dコンテンツ", img: "CG/cg-softbank-20241208.webp" },
        { title: "Faint Hope", desc: "ショートフィルム用ルック", img: "CG/『Faint Hope』.webp" },
        { title: "Happy Valentine", desc: "演出ビジュアル", img: "CG/Happy Valentine01.webp" },
        { title: "ガーリーなお部屋", desc: "インテリアCG", img: "CG/cg-girly-room-01.webp" },
        { title: "Articles", desc: "noteで執筆", img: "assets/articles-note.webp" },
        { title: "WEB制作", desc: "株式会社スムージースタジオ", img: "assets/web-smoothie.webp" },
        { title: "the Chosen Ones", desc: "キャラクタービジュアル", img: "CG/『the Chosen Ones』01.webp" },
        { title: "経産省コンテスト", desc: "「逆に普通が良い賞」受賞", img: "assets/articles-kikagaku.webp" }
    ];

    const grid = splash.querySelector(".splash-grid");
    slides.forEach(item => {
        const cell = document.createElement("div");
        cell.className = "splash-card";
        cell.innerHTML = `
            <div class="splash-thumb" style="background-image:url('${item.img}')"></div>
            <div class="splash-meta">
                <p class="splash-item-title">${item.title}</p>
                <p class="splash-item-desc">${item.desc}</p>
            </div>
        `;
        grid.appendChild(cell);
    });

    // show overlay
    splash.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // auto fade after 3s
    setTimeout(() => {
        splash.classList.add("fade-out");
        setTimeout(() => {
            splash.classList.add("hidden");
            document.body.style.overflow = "";
            localStorage.setItem(SPLASH_KEY, "true");
        }, 600);
    }, 3000);
});
