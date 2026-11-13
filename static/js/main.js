document.addEventListener("DOMContentLoaded", () => {
    initTabSystem();
    initCommentSystem();
    initInteractiveMatrix();
    loadSavedTheme();
    injectRampageStyles();
});

function injectRampageStyles() {
    if (document.getElementById("dota-rampage-styles")) return;
    const style = document.createElement("style");
    style.id = "dota-rampage-styles";
    style.textContent = `
        .dota-rampage-banner {
            position: fixed;
            top: 50%;
            left: 50%;
            width: min(88vw, 950px);
            height: auto;
            pointer-events: none;
            z-index: 10000;
            filter: drop-shadow(0 0 25px rgba(239, 68, 68, 0.95)) drop-shadow(0 0 60px rgba(185, 28, 28, 0.8));
            animation: dotaRampageDiagonal 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .dota-blood-flash {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 9999;
            background: radial-gradient(circle, transparent 40%, rgba(220, 38, 38, 0.35) 100%);
            animation: dotaBloodPulse 1.2s ease-out forwards;
        }

        @keyframes dotaRampageDiagonal {
            0% {
                opacity: 0;
                transform: translate(-130%, 35%) rotate(-14deg) scale(2.4);
            }
            12% {
                opacity: 1;
                transform: translate(-50%, -50%) rotate(-14deg) scale(1.06);
            }
            18% {
                transform: translate(-50%, -50%) rotate(-14deg) scale(0.98);
            }
            24% {
                transform: translate(-50%, -50%) rotate(-14deg) scale(1.02);
            }
            75% {
                opacity: 1;
                transform: translate(-50%, -50%) rotate(-14deg) scale(1.05);
            }
            100% {
                opacity: 0;
                transform: translate(35%, -135%) rotate(-14deg) scale(1.3);
            }
        }

        @keyframes dotaBloodPulse {
            0% { opacity: 0; }
            15% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

function triggerDotaRampage() {
    document.querySelectorAll(".dota-rampage-banner, .dota-blood-flash").forEach(el => el.remove());

    const flash = document.createElement("div");
    flash.className = "dota-blood-flash";
    document.body.appendChild(flash);

    const banner = document.createElement("img");
    banner.src = "/static/img/rampage.png";
    banner.className = "dota-rampage-banner";
    document.body.appendChild(banner);

    setTimeout(() => {
        banner.remove();
        flash.remove();
    }, 2450);
}

function playBossSound() {
    const audio = new Audio("/static/audio/rampage.mp3");
    audio.volume = 0.85;
    audio.play().catch(err => console.warn("Ошибка воспроизведения:", err));
}

function initTabSystem() {
    const menuButtons = document.querySelectorAll(".menu-btn[data-tab]");
    const tabContents = document.querySelectorAll(".tab-content");
    menuButtons.forEach(button => {
        button.addEventListener("click", () => {
            menuButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(tab => tab.classList.remove("active"));
            button.classList.add("active");
            document.getElementById(button.getAttribute("data-tab")).classList.add("active");
        });
    });
}

function initCommentSystem() {
    const form = document.getElementById("ajax-comment-form");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const authorInput = document.getElementById("comment-author");
        const textInput = document.getElementById("comment-text");
        const archive = document.getElementById("comments-archive");

        try {
            const response = await fetch("/api/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ author: authorInput.value, text: textInput.value })
            });
            const result = await response.json();
            if (result.success) {
                textInput.value = "";
                const empty = archive.querySelector(".empty-state");
                if (empty) empty.remove();
                archive.insertAdjacentHTML("afterbegin", `
                    <div class="db-comment-card">
                        <div class="db-comment-header">
                            <span class="db-comment-author">⚡ ${result.comment.author}</span>
                            <span class="db-comment-time">${result.comment.time}</span>
                        </div>
                        <p class="db-comment-text">"${result.comment.text}"</p>
                    </div>
                `);
            }
        } catch (err) { console.error(err); }
    });
}

function initInteractiveMatrix() {
    const photo = document.getElementById("boss-photo");
    if (photo) {
        photo.addEventListener("click", () => {
            triggerDotaRampage();
            playBossSound();
        });
    }

    const rollBtn = document.getElementById("roll-meme-btn");
    const ticker = document.getElementById("meme-ticker-text");
    if (rollBtn && ticker) {
        rollBtn.addEventListener("click", async () => {
            const res = await fetch("/api/random-fact");
            const data = await res.json();
            ticker.innerText = data.fact;
        });
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

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('arseniy-app-theme');
    if (savedTheme) {
        window.setTheme(savedTheme);
    }
}
