document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('arseniy-app-theme') || 'theme-cyan';
    document.body.classList.add(savedTheme);

    const input = document.getElementById("age-input");
    const box = document.getElementById("age-box");
    const title = document.getElementById("age-title");
    const form = document.getElementById("portal-form");
    const portal = document.getElementById("portal-element");

    if (input && box && title) {
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
    }

    // Перехват отправки формы для запуска портала Рика и Морти
    if (form && portal && box) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Тормозим моментальный переход

            // Активируем крутящийся портал
            portal.classList.add("active");

            // Запускаем эффект засасывания карточки через 300мс
            setTimeout(() => {
                box.classList.add("portal-sucked");
            }, 300);

            // Отправляем форму на сервер строго через 1.5 секунды, когда карточка полностью сожмется в портале
            setTimeout(() => {
                form.submit();
            }, 1500);
        });
    }
});

/**
 * Функция для плавного ухода в портал со страниц заглушек по кнопке Назад
 */
window.triggerPortalRedirect = function(url) {
    const portal = document.getElementById("portal-element");
    const box = document.getElementById("age-box");
    
    if (portal && box) {
        portal.classList.add("active");
        setTimeout(() => {
            box.classList.add("portal-sucked");
        }, 300);
        setTimeout(() => {
            window.location.href = url;
        }, 1500);
    } else {
        window.location.href = url;
    }
}

window.setTheme = function(themeName) {
    document.body.classList.remove('theme-cyan', 'theme-emerald', 'theme-amethyst');
    document.body.classList.add(themeName);
    localStorage.setItem('arseniy-app-theme', themeName);
}

window.toggleNextTheme = function() {
    const themes = ['theme-cyan', 'theme-emerald', 'theme-amethyst'];
    let currentTheme = localStorage.getItem('arseniy-app-theme') || 'theme-cyan';
    let nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    window.setTheme(themes[nextIndex]);
}
