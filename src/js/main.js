import "../scss/main.scss";

// Mobile
const nav = document.querySelector(".primary-nav");
const toggle = document.querySelector(".nav-toggle");

toggle?.addEventListener("click", () => {
  const open = nav?.getAttribute("data-open") === "true";
  nav?.setAttribute("data-open", String(!open));
  toggle.setAttribute("aria-expanded", String(!open));
});


const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));


// Confetti
const confettiBtn = document.getElementById('confetti-btn');
if (confettiBtn) {
  confettiBtn.addEventListener('click', (e) => {
 
    const x = e.clientX;
    const y = e.clientY;

  
    const colors = ['#5ddcff', '#b45eff', '#ffd166', '#06d6a0', '#ef476f'];

  
    const pieces = 28;
    for (let i = 0; i < pieces; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = x + 'px';
      piece.style.top = y + 'px';

  
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 60; 
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius * (0.8 + Math.random() * 0.6); 
      const rot = (Math.random() * 1.2 + 0.6).toFixed(2) + 'turn';

      piece.style.setProperty('--tx', tx + 'px');
      piece.style.setProperty('--ty', ty + 'px');
      piece.style.setProperty('--rot', rot);

      piece.style.setProperty('--start-x', '-50%');
      piece.style.setProperty('--start-y', '-50%');

      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = (6 + Math.random() * 6) + 'px';
      piece.style.height = (8 + Math.random() * 10) + 'px';

      document.body.appendChild(piece);

      piece.addEventListener('animationend', () => piece.remove());
    }
  });
}
