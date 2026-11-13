document.addEventListener("DOMContentLoaded", function () {
    injectRampageStyles();
    init3DTiltCards();
    initTabSystem();
    initCommentSystem();
    initInteractiveMatrix();
    loadSavedTheme();
});

function init3DTiltCards() {
    var targets = document.querySelectorAll("#boss-photo, #secret-photo");
    targets.forEach(function (img) {
        if (!img.parentElement || img.parentElement.classList.contains("tilt-photo-wrapper")) return;

        var wrapper = document.createElement("div");
        wrapper.className = "tilt-photo-wrapper";
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        var glare = document.createElement("div");
        glare.className = "tilt-glare";
        wrapper.appendChild(glare);

        wrapper.addEventListener("mousemove", function (e) {
            var rect = wrapper.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            var centerX = rect.width / 2;
            var centerY = rect.height / 2;

            var rotateX = ((y - centerY) / centerY) * -11;
            var rotateY = ((x - centerX) / centerX) * 11;

            var glareX = (x / rect.width) * 100;
            var glareY = (y / rect.height) * 100;

            wrapper.style.transition = "transform 0.08s ease-out";
            wrapper.style.transform = "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.03)";
            glare.style.setProperty("--glare-x", glareX + "%");
            glare.style.setProperty("--glare-y", glareY + "%");
        });

        wrapper.addEventListener("mouseleave", function () {
            wrapper.style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
            wrapper.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });
}

function injectRampageStyles() {
    if (document.getElementById("dota-rampage-styles")) return;
    var style = document.createElement("style");
    style.id = "dota-rampage-styles";
    style.textContent = [
        ".dota-rampage-banner {",
        "    position: fixed;",
        "    top: 50%;",
        "    left: 50%;",
        "    width: min(88vw, 950px);",
        "    height: auto;",
        "    pointer-events: none;",
        "    z-index: 10000;",
        "    filter: drop-shadow(0 0 25px rgba(239, 68, 68, 0.95)) drop-shadow(0 0 60px rgba(185, 28, 28, 0.8));",
        "    animation: dotaRampageDiagonal 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;",
        "}",
        ".dota-blood-flash {",
        "    position: fixed;",
        "    inset: 0;",
        "    pointer-events: none;",
        "    z-index: 9999;",
        "    background: radial-gradient(circle, transparent 40%, rgba(220, 38, 38, 0.35) 100%);",
        "    animation: dotaBloodPulse 1.2s ease-out forwards;",
        "}",
        "@keyframes dotaRampageDiagonal {",
        "    0% { opacity: 0; transform: translate(-130%, 35%) rotate(-14deg) scale(2.4); }",
        "    12% { opacity: 1; transform: translate(-50%, -50%) rotate(-14deg) scale(1.06); }",
        "    18% { transform: translate(-50%, -50%) rotate(-14deg) scale(0.98); }",
        "    24% { transform: translate(-50%, -50%) rotate(-14deg) scale(1.02); }",
        "    75% { opacity: 1; transform: translate(-50%, -50%) rotate(-14deg) scale(1.05); }",
        "    100% { opacity: 0; transform: translate(35%, -135%) rotate(-14deg) scale(1.3); }",
        "}",
        "@keyframes dotaBloodPulse {",
        "    0% { opacity: 0; }",
        "    15% { opacity: 1; }",
        "    100% { opacity: 0; }",
        "}"
    ].join("\n");
    document.head.appendChild(style);
}

function triggerDotaRampage() {
    var old = document.querySelectorAll(".dota-rampage-banner, .dota-blood-flash");
    old.forEach(function (el) { el.remove(); });

    var flash = document.createElement("div");
    flash.className = "dota-blood-flash";
    document.body.appendChild(flash);

    var banner = document.createElement("img");
    banner.src = "/static/img/rampage.png";
    banner.className = "dota-rampage-banner";
    document.body.appendChild(banner);

    setTimeout(function () {
        banner.remove();
        flash.remove();
    }, 2450);
}

function playBossSound() {
    var audio = new Audio("/static/audio/rampage.mp3");
    audio.volume = 0.85;
    audio.play().catch(function (err) {
        console.warn("Ошибка воспроизведения:", err);
    });
}

function initTabSystem() {
    var menuButtons = document.querySelectorAll(".menu-btn[data-tab]");
    var tabContents = document.querySelectorAll(".tab-content");

    menuButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var targetId = button.getAttribute("data-tab");
            var targetTab = document.getElementById(targetId);
            if (!targetTab) return;

            menuButtons.forEach(function (btn) { btn.classList.remove("active"); });
            tabContents.forEach(function (tab) { tab.classList.remove("active"); });

            button.classList.add("active");
            targetTab.classList.add("active");
        });
    });
}

function initCommentSystem() {
    var form = document.getElementById("ajax-comment-form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        var authorInput = document.getElementById("comment-author");
        var textInput = document.getElementById("comment-text");
        var archive = document.getElementById("comments-archive");

        try {
            var response = await fetch("/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ author: authorInput.value, text: textInput.value })
            });
            var result = await response.json();
            if (result.success) {
                textInput.value = "";
                var empty = archive.querySelector(".empty-state");
                if (empty) empty.remove();

                var card = document.createElement("div");
                card.className = "db-comment-card";
                card.innerHTML =
                    '<div class="db-comment-header">' +
                        '<span class="db-comment-author">⚡ ' + result.comment.author + '</span>' +
                        '<span class="db-comment-time">' + result.comment.time + '</span>' +
                    '</div>' +
                    '<p class="db-comment-text">"' + result.comment.text + '"</p>';
                archive.prepend(card);
            }
        } catch (err) {
            console.error(err);
        }
    });
}

function initInteractiveMatrix() {
    var photoZone = document.querySelector(".profile-photo-zone");
    var photo = document.getElementById("boss-photo");

    if (photoZone && photo) {
        photoZone.addEventListener("click", function (e) {
            if (e.target.closest(".phone-link")) return;
            triggerDotaRampage();
            playBossSound();
        });
    }

    var rollBtn = document.getElementById("roll-meme-btn");
    var ticker = document.getElementById("meme-ticker-text");
    if (rollBtn && ticker) {
        rollBtn.addEventListener("click", async function () {
            try {
                var res = await fetch("/api/random-fact");
                var data = await res.json();
                ticker.innerText = data.fact;
            } catch (err) {
                console.error(err);
            }
        });
    }
}

window.setTheme = function (themeName) {
    document.body.classList.remove("theme-cyan", "theme-emerald", "theme-amethyst");
    document.body.classList.add(themeName);
    localStorage.setItem("arseniy-app-theme", themeName);

    var cards = document.querySelectorAll(".theme-option-card");
    cards.forEach(function (card) {
        card.classList.toggle("is-selected", card.getAttribute("data-theme") === themeName);
    });
};

window.toggleNextTheme = function () {
    var themes = ["theme-cyan", "theme-emerald", "theme-amethyst"];
    var currentTheme = localStorage.getItem("arseniy-app-theme") || "theme-cyan";
    var nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    window.setTheme(themes[nextIndex]);
};

function loadSavedTheme() {
    var savedTheme = localStorage.getItem("arseniy-app-theme") || "theme-cyan";
    window.setTheme(savedTheme);
}
