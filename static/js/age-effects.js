document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('arseniy-app-theme') || 'theme-cyan';
    document.body.classList.add(savedTheme);

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
        title.style.color = "var(--text-white)";

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

window.setTheme = function(themeName) {
    document.body.classList.remove('theme-cyan', 'theme-emerald', 'theme-amethyst');
    document.body.classList.add(themeName);
    localStorage.setItem('arseniy-app-theme', themeName);
}

/**
 * Функция циклического переключения тем для минималистичной кнопки
 */
window.toggleNextTheme = function() {
    const themes = ['theme-cyan', 'theme-emerald', 'theme-amethyst'];
    let currentTheme = localStorage.getItem('arseniy-app-theme') || 'theme-cyan';
    
    // Находим индекс следующей темы в массиве
    let nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    window.setTheme(themes[nextIndex]);
}
