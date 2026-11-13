```javascript
document.addEventListener("DOMContentLoaded", () => {
    injectRampageStyles();
    init3DTiltCards();
    initTabSystem();
    initCommentSystem();
    initInteractiveMatrix();
    loadSavedTheme();
});

function init3DTiltCards() {
    const targets = document.querySelectorAll("#boss-photo, #secret-photo");
    targets.forEach(img => {
        if (img.parentElement.classList.contains("tilt-photo-wrapper")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "tilt-photo-wrapper";
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        const glare = document.createElement("div");
        glare.className = "tilt-glare";
        wrapper.appendChild(glare);

        wrapper.addEventListener("mousemove", (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -9;
            const rotateY = ((x - centerX) / centerX) * 9;

            wrapper.style.transition = "transform 0.08s ease-out";
            wrapper.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            glare.style.setProperty("--glare-x", `${(x / rect.width) * 100}%`);
            glare.style.setProperty("--glare-y", `${(y / rect.height) * 100}%`);
        });

        wrapper.addEventListener("mouseleave", () => {
            wrapper.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
            wrapper.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });
}

function injectRampageStyles() {
    if (document.getElementById("dota-rampage-styles")) return;
    const style = document.createElement("style");
    style.id = "dota-rampage-styles";
    style.textContent = `
        .dota-rampage-banner {
            position: fixed;
            top: 50%;
            left: 50%;
            width: min(82vw, 760px);
            height: auto;
            pointer-events: none;
            z-index: 10000;
            animation: dotaRampageDiagonal 2.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .dota-blood-flash {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 9999;
            background: radial-gradient(circle, transparent 45%, rgba(220, 38, 38, 0.28) 100%);
            animation: dotaBloodPulse 1.1s ease-out forwards;
        }

        @keyframes dotaRampageDiagonal {
            0% {
                opacity: 0;
                transform: translate(-120%, 30%) rotate(-14deg) scale(1.45);
            }
            12% {
                opacity: 1;
                transform: translate(-50%, -50%) rotate(-14deg) scale(1.04);
            }
            20% {
                transform: translate(-50%, -50%) rotate(-14deg) scale(0.98);
            }
            75% {
                opacity: 1;
                transform: translate(-50%, -50%) rotate(-14deg) scale(1.02);
            }
            100% {
                opacity: 0;
                transform: translate(30%, -125%) rotate(-14deg) scale(1.15);
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
    }, 2350);
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
    const photoWrapper = document.querySelector(".profile-photo-zone .tilt-photo-wrapper") || document.getElementById("boss-photo");

    if (photoWrapper) {
        photoWrapper.addEventListener("click", (e) => {
            e.stopPropagation();
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

    document.querySelectorAll(".theme-option-card").forEach(card => {
        card.classList.toggle("is-selected", card.dataset.theme === themeName);
    });
}

window.toggleNextTheme = function() {
    const themes = ['theme-cyan', 'theme-emerald', 'theme-amethyst'];
    let currentTheme = localStorage.getItem('arseniy-app-theme') || 'theme-cyan';
    let nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    window.setTheme(themes[nextIndex]);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('arseniy-app-theme') || 'theme-cyan';
    window.setTheme(savedTheme);
}
