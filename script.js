document.addEventListener('DOMContentLoaded', () => {

    let musicPlaying = false;
    let catTapCount = 0;
    let currentMemeIndex = 0;

    const bgMusic = document.getElementById('bgMusic');
    const meowSound = document.getElementById('meowSound');
    const musicBtn = document.getElementById('musicBtn');
    
    const loadingScreen = document.getElementById('loadingScreen');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const notebookScreen = document.getElementById('notebookScreen');
    const endingScreen = document.getElementById('endingScreen');

    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    // 0. Loading Screen Engine
    const loadingMsgs = [
        "💜 Loading clingy mode...",
        "🐱 Waking up Happy Cat...",
        "🌸 Collecting forehead kisses...",
        "✨ Hiding surprises...",
        "👀 Making everything perfect...",
        "🤏 Trying not to blush...",
        "❤️ Almost ready..."
    ];
    let msgIdx = 0;
    const loadingMsgEl = document.getElementById('loadingMsg');
    
    const loadingInterval = setInterval(() => {
        msgIdx = (msgIdx + 1) % loadingMsgs.length;
        loadingMsgEl.textContent = loadingMsgs[msgIdx];
    }, 700);

    setTimeout(() => {
        clearInterval(loadingInterval);
        loadingScreen.classList.remove('active');
        loadingScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.classList.add('active');
    }, 2800);

    // Audio Control
    musicBtn.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicBtn.textContent = '🎵';
        } else {
            bgMusic.play().catch(() => {});
            musicBtn.textContent = '🎶';
        }
        musicPlaying = !musicPlaying;
    });

    // Envelope Smooth Opening Sequence (Matching Video)
    const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
    openEnvelopeBtn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(40);
        
        envelopeOverlay.classList.remove('hidden');
        const envContainer = document.querySelector('.envelope-container');

        setTimeout(() => {
            envContainer.classList.add('open');
        }, 300);

        setTimeout(() => {
            envelopeOverlay.style.opacity = '0';
            setTimeout(() => {
                envelopeOverlay.classList.add('hidden');
                welcomeScreen.classList.remove('active');
                welcomeScreen.classList.add('hidden');
                notebookScreen.classList.remove('hidden');
                notebookScreen.classList.add('active');
            }, 600);
        }, 1800);
    });

    // Meme Slider
    const memeSlides = document.querySelectorAll('.meme-slide');
    document.getElementById('nextMeme').addEventListener('click', () => {
        memeSlides[currentMemeIndex].classList.remove('active-slide');
        currentMemeIndex = (currentMemeIndex + 1) % memeSlides.length;
        memeSlides[currentMemeIndex].classList.add('active-slide');
    });

    document.getElementById('prevMeme').addEventListener('click', () => {
        memeSlides[currentMemeIndex].classList.remove('active-slide');
        currentMemeIndex = (currentMemeIndex - 1 + memeSlides.length) % memeSlides.length;
        memeSlides[currentMemeIndex].classList.add('active-slide');
    });

    // Happy Cat
    const happyCat = document.getElementById('happyCat');
    const achievement = document.getElementById('achievement');
    happyCat.addEventListener('click', () => {
        catTapCount++;
        meowSound.currentTime = 0;
        meowSound.play().catch(() => {});
        if (catTapCount >= 5) {
            achievement.classList.remove('hidden');
            confetti({ particleCount: 50, spread: 50 });
        }
    });

    // Flip Cards
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('flipped'));
    });

    // Scratch Cards
    const scratchCanvases = document.querySelectorAll('.scratch-canvas');
    scratchCanvases.forEach(canvas => {
        const ctxScratch = canvas.getContext('2d');
        ctxScratch.fillStyle = '#D6C7E8';
        ctxScratch.fillRect(0, 0, canvas.width, canvas.height);

        let isScratching = false;
        const scratch = (e) => {
            if (!isScratching) return;
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            ctxScratch.globalCompositeOperation = 'destination-out';
            ctxScratch.beginPath();
            ctxScratch.arc(x, y, 12, 0, Math.PI * 2);
            ctxScratch.fill();
        };

        canvas.addEventListener('mousedown', () => isScratching = true);
        canvas.addEventListener('mouseup', () => isScratching = false);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('touchstart', () => isScratching = true);
        canvas.addEventListener('touchend', () => isScratching = false);
        canvas.addEventListener('touchmove', scratch);
    });

    // Hold Button Ending Trigger
    const holdBtn = document.getElementById('holdHeartBtn');
    let holdTimer;
    const startHold = () => { holdTimer = setTimeout(triggerEndingCinematic, 2200); };
    const endHold = () => clearTimeout(holdTimer);

    holdBtn.addEventListener('mousedown', startHold);
    holdBtn.addEventListener('touchstart', startHold);
    holdBtn.addEventListener('mouseup', endHold);
    holdBtn.addEventListener('touchend', endHold);

    function triggerEndingCinematic() {
        notebookScreen.classList.remove('active');
        notebookScreen.classList.add('hidden');
        endingScreen.classList.remove('hidden');
        endingScreen.classList.add('active');

        const endingText = document.getElementById('endingText');
        const endingHeart = document.getElementById('endingHeart');
        const finalCloseNote = document.getElementById('finalCloseNote');

        const lines = [
            "One last thing...",
            "If I had to fall in love all over again...",
            "I'd still choose you.",
            "Again.",
            "And again."
        ];
        let lineIdx = 0;

        function showNextLine() {
            if (lineIdx < lines.length) {
                endingText.style.opacity = 0;
                setTimeout(() => {
                    endingText.textContent = lines[lineIdx];
                    endingText.style.opacity = 1;
                    lineIdx++;
                    setTimeout(showNextLine, 2000);
                }, 500);
            } else {
                setTimeout(() => {
                    endingText.style.display = 'none';
                    endingHeart.classList.remove('hidden');
                    setTimeout(() => finalCloseNote.classList.remove('hidden'), 1000);
                }, 800);
            }
        }
        showNextLine();
    }

    // Canvas Sparkle Particles
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function createParticle(x, y) {
        if (!x || !y) return;
        const shapes = ['🌸', '✨', '💜'];
        particles.push({
            x: x, y: y,
            size: Math.random() * 12 + 8,
            text: shapes[Math.floor(Math.random() * shapes.length)],
            alpha: 1,
            vy: -Math.random() * 2 - 1,
            vx: (Math.random() - 0.5) * 2
        });
    }

    window.addEventListener('touchstart', (e) => createParticle(e.touches[0].clientX, e.touches[0].clientY));

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
            ctx.globalAlpha = Math.max(p.alpha, 0);
            ctx.font = `${p.size}px serif`;
            ctx.fillText(p.text, p.x, p.y);
            if (p.alpha <= 0) particles.splice(index, 1);
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
});

