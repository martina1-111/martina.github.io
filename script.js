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

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
});
