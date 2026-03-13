// Dynamic Fire Particle System using HTML Canvas
const canvas = document.getElementById('fire-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
        // distribute them randomly vertically initially so they aren't all at the bottom
        this.y = Math.random() * h; 
    }

    reset() {
        this.x = Math.random() * w;
        this.y = h + Math.random() * 20; // Start below the screen
        this.size = Math.random() * 3 + 1; // Random size
        this.speedX = Math.random() * 2 - 1; // Drift left/right
        this.speedY = Math.random() * -3 - 1; // Move up
        
        // Fiery colors (Orange, Red, Yellow)
        const colors = [
            'rgba(255, 69, 0, 0.7)', // OrangeRed
            'rgba(255, 140, 0, 0.8)', // DarkOrange
            'rgba(255, 215, 0, 0.6)', // Gold
            'rgba(178, 34, 34, 0.5)'  // FireBrick
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = Math.random() * 0.5 + 0.5; // lifespan
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.005; // Fade out over time

        // Reset particle if it fades out or goes off top
        if (this.life <= 0 || this.y < -10) {
            this.reset();
            this.y = h; // Reset to bottom specifically when recycled
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Apply glow effect based on life
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        // Convert rgba to include dynamic alpha based on life
        let rgb = this.color.substring(0, this.color.lastIndexOf(','));
        ctx.fillStyle = `${rgb}, ${this.life})`;
        
        ctx.fill();
        
        // Reset shadow for next draws
        ctx.shadowBlur = 0;
    }
}

// Initialize particles
const particleCount = 150; // Adjust for density
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    // Semi-transparent black to create trailing effect but mostly clean up
    ctx.fillStyle = 'rgba(10, 4, 2, 0.2)'; 
    ctx.fillRect(0, 0, w, h);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// Start animation
animate();

// --- Add fade-in animations on scroll ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial styles for animation and observe all major sections
document.querySelectorAll('.symposium-title-section, .events-section, .personnel-card, .contact-footer').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
});

// --- Countdown Timer to 25 March 2026 ---
const eventDate = new Date('2026-03-25T09:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = eventDate - now;

    if (diff <= 0) {
        document.getElementById('cd-days').textContent  = '00';
        document.getElementById('cd-hours').textContent = '00';
        document.getElementById('cd-mins').textContent  = '00';
        document.getElementById('cd-secs').textContent  = '00';
        return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);
