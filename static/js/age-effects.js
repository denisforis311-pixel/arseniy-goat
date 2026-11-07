document.addEventListener("DOMContentLoaded", () => {
    // 1. Инициализация сохраненной темы
    const savedTheme = localStorage.getItem('arseniy-app-theme') || 'theme-cyan';
    document.body.classList.add(savedTheme);

    const input = document.getElementById("age-input");
    const box = document.getElementById("age-box");
    const title = document.getElementById("age-title");
    const form = document.getElementById("portal-form");
    const portal = document.getElementById("portal-element");

    // ========================================================================
    // КИНЕМАТОГРАФИЧНОЕ ВЫПЛЕВЫВАНИЕ ОКНА ИЗ ПОРТАЛА ПРИ ЗАГРУЗКЕ
    // ========================================================================
    if (portal && box) {
        // Сразу открываем портал на полную катушку
        portal.classList.add("active");
        
        // Через 200мс выплевываем карточку вперед
        setTimeout(() => {
            box.classList.add("portal-spawned");
        }, 200);

        // Через 1.5 секунды, когда карточка встала на место, плавно тушим портал
        setTimeout(() => {
            portal.classList.add("fade-out");
        }, 1500);

        // Полностью удаляем технические классы активности портала, чтобы не мешали
        setTimeout(() => {
            portal.classList.remove("active", "fade-out");
        }, 2700);
    }

    // Обработка интерактивного изменения рамок на ходу
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
    // ЭФФЕКТ ЗАСАСЫВАНИЯ В ПОРТАЛ ПРИ ОТПРАВКЕ ВОЗРАСТА
    // ========================================================================
    if (form && portal && box) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Стопим резкий переход браузера

            // Убираем класс спавна, включаем чистый портал за карточкой
            box.classList.remove("portal-spawned");
            portal.classList.remove("fade-out");
            portal.classList.add("active");

            // Карточка начинает закручиваться и засасываться вглубь экрана
            setTimeout(() => {
                box.classList.add("portal-sucked");
            }, 100);

            // Отправляем данные на сервер ровно через 2.2 секунды киноэффекта
            setTimeout(() => {
                form.submit();
            }, 2200);
        });
    }
});

/**
 * Функция ухода в портал для кнопок "Назад" на страницах банов/секреток
 */
window.triggerPortalRedirect = function(url) {
    const portal = document.getElementById("portal-element");
    const box = document.getElementById("age-box");
    
    if (portal && box) {
        box.classList.remove("portal-spawned");
        portal.classList.remove("fade-out");
        portal.classList.add("active");
        
        setTimeout(() => {
            box.classList.add("portal-sucked");
        }, 100);
        
        setTimeout(() => {
            window.location.href = url;
        }, 2200);
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
