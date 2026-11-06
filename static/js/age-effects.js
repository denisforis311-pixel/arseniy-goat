document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("age-input");
    const box = document.getElementById("age-box");
    const title = document.getElementById("age-title");
    if (!input || !box || !title) return;

    input.addEventListener("input", () => {
        const val = parseInt(input.value);
        box.style.borderColor = "var(--neon-cyan)";
        box.style.transform = "none";
        box.style.filter = "none";
        title.innerText = "Подтвердите свой возраст";
        title.style.color = "var(--neon-cyan)";

        if (isNaN(val)) return;
        if (val === 67) {
            box.style.borderColor = "#ef4444";
            title.innerText = "Ты уверено? 🤨";
            title.style.color = "#ef4444";
            box.style.transform = "scale(1.02) rotate(1deg)";
        } else if (val > 100) {
            box.style.borderColor = "#94a3b8";
            title.innerText = "Древний инвестор... 👵";
            box.style.filter = "sepia(0.4)";
        } else if (val < 18) {
            box.style.borderColor = "#f59e0b";
            title.innerText = "Доступ опасен! 🚫";
            title.style.color = "#f59e0b";
        }
    });
});
