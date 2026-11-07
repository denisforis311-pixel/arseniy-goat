document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('arseniy-app-theme') || 'theme-cyan';
    document.body.classList.add(savedTheme);

    const input = document.getElementById("age-input");
    const box = document.getElementById("age-box");
    const title = document.getElementById("age-title");
    const form = document.getElementById("portal-form");
    const portal = document.getElementById("portal-element");

    // ========================================================================
    // НАСТОЯЩЕЕ ВЫПЛЕВЫВАНИЕ ОКНА ПРИ ЗАГРУЗКЕ
    // ========================================================================
    if (portal && box) {
        // Зажигаем портал на месте
        portal.classList.add("active");
        
        // Окно вылетает из портала вперед независимо
        setTimeout(() => {
            box.classList.add("portal-spawned");
        }, 150);

        // Через 1.3 секунды плавно тушим портал, оставляя окно
        setTimeout(() => {
            portal.classList.add("fade-out");
        }, 1300);

        // Полная очистка классов
        setTimeout(() => {
            portal.classList.remove("active", "fade-out");
        }, 2500);
    }

    if (input && box && title) {
        input.addEventListener("input", () => {
            const val = parseInt(input.value);
            box.style.borderColor = "var(--glass-border)";
            box.style.filter = "none";
            title.innerText = "Подтвердите свой возраст";
            title.style.color = "var(--text-white)";

            if (isNaN(val)) return;
            if (val === 67) {
                box.style.borderColor = "#ef4444";
                title.innerText = "Ты уверено? 🤨";
                title.style.color = "#ef4444";
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

    // ========================================================================
    // ЭФФЕКТ ЧИСТОГО ЗАСАСЫВАНИЯ ОКНА ПРИ ОТПРАВКЕ
    // ========================================================================
    if (form && portal && box) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Включаем стабильный портал строго за карточкой
            portal.classList.remove("fade-out");
            portal.classList.add("active");

            // Окно закручивается и улетает вглубь портала
            setTimeout(() => {
                box.classList.remove("portal-spawned");
                box.classList.add("portal-sucked");
            }, 50);

            // Редирект/отправка строго после окончания анимации засасывания
            setTimeout(() => {
                form.submit();
            }, 1800);
        });
    }
});

window.triggerPortalRedirect = function(url) {
    const portal = document.getElementById("portal-element");
    const box = document.getElementById("age-box");
    
    if (portal && box) {
        portal.classList.remove("fade-out");
        portal.classList.add("active");
        
        setTimeout(() => {
            box.classList.remove("portal-spawned");
            box.classList.add("portal-sucked");
        }, 50);
        
        setTimeout(() => {
            window.location.href = url;
        }, 1800);
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
