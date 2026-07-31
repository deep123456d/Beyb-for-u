// --- 1. START OVERLAY & MUSIC INITIALIZATION ---
const overlay = document.getElementById('start-overlay');
const mainContent = document.getElementById('mainContent');
const audio = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const audioProgress = document.getElementById('audioProgress');

overlay.addEventListener('click', () => {
  // Fade out overlay
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.visibility = 'hidden';
    mainContent.classList.remove('hidden');
    triggerInitialAnimations();
  }, 800);

  // Play Audio
  audio.play().then(() => {
    playIcon.textContent = '❚❚';
  }).catch(e => console.log("Autoplay blocked:", e));
});

function toggleAudio() {
  if (audio.paused) {
    audio.play();
    playIcon.textContent = '❚❚';
  } else {
    audio.pause();
    playIcon.textContent = '▶';
  }
}

// Track audio progress bar
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    audioProgress.style.width = pct + '%';
  }
});

// --- 2. CARD FLIPPING LOGIC ---
function flipCard(cardElement) {
  cardElement.classList.toggle('flipped');
}

// --- 3. SCRATCH CARD ENGINE ---
let totalScratched = 0;
const totalCards = 6;
const uncoveredCountElem = document.getElementById('uncoveredCount');

document.querySelectorAll('.scratch-card').forEach((card) => {
  const canvas = card.querySelector('.scratch-canvas');
  const ctx = canvas.getContext('2d');
  let isScratching = false;
  let isRevealed = false;

  // Resize canvas resolution
  const rect = card.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Draw Cover Pattern
  ctx.fillStyle = '#dbbcf5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cover Text
  ctx.fillStyle = '#7344ad';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('scratch here ✨', canvas.width / 2, canvas.height / 2 + 4);

  function getCoordinates(e) {
    const cRect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - cRect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - cRect.top;
    return { x, y };
  }

  function scratch(e) {
    if (!isScratching || isRevealed) return;
    e.preventDefault();

    const { x, y } = getCoordinates(e);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    checkProgress();
  }

  function checkProgress() {
    if (isRevealed) return;

    // Check transparent pixels ratio
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentCount++;
    }

    const percent = (transparentCount / (pixels.length / 4)) * 100;

    if (percent > 45) {
      isRevealed = true;
      canvas.style.transition = 'opacity 0.5s ease';
      canvas.style.opacity = '0';
      setTimeout(() => canvas.remove(), 500);

      totalScratched++;
      uncoveredCountElem.textContent = totalScratched;

      // Confetti burst when all are scratched
      if (totalScratched === totalCards) {
        triggerConfetti();
      }
    }
  }

  // Event Listeners
  canvas.addEventListener('mousedown', () => isScratching = true);
  canvas.addEventListener('mouseup', () => isScratching = false);
  canvas.addEventListener('mousemove', scratch);

  canvas.addEventListener('touchstart', () => isScratching = true);
  canvas.addEventListener('touchend', () => isScratching = false);
  canvas.addEventListener('touchmove', scratch);
});

// --- 4. FLOATING HEARTS GENERATOR ---
function createFloatingHearts() {
  const heartContainer = document.getElementById('heart-container');
  const heartIcons = ['💖', '🌸', '✨', '💕', '🌷'];

  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (6 + Math.random() * 6) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heart.style.fontSize = (12 + Math.random() * 12) + 'px';
    heartContainer.appendChild(heart);
  }
}

createFloatingHearts();

// --- 5. SCROLL FADE-IN ANIMATIONS ---
function triggerInitialAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// --- 6. CELEBRATION CONFETTI ---
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#b48ded', '#f4dbf9', '#ffffff', '#9059e0']
  });
}
