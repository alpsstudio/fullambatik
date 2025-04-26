// welcome.js

document.addEventListener("DOMContentLoaded", () => {
    // Fade-in Hero Section
    const heroSection = document.querySelector('section');
    heroSection.classList.add('animate-fadein');

    // Typing Animation
    const typingText = document.getElementById('typing-text');
    const phrases = [
        "🎨 Bebas Berkreasi",
        "✨ AI Generator",
        "🌀 Simetri Otomatis",
        "📲 Mobile Friendly"
    ];
    let currentPhraseIndex = 0;
    let currentLetterIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[currentPhraseIndex];
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, currentLetterIndex--);
        } else {
            typingText.textContent = currentPhrase.substring(0, currentLetterIndex++);
        }

        if (!isDeleting && currentLetterIndex === currentPhrase.length) {
            setTimeout(() => isDeleting = true, 1000);
        } else if (isDeleting && currentLetterIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        }

        setTimeout(type, isDeleting ? 50 : 100);
    }

    type();

    // Button glow on hover
    const startButton = document.querySelector('a[href$="/canvas"]');
    startButton.addEventListener('mouseover', () => {
        startButton.style.boxShadow = "0 0 15px #8b5cf6, 0 0 25px #8b5cf6";
    });
    startButton.addEventListener('mouseout', () => {
        startButton.style.boxShadow = "none";
    });

    // Particles Background
    createParticles();

    // Scroll Reveal Animation
    window.addEventListener('scroll', revealElements);

    function revealElements() {
        const reveals = document.querySelectorAll('.reveal');
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
});

// Simple Particles
function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = "particles-bg";
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particlesArray;

    function init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particlesArray = [];
        const numberOfParticles = 100;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            const p = particlesArray[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);

    init();
    animate();
}
