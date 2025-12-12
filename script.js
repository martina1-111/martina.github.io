// スクロール時のフェードインアニメーション
document.addEventListener("DOMContentLoaded", () => {
    
    // Intersection Observerの設定
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1 // 10%見えたら発火
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // 一度表示したら監視終了
            }
        });
    }, observerOptions);

    // .card と .about-text を監視対象にする
    const targets = document.querySelectorAll(".card, .about-text");
    targets.forEach(target => {
        target.style.opacity = "0";
        target.style.transform = "translateY(30px)";
        target.style.transition = "all 0.6s ease-out";
        observer.observe(target);
    });

    // 表示された時のスタイル定義を追加
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});