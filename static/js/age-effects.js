document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('arseniy-app-theme') || 'theme-cyan';
    document.body.classList.add(savedTheme);

    const input = document.getElementById("age-input");
    const box = document.getElementById("age-box");
    const title = document.getElementById("age-title");
    const form = document.getElementById("portal-form");
    const portal = document.getElementById("portal-element");

    // ========================================================================
    // НАСТОЯЩИЙ НАПРАВЛЕННЫЙ ВЫЛЕТ (ВЫПЛЕВЫВАНИЕ) ИЗ ЦЕНТРА ПОРТАЛА
    // ========================================================================
    if (portal && box) {
        // Мгновенно разворачиваем кислотный вихрь Рика на заднем плане
        portal.classList.add("active");
        
        // Окно физически вылетает из глубины вихря прямо на пользователя
        setTimeout(() => {
            box.classList.add("portal-spawned");
        }, 150);

        // Когда окно полностью долетело и встало на место, закрываем портал
        setTimeout(() => {
            portal.classList.add("fade-out");
        }, 1400);

        // Полное зачищение технических классов
        setTimeout(() => {
            portal.classList.remove("active", "fade-out");
        }, 2600);
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
    // КИНЕМАТОГРАФИЧНОЕ ЗАСАСЫВАНИЕ КАРТОЧКИ В СИНГУЛЯРНОСТЬ ВЫ С ГЛАЗА ЮЗЕРА
    // ========================================================================
    if (form && portal && box) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Включаем стабильный портал строго за карточкой
            portal.classList.remove("fade-out");
            portal.classList.add("active");

            // Окно плавно закручивается по спирали и уменьшается в нулевую точку центра
            setTimeout(() => {
                box.classList.remove("portal-spawned");
                box.classList.add("portal-sucked");
            }, 50);

            // Отправка формы происходит только когда окно полностью скрылось внутри вихря
            setTimeout(() => {
                form.submit();
            }, 1600);
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
        }, 1600);
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
