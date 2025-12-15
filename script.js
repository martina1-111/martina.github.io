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

    document.querySelectorAll(".video-embed").forEach(container => {
        const videoId = container.dataset.videoId;
        const title = container.dataset.title || "YouTube video";
        if (videoId && !videoId.startsWith("VIDEO_ID")) {
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&mute=1&playsinline=1`;
            iframe.title = title;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
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
    };
    const hideModal = () => modal.classList.add("hidden");

    modal.querySelector(".comment-backdrop").addEventListener("click", hideModal);
    modal.querySelector(".comment-close").addEventListener("click", hideModal);
    modal.querySelector(".comment-cancel").addEventListener("click", hideModal);
    modal.querySelector(".comment-save").addEventListener("click", () => {
        const text = modal.querySelector(".comment-input").value.trim();
        if (text) {
            alert(`メモしました: ${text}`);
        }
        hideModal();
    });

    document.querySelectorAll(".video-embed").forEach(container => {
        container.addEventListener("click", () => {
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
