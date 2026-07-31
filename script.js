document.addEventListener('DOMContentLoaded', () => {

    // --- State Variables ---
    let musicPlaying = false;
    let catTapCount = 0;
    let moonTapCount = 0;
    let heartTapCount = 0;
    let inactivityTimer;
    let currentMemeIndex = 0;
    let currentPageNum = 1;

    // --- DOM Elements ---
    const bgMusic = document.getElementById('bgMusic');
    const meowSound = document.getElementById('meowSound');
    const musicBtn = document.getElementById('musicBtn');
    const inactivityNote = document.getElementById('inactivityNote');
    
    // Screens
    const loadingScreen = document.getElementById('loadingScreen');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const notebookScreen = document.getElementById('notebookScreen');
    const endingScreen = document.getElementById('endingScreen');

    // Canvas Particles
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    // --- 0. Loading Screen Messages Engine ---
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
    }, 900);

    setTimeout(() => {
        clearInterval(loadingInterval);
        loadingScreen.classList.remove('active');
        loadingScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.classList.add('active');
    }, 3500);

    // --- Background Music Handler ---
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

    // --- Envelope Click Action ---
    const openSurpriseBtn = document.getElementById('openSurpriseBtn');
    const envelope = document.querySelector('.envelope');

    openSurpriseBtn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(50);
        envelope.style.transform = 'scale(1.1) rotate(5deg)';
        
        setTimeout(() => {
            welcomeScreen.classList.remove('active');
            welcomeScreen.classList.add('hidden');
            notebookScreen.classList.remove('hidden');
            notebookScreen.classList.add('active');
            resetInactivityTimer();
        }, 800);
    });

    // --- Notebook Page Turning Logic ---
    const pages = document.querySelectorAll('.page');
    const nextPageBtns = document.querySelectorAll('.next-page-btn');

    nextPageBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const currentPage = document.querySelector(`.page[data-page="${currentPageNum}"]`);
            currentPage.classList.remove('active-page');
            currentPage.classList.add('turned');

            currentPageNum++;
            const nextPage = document.querySelector(`.page[data-page="${currentPageNum}"]`);
            if (nextPage) {
                nextPage.classList.add('active-page');
                
                // Trigger Typewriter if on Page 9
                if (currentPageNum === 9) {
                    startTypewriter();
                }
            }
            resetInactivityTimer();
        });
    });

    // --- Meme Slider Engine ---
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

    // --- 7. Happy Cat Interaction ---
    const happyCat = document.getElementById('happyCat');
    const achievement = document.getElementById('achievement');

    happyCat.addEventListener('click', () => {
        catTapCount++;
        meowSound.currentTime = 0;
        meowSound.play().catch(() => {});
        
        if (catTapCount >= 5) {
            achievement.classList.remove('hidden');
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
    });

    // --- 8. Flip Cards ---
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // --- 9. Scratch Cards Canvas Logic ---
    const scratchCanvases = document.querySelectorAll('.scratch-canvas');
    scratchCanvases.forEach(canvas => {
        const ctxScratch = canvas.getContext('2d');
        ctxScratch.fillStyle = '#C0C0C0'; // Silver foil color
        ctxScratch.fillRect(0, 0, canvas.width, canvas.height);

        let isScratching = false;

        const scratch = (e) => {
            if (!isScratching) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;

            ctxScratch.globalCompositeOperation = 'destination-out';
            ctxScratch.beginPath();
            ctxScratch.arc(x, y, 15, 0, Math.PI * 2);
            ctxScratch.fill();
        };

        canvas.addEventListener('mousedown', () => isScratching = true);
        canvas.addEventListener('mouseup', () => isScratching = false);
        canvas.addEventListener('mousemove', scratch);

        canvas.addEventListener('touchstart', () => isScratching = true);
        canvas.addEventListener('touchend', () => isScratching = false);
        canvas.addEventListener('touchmove', scratch);
    });

    // --- 10. Gift Box Logic ---
    const giftBoxes = document.querySelectorAll('.gift-box');
    const giftResult = document.getElementById('giftResult');

    giftBoxes.forEach(gift => {
        gift.addEventListener('click', () => {
            const reward = gift.getAttribute('data-reward');
            giftResult.textContent = reward;
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
        });
    });

    // --- 11. Typewriter Text ---
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
        }, 50);
    }

    // --- Hold Heart ending Trigger (3 Sec Hold) ---
    const holdBtn = document.getElementById('holdHeartBtn');
    let holdTimer;

    holdBtn.addEventListener('mousedown', startHold);
    holdBtn.addEventListener('touchstart', startHold);
    holdBtn.addEventListener('mouseup', endHold);
    holdBtn.addEventListener('touchend', endHold);

    function startHold() {
        holdBtn.style.transform = 'scale(0.95)';
        holdTimer = setTimeout(() => {
            triggerEndingCinematic();
        }, 3000);
    }

    function endHold() {
        holdBtn.style.transform = 'scale(1)';
        clearTimeout(holdTimer);
    }

    // --- 12 & 13. Cinematic Ending Sequence ---
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
                    setTimeout(showNextLine, 2500);
                }, 800);
            } else {
                setTimeout(() => {
                    endingText.style.display = 'none';
                    endingHeart.classList.remove('hidden');
                    setTimeout(() => {
                        finalCloseNote.classList.remove('hidden');
                    }, 1500);
                }, 1000);
            }
        }

        showNextLine();
    }

    // --- Easter Eggs ---
    const moonBtn = document.getElementById('moonBtn');
    const secretModal = document.getElementById('secretModal');
    const closeModal = document.querySelector('.close-modal');

    moonBtn.addEventListener('click', () => {
        moonTapCount++;
        if (moonTapCount === 5) {
            alert("Still thinking about you. 🌙");
        }
    });

    window.addEventListener('click', (e) => {
        // Track tap sequence anywhere for Heart 14x tap secret
        heartTapCount++;
        if (heartTapCount === 14) {
            secretModal.classList.remove('hidden');
        }
        
        // Spawn Interactive Sparkles/Hearts
        createParticle(e.clientX, e.clientY);
    });

    closeModal.addEventListener('click', () => secretModal.classList.add('hidden'));

    // --- Inactivity Note Handler ---
    function resetInactivityTimer() {
        inactivityNote.classList.remove('show');
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            inactivityNote.classList.add('show');
        }, 15000);
    }
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('touchstart', resetInactivityTimer);

    // --- Particle Effect System (Sparkles on Touch/Click) ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function createParticle(x, y) {
        if (!x || !y) return;
        const shapes = ['🌸', '✨', '💜', '💖'];
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 15 + 10,
            text: shapes[Math.floor(Math.random() * shapes.length)],
            alpha: 1,
            vy: -Math.random() * 2 - 1,
            vx: (Math.random() - 0.5) * 2
        });
    }

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

