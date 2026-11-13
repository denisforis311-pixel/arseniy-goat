document.addEventListener("DOMContentLoaded", () => {
    initTabSystem();
    initCommentSystem();
    initInteractiveMatrix();
    loadSavedTheme();
});

function playBossSound() {
    const audio = new Audio("/static/audio/rampage.mp3");
    audio.volume = 0.30;
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
            dropRampageRain();
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

function dropRampageRain() {
    for (let i = 0; i < 16; i++) {
        const el = document.createElement("img");
        el.src = "/static/img/rampage.png";
        el.className = "falling-goat";
        el.style.left = Math.random() * (window.innerWidth - 140) + "px";
        el.style.top = "-80px";
        el.style.width = Math.random() * (180 - 110) + 110 + "px";
        el.style.height = "auto";
        el.style.filter = "drop-shadow(0 0 12px rgba(239, 68, 68, 0.8))";

        const dur = Math.random() * 1.3 + 1.2;
        el.style.animation = `fall ${dur}s linear forwards`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), dur * 1000);
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
