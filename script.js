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
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
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
