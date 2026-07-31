document.addEventListener('DOMContentLoaded', () => {

    let musicPlaying = false;
    let catTapCount = 0;
    let moonTapCount = 0;
    let heartTapCount = 0;
    let inactivityTimer;
    let currentMemeIndex = 0;
    let currentPageNum = 1;

    const bgMusic = document.getElementById('bgMusic');
    const meowSound = document.getElementById('meowSound');
    const musicBtn = document.getElementById('musicBtn');
    const inactivityNote = document.getElementById('inactivityNote');
    
    const loadingScreen = document.getElementById('loadingScreen');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const notebookScreen = document.getElementById('notebookScreen');
    const endingScreen = document.getElementById('endingScreen');

    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    // Loading Engine
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
    }, 800);

    setTimeout(() => {
        clearInterval(loadingInterval);
        loadingScreen.classList.remove('active');
        loadingScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.classList.add('active');
    }, 3000);

    // Audio Button
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

    // Envelope Click
    const openSurpriseBtn = document.getElementById('openSurpriseBtn');
    openSurpriseBtn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(50);
        welcomeScreen.classList.remove('active');
        welcomeScreen.classList.add('hidden');
        notebookScreen.classList.remove('hidden');
        notebookScreen.classList.add('active');
        resetInactivityTimer();
    });

    // Notebook Turning
    const nextPageBtns = document.querySelectorAll('.next-page-btn');
    nextPageBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const currentPage = document.querySelector(`.page[data-page="${currentPageNum}"]`);
            if (currentPage) {
                currentPage.classList.remove('active-page');
                currentPage.classList.add('turned');
            }

            currentPageNum++;
            const nextPage = document.querySelector(`.page[data-page="${currentPageNum}"]`);
            if (nextPage) {
                nextPage.classList.add('active-page');
                if (currentPageNum === 9) startTypewriter();
            }
            resetInactivityTimer();
        });
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
            confetti({ particleCount: 60, spread: 50 });
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
        ctxScratch.fillStyle = '#C0C0C0';
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

    // Gifts
    const giftBoxes = document.querySelectorAll('.gift-box');
    const giftResult = document.getElementById('giftResult');
    giftBoxes.forEach(gift => {
        gift.addEventListener('click', () => {
            giftResult.textContent = gift.getAttribute('data-reward');
            confetti({ particleCount: 40, spread: 40 });
        });
    });

    // Typewriter
    const loveLetterText = "Every single moment with you feels like a quiet blessing. Thank you for being my favorite notification, my comfort place, and my biggest smile. I love you beybbb, today and every single day after. 💜";
    function startTypewriter() {
        const typewriterEl = document.getElementById('typewriterText');
        typewriterEl.textContent = "";
        let i = 0;
        const timer = setInterval(() => {
            if (i < loveLetterText.length) {
                typewriterEl.textContent += loveLetterText.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 45);
    }

    // Hold Ending
    const holdBtn = document.getElementById('holdHeartBtn');
    let holdTimer;
    const startHold = () => { holdTimer = setTimeout(triggerEndingCinematic, 2500); };
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
                    setTimeout(showNextLine, 2200);
                }, 600);
            } else {
                setTimeout(() => {
                    endingText.style.display = 'none';
                    endingHeart.classList.remove('hidden');
                    setTimeout(() => finalCloseNote.classList.remove('hidden'), 1200);
                }, 800);
            }
        }
        showNextLine();
    }

    // Inactivity Note
    function resetInactivityTimer() {
        inactivityNote.classList.remove('show');
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => inactivityNote.classList.add('show'), 15000);
    }
    window.addEventListener('touchstart', resetInactivityTimer);

    // Canvas Particles
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

