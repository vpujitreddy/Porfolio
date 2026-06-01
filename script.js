/* ================= LOADER ================= */

window.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    if (!loader) return;

    loader.addEventListener("click", () => {
        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";

        setTimeout(() => loader.remove(), 600);
    });
});


/* ================= CINEMATIC SCENE SYSTEM ================= */

let isTransitioning = false;

const sceneLayer = document.createElement("div");
sceneLayer.id = "scene-layer";
document.body.appendChild(sceneLayer);

function switchScene(target) {
    if (isTransitioning || !target) return;
    isTransitioning = true;

    sceneLayer.classList.add("active");

    document.querySelectorAll(".hero, .section").forEach(sec => {
        sec.style.transition = "0.4s ease";
        sec.style.opacity = "0";
        sec.style.transform = "translateY(15px)";
    });

    setTimeout(() => {
        target.scrollIntoView({ behavior: "auto", block: "start" });

        document.querySelectorAll(".hero, .section").forEach(sec => {
            sec.style.opacity = "1";
            sec.style.transform = "translateY(0px)";
        });

        sceneLayer.classList.remove("active");

        setTimeout(() => {
            isTransitioning = false;
        }, 300);

    }, 450);
}


/* NAVIGATION */

document.querySelectorAll(".nav nav a").forEach(link => {
    link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || !id.startsWith("#")) return;

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        switchScene(target);
    });
});


/* ================= TYPEWRITER ================= */

const typingText = `I am Pujit Reddy Velagala, a BSc Animation student focused on visual storytelling and digital media. I work across graphic design, video editing, animation, and visual effects, creating visuals that communicate ideas in a clear and engaging way. I enjoy exploring different styles and approaches in animation and design, developing ideas from initial concept to final execution. I am interested in using visuals to tell stories and create meaningful impact through simple and effective design. I am continuously refining my creative process and growing in the field of animation and visual media.`;

let typingIndex = 0;
let typingTimeout;

const typingEl = document.getElementById("typing-text");
const cursorEl = document.getElementById("cursor");
const aboutSection = document.getElementById("about");

function resetTyping() {
    clearTimeout(typingTimeout);
    typingIndex = 0;

    if (typingEl) typingEl.textContent = "";

    if (cursorEl) {
        cursorEl.classList.add("hidden");
        cursorEl.classList.remove("blink");
    }
}

function startTyping() {
    if (!typingEl || !cursorEl) return;

    resetTyping();

    cursorEl.classList.remove("hidden");
    cursorEl.classList.add("blink");

    const type = () => {
        if (typingIndex >= typingText.length) {
            cursorEl.classList.remove("blink");
            setTimeout(() => cursorEl.classList.add("hidden"), 600);
            return;
        }

        typingEl.textContent += typingText.charAt(typingIndex++);
        typingTimeout = setTimeout(type, 8);
    };

    type();
}

if (aboutSection) {
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) startTyping();
            else resetTyping();
        });
    }, { threshold: 0.5 }).observe(aboutSection);
}


/* ================= HERO ================= */

const roles = ["Graphic Designer", "Video Editor", "Animator", "VFX Artist"];

const roleEl = document.getElementById("role-text");
const homeSection = document.getElementById("home");

let heroTimeout;
let heroRunning = false;
let heroIndex = 0;

function stopHero() {
    heroRunning = false;
    clearTimeout(heroTimeout);
    heroIndex = 0;

    if (roleEl) {
        roleEl.textContent = "";
        roleEl.style.opacity = "0";
    }
}

function typeRole(role, done) {
    if (!roleEl || !heroRunning) return;

    let i = 0;
    roleEl.textContent = "";
    roleEl.style.opacity = "1";

    const type = () => {
        if (!heroRunning) return;

        if (i < role.length) {
            roleEl.textContent += role[i++];
            heroTimeout = setTimeout(type, 45);
        } else {
            done?.();
        }
    };

    type();
}

function loopHero() {
    if (!heroRunning || !roleEl) return;

    typeRole(roles[heroIndex], () => {
        heroTimeout = setTimeout(() => {
            roleEl.style.opacity = "0";

            setTimeout(() => {
                heroIndex = (heroIndex + 1) % roles.length;
                loopHero();
            }, 300);
        }, 600);
    });
}

function startHero() {
    stopHero();
    heroRunning = true;
    loopHero();
}

if (homeSection) {
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) startHero();
            else stopHero();
        });
    }, { threshold: 0.5 }).observe(homeSection);
}


/* ================= SKILLS ================= */

const skillsSection = document.getElementById("skills");

let skillTimeouts = [];
let rafIds = [];
let skillsInitialized = false;

function getSkillLevel(value) {
    if (value >= 90) return "Expert";
    if (value >= 75) return "Advanced";
    if (value >= 50) return "Intermediate";
    if (value >= 25) return "Beginner";
    return "Starter";
}

function clearSkills() {
    skillTimeouts.forEach(clearTimeout);
    rafIds.forEach(cancelAnimationFrame);

    skillTimeouts = [];
    rafIds = [];

    document.querySelectorAll(".fill").forEach(fill => fill.style.width = "0%");
    document.querySelectorAll(".fill-text").forEach(t => t.textContent = "0%");
    document.querySelectorAll(".circle").forEach(circle => {
        circle.style.background = "conic-gradient(var(--accent) 0%, #141A2A 0%)";
        const span = circle.querySelector("span");
        if (span) span.textContent = "0%";
    });
}

function animateFill(fill) {
    const target = parseInt(fill.dataset.target || "0", 10);
    const text = fill.querySelector(".fill-text");

    let start = null;

    function step(time) {
        if (!start) start = time;

        const progress = Math.min((time - start) / 1200, 1);
        const value = Math.floor(progress * target);

        fill.style.width = value + "%";
        if (text) text.textContent = value + "%";

        if (progress < 1) rafIds.push(requestAnimationFrame(step));
    }

    rafIds.push(requestAnimationFrame(step));
}

function animateCircle(circle, target, span) {
    let start = null;

    function step(time) {
        if (!start) start = time;

        const progress = Math.min((time - start) / 1200, 1);
        const value = Math.floor(progress * target);

        circle.style.background =
            `conic-gradient(var(--accent) ${value}%, #141A2A 0%)`;

        if (span) span.textContent = value + "%";

        if (progress < 1) rafIds.push(requestAnimationFrame(step));
    }

    rafIds.push(requestAnimationFrame(step));
}

function runSkills() {
    if (skillsInitialized) clearSkills();
    skillsInitialized = true;

    document.querySelectorAll(".skill-card").forEach(card => {
        const top = card.querySelector(".skill-top");
        if (top && !top.querySelector(".skill-level")) {
            const level = document.createElement("span");
            level.className = "skill-level";
            level.textContent = "Starter";
            top.appendChild(level);
        }
    });

    const fills = document.querySelectorAll(".fill");
    const circles = document.querySelectorAll(".circle");

    fills.forEach((fill, i) => {
        const t = setTimeout(() => animateFill(fill), i * 120);
        skillTimeouts.push(t);
    });

    circles.forEach(circle => {
        const target = parseInt(circle.dataset.target || "0", 10);
        const span = circle.querySelector("span");
        animateCircle(circle, target, span);
    });

    document.querySelectorAll(".skill-level").forEach((level, i) => {
        const fill = fills[i];
        if (!fill) return;

        const target = parseInt(fill.dataset.target || "0", 10);
        const startTime = performance.now();

        function animate(time) {
            const progress = Math.min((time - startTime) / 1200, 1);
            const value = Math.floor(progress * target);
            level.textContent = getSkillLevel(value);

            if (progress < 1) requestAnimationFrame(animate);
        }

        setTimeout(() => requestAnimationFrame(animate), i * 120);
    });
}

if (skillsSection) {
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) runSkills();
            else clearSkills();
        });
    }, { threshold: 0.25 }).observe(skillsSection);
}


/* ================= WORK ================= */

const workSection = document.getElementById("work");
const workScroll = document.querySelector(".work-scroll");

let cards = [];
let currentIndex = 0;
let autoInterval;
let resumeTimeout;
let isUserActive = false;

const AUTO_TIME = 1000;

function initWork() {
    cards = Array.from(document.querySelectorAll(".work-card"));
    currentIndex = 0;
    if (cards.length) scrollToCard(0);
}

function scrollToCard(index) {
    const card = cards[index];
    if (!card || !workScroll) return;

    workScroll.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
}

function syncIndex() {
    if (!workScroll || !cards.length) return;

    let closest = 0;
    let min = Infinity;

    cards.forEach((card, i) => {
        const diff = Math.abs(card.offsetLeft - workScroll.scrollLeft);
        if (diff < min) {
            min = diff;
            closest = i;
        }
    });

    currentIndex = closest;
}

function stopAuto() {
    clearInterval(autoInterval);
    autoInterval = null;
}

function startAuto() {
    stopAuto();

    autoInterval = setInterval(() => {
        if (isUserActive || !cards.length) return;

        currentIndex = (currentIndex + 1) % cards.length;
        scrollToCard(currentIndex);
    }, AUTO_TIME);
}

function setActive() {
    isUserActive = true;
    stopAuto();
    clearTimeout(resumeTimeout);
}

function resume() {
    clearTimeout(resumeTimeout);

    resumeTimeout = setTimeout(() => {
        isUserActive = false;
        syncIndex();
        startAuto();
    }, AUTO_TIME);
}

function attachWorkEvents() {
    if (!workScroll || !cards.length) return;

    workScroll.addEventListener("scroll", () => {
        setActive();
        resume();
    }, { passive: true });

    cards.forEach((card, i) => {
        card.addEventListener("mouseenter", setActive);
        card.addEventListener("mouseleave", resume);

        card.addEventListener("click", () => {
            setActive();
            currentIndex = i;
            scrollToCard(i);
            resume();
        });
    });
}

if (workSection) {
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initWork();
                attachWorkEvents();
                isUserActive = false;
                startAuto();
            } else {
                stopAuto();
                isUserActive = true;
            }
        });
    }, { threshold: 0.4 }).observe(workSection);
}


/* ================= PARTICLES ================= */

const canvas = document.getElementById("particles");

if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const COUNT = 80;

    function resize() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = `rgba(214,168,90,${this.opacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function create() {
        particles = Array.from({ length: COUNT }, () => new Particle());
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.strokeStyle = `rgba(214,168,90,${0.12 * (1 - dist / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connect();
        requestAnimationFrame(animate);
    }

    create();
    animate();
}