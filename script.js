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

// ---------- Loading overlay (lightweight, every load, auto hide) ----------
document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash");
    if (!splash) return;

    // Replace content with a simple loader
    const content = splash.querySelector(".splash-content");
    if (content) {
        content.innerHTML = `
            <div class="splash-loader">
                <span></span><span></span><span></span>
            </div>
        `;
    }

    splash.classList.remove("hidden");
    document.body.classList.add("nav-open"); // reuse to lock scroll

    const hideSplash = () => {
        splash.classList.add("fade-out");
        setTimeout(() => {
            splash.classList.add("hidden");
            document.body.classList.remove("nav-open");
        }, 500);
    };

// hide on full load or after fallback timeout
    window.addEventListener("load", () => hideSplash(), { once: true });
    setTimeout(hideSplash, 1800);
});

// ---------- New Year interactive visual ----------
document.addEventListener("DOMContentLoaded", () => {
    const visuals = document.querySelectorAll("[data-newyear]");
    if (!visuals.length) return;

    const activate = visual => {
        visual.classList.add("is-active");
        const hue = Math.floor(Math.random() * 40) - 20;
        visual.style.filter = `hue-rotate(${hue}deg)`;
        setTimeout(() => {
            visual.classList.remove("is-active");
            visual.style.filter = "";
        }, 1200);
    };

    visuals.forEach(visual => {
        visual.addEventListener("click", () => activate(visual));
        visual.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activate(visual);
            }
        });
    });
});

// ---------- New Year page interactions ----------
document.addEventListener("DOMContentLoaded", () => {
    const wishSection = document.querySelector(".newyear-wish");
    const wishForm = document.querySelector(".wish-form");
    const wishMarquee = document.querySelector(".wish-marquee");
    const countdown = document.querySelector(".newyear-countdown");
    const videoWrap = document.querySelector(".newyear-video");
    const audioToggle = document.querySelector(".audio-toggle");
    const particlesCanvas = document.querySelector(".newyear-particles");

    if (videoWrap && wishSection) {
        setTimeout(() => {
            videoWrap.classList.add("fade-out");
            setTimeout(() => {
                const message = document.querySelector(".newyear-message");
                if (message) message.classList.add("hidden");
                wishSection.classList.add("show");
                wishSection.setAttribute("aria-hidden", "false");
                if (wishMarquee) wishMarquee.classList.add("is-active");
            }, 1200);
        }, 5000);
    }

    if (wishForm && wishMarquee) {
        const KEY = "newyearWishes";
        const API_URL = "https://script.google.com/macros/s/AKfycbzWdOLCBJQ4Q6-ZdDRiK7Yjd6yJYa-s0bNjXWgNctsR_oPrODyQRWtWLUrFnyAJK44v/exec";
        const getLocalWishes = () => JSON.parse(localStorage.getItem(KEY) || "[]");
        const saveLocalWishes = items => localStorage.setItem(KEY, JSON.stringify(items));

        const fetchWishes = async () => {
            try {
                const res = await fetch(API_URL);
                const data = await res.json();
                if (data && data.ok && Array.isArray(data.messages)) {
                    return data.messages;
                }
            } catch (err) {
                // fall back to local if GAS is unreachable
            }
            return getLocalWishes();
        };

        const postWish = async message => {
            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message })
                });
                const data = await res.json();
                return !!(data && data.ok);
            } catch (err) {
                return false;
            }
        };

        const LANES = 9;
        const laneCooldown = new Array(LANES).fill(0);
        const pickLane = durationMs => {
            const now = Date.now();
            const order = Array.from({ length: LANES }, (_, i) => i)
                .sort(() => Math.random() - 0.5);
            for (const idx of order) {
                if (laneCooldown[idx] <= now) {
                    laneCooldown[idx] = now + durationMs * 0.6;
                    return idx;
                }
            }
            const fallback = Math.floor(Math.random() * LANES);
            laneCooldown[fallback] = now + durationMs * 0.4;
            return fallback;
        };

        const spawnBubble = (text, options = {}) => {
            const bubble = document.createElement("div");
            bubble.className = "wish-bubble";
            bubble.textContent = text;
            const size = 0.85 + Math.random() * 0.5;
            const speed = 12 + Math.random() * 10;
            const delay = options.initial ? -Math.random() * speed : Math.random() * 2;
            const z = Math.floor(Math.random() * 3) + 1;
            const durationMs = speed * 1000;
            const lane = pickLane(durationMs);
            const gutter = 4;
            const laneWidth = (100 - gutter * 2) / LANES;
            const left = gutter + lane * laneWidth + laneWidth * 0.1;
            bubble.style.left = `${left}%`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.animationDuration = `${speed}s`;
            bubble.style.transform = `scale(${size})`;
            bubble.style.zIndex = String(z);
            wishMarquee.appendChild(bubble);
            bubble.addEventListener("animationend", () => {
                bubble.remove();
            });
        };

        const seedBubbles = async () => {
            wishMarquee.innerHTML = "";
            const items = await fetchWishes();
            const base = items.length
                ? items
                : ["健康に過ごしたい", "新しいことに挑戦", "笑顔の多い一年"];
            const initialCount = 14;
            for (let i = 0; i < initialCount; i += 1) {
                spawnBubble(base[i % base.length], { initial: true });
            }
        };

        let bubbleTimer = null;
        const startBubbles = () => {
            if (bubbleTimer) return;
            seedBubbles();
            bubbleTimer = setInterval(async () => {
                const items = await fetchWishes();
                if (!items.length) return;
                const text = items[Math.floor(Math.random() * items.length)];
                spawnBubble(text);
                const bubbles = wishMarquee.querySelectorAll(".wish-bubble");
                if (bubbles.length > MAX_BUBBLES) {
                    bubbles[0].remove();
                }
            }, 1600);
        };

        wishForm.addEventListener("submit", async event => {
            event.preventDefault();
            const input = wishForm.querySelector("input[name='wish']");
            const value = (input.value || "").trim();
            if (!value) return;
            const items = getLocalWishes();
            items.push(value);
            saveLocalWishes(items);
            input.value = "";
            spawnBubble(value);
            await postWish(value);
        });

        const MAX_BUBBLES = 24;

        if (wishSection?.classList.contains("show")) {
            wishMarquee.classList.add("is-active");
            startBubbles();
        }
        if (wishSection) {
            const observer = new MutationObserver(() => {
                if (wishSection.classList.contains("show")) {
                    wishMarquee.classList.add("is-active");
                    startBubbles();
                    observer.disconnect();
                }
            });
            observer.observe(wishSection, { attributes: true, attributeFilter: ["class"] });
        }
    }

    if (countdown) {
        const updateCountdown = () => {
            const now = new Date();
            const end = new Date(now.getFullYear() + 1, 0, 1);
            const diff = end - now;
            const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
            const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
            countdown.textContent = `今年残り ${days}日${hours}時間`;
        };
        updateCountdown();
        setInterval(updateCountdown, 60 * 1000);
    }

    if (audioToggle) {
        const audio = new Audio("assets/BGM.wav");
        audio.loop = true;
        audio.volume = 0.4;
        let playing = true;
        const updateLabel = () => {
            audioToggle.textContent = playing ? "Sound On" : "Sound Off";
            audioToggle.setAttribute("aria-pressed", String(playing));
        };
        updateLabel();
        audio.play().catch(() => {
            playing = false;
            updateLabel();
        });
        audioToggle.addEventListener("click", () => {
            playing = !playing;
            if (playing) {
                audio.play().catch(() => {
                    playing = false;
                    updateLabel();
                });
            } else {
                audio.pause();
            }
            updateLabel();
        });
        const resumeAudio = () => {
            if (!playing) return;
            audio.play().catch(() => {});
        };
        document.addEventListener("click", resumeAudio, { once: true });
        document.addEventListener("touchstart", resumeAudio, { once: true });
    }

    if (particlesCanvas) {
        const ctx = particlesCanvas.getContext("2d");
        const state = { w: 0, h: 0, particles: [] };
        const resize = () => {
            state.w = particlesCanvas.width = window.innerWidth;
            state.h = particlesCanvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const addParticle = (x, y) => {
            state.particles.push({
                x,
                y,
                r: Math.random() * 6 + 2,
                a: 1,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.7) * 0.6
            });
        };

        const step = () => {
            ctx.clearRect(0, 0, state.w, state.h);
            state.particles = state.particles.filter(p => p.a > 0.05);
            state.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.a *= 0.96;
                ctx.fillStyle = `rgba(217,156,242,${p.a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(step);
        };
        step();

        const emit = event => {
            const rect = particlesCanvas.getBoundingClientRect();
            const x = (event.clientX || 0) - rect.left;
            const y = (event.clientY || 0) - rect.top;
            for (let i = 0; i < 6; i++) addParticle(x, y);
        };

        document.addEventListener("mousemove", emit);
        document.addEventListener("touchmove", e => {
            if (e.touches && e.touches[0]) {
                emit(e.touches[0]);
            }
        }, { passive: true });
    }
});
