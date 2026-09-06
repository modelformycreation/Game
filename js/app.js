// VIDYUN-MANAS - World's Most Advanced Brain Training Platform
// Main Application Entry Point

// ===================================
// Firebase Configuration
// ===================================
const firebaseConfig = {
    apiKey: "AIzaSyD4Mgs8-_UfaXdVypG5By5UPFO0CrlTgDY",
    authDomain: "vidyun-manas.firebaseapp.com",
    projectId: "vidyun-manas",
    storageBucket: "vidyun-manas.firebasestorage.app",
    messagingSenderId: "158686953268",
    appId: "1:158686953268:web:789a247353a7dd0a006f61",
    measurementId: "G-9098LGRNCS"
};

// Initialize Firebase
let app, auth, db;
let firebaseInitialized = false;

function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            db = firebase.firestore();
            firebaseInitialized = true;
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    } else {
        console.warn('Firebase SDK not loaded');
    }
}

// ===================================
// Application State
// ===================================
const state = {
    user: null,
    userData: null,
    currentPage: 'dashboard',
    gameState: null,
    isPlaying: false,
    streak: 0,
    lastPlayedDate: null
};

// ===================================
// Utility Functions
// ===================================
const utils = {
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },

    // Format time
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // Format number
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },

    // Clamp value
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // Random integer
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Shuffle array
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Hash password (simple hash for demo)
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'vidyun_salt');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Get today's date string
    getDateString() {
        return new Date().toISOString().split('T')[0];
    },

    // Days since date
    daysSince(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    },

    // Animate number
    animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeProgress);
            element.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    }
};

// ===================================
// Toast Notifications
// ===================================
const toast = {
    container: null,

    init() {
        this.container = document.getElementById('toast-container');
    },

    show(type, title, message, duration = 5000) {
        const icons = {
            success: 'ph-check-circle',
            error: 'ph-x-circle',
            warning: 'ph-warning',
            info: 'ph-info'
        };

        const toastEl = document.createElement('div');
        toastEl.className = `toast ${type}`;
        toastEl.innerHTML = `
            <i class="ph ${icons[type]} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close" onclick="toast.close(this.parentElement)">
                <i class="ph ph-x"></i>
            </button>
        `;

        this.container.appendChild(toastEl);

        setTimeout(() => {
            toastEl.classList.add('toast-out');
            setTimeout(() => toastEl.remove(), 300);
        }, duration);
    },

    close(toastEl) {
        toastEl.classList.add('toast-out');
        setTimeout(() => toastEl.remove(), 300);
    },

    success(title, message) {
        this.show('success', title, message);
    },

    error(title, message) {
        this.show('error', title, message);
    },

    warning(title, message) {
        this.show('warning', title, message);
    },

    info(title, message) {
        this.show('info', title, message);
    }
};

// ===================================
// Modal System
// ===================================
const modal = {
    container: null,
    content: null,

    init() {
        this.container = document.getElementById('modal-container');
        this.content = document.getElementById('modal-content');
        
        this.container.querySelector('.modal-backdrop').addEventListener('click', () => this.close());
    },

    open(content, options = {}) {
        const { title = '', size = 'medium' } = options;
        
        this.content.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" onclick="modal.close()">
                    <i class="ph ph-x"></i>
                </button>
            </div>
            <div class="modal-body">${content}</div>
        `;
        
        this.container.classList.remove('hidden');
        
        if (size === 'large') {
            this.content.style.maxWidth = '800px';
        } else if (size === 'small') {
            this.content.style.maxWidth = '400px';
        } else {
            this.content.style.maxWidth = '500px';
        }
    },

    close() {
        this.container.classList.add('hidden');
    }
};

// ===================================
// Router
// ===================================
const router = {
    routes: {
        'dashboard': renderDashboard,
        'training': renderTraining,
        'games': renderGames,
        'analytics': renderAnalytics,
        'habits': renderHabits,
        'achievements': renderAchievements,
        'settings': renderSettings,
        'weekly-review': renderWeeklyReview
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    handleRoute() {
        const hash = window.location.hash.slice(2) || 'dashboard';
        const page = hash.split('/')[0];
        
        if (this.routes[page]) {
            state.currentPage = page;
            this.updateNavigation();
            this.routes[page]();
        }
    },

    navigate(page) {
        window.location.hash = `/${page}`;
    },

    updateNavigation() {
        document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === state.currentPage) {
                item.classList.add('active');
            }
        });
    }
};

// ===================================
// Authentication
// ===================================
const authSystem = {
    async register(email, password, name, goal) {
        try {
            if (!firebaseInitialized) {
                throw new Error('Firebase not initialized');
            }

            const passwordHash = await utils.hashPassword(password);

            // Create user in Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Store additional user data in Firestore
            await db.collection('users').doc(user.uid).set({
                profile: {
                    email: email,
                    name: name,
                    goal: goal,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    passwordHash: passwordHash
                },
                baseline: {
                    completed: false,
                    results: {}
                },
                progress: {
                    games: {},
                    categories: {
                        speed: { score: 0, trend: 'neutral' },
                        memory: { score: 0, trend: 'neutral' },
                        logic: { score: 0, trend: 'neutral' },
                        psychology: { score: 0, trend: 'neutral' },
                        superhuman: { score: 0, trend: 'neutral' },
                        advanced: { score: 0, trend: 'neutral' }
                    },
                    brainAge: 50,
                    brainAgeHistory: []
                },
                habits: {},
                achievements: {},
                weeklyReview: {},
                settings: {
                    dailyGoalMinutes: 20,
                    reminderTime: '09:00',
                    soundEnabled: true,
                    notificationsEnabled: true
                }
            });

            toast.success('Welcome to Vidyun-manas!', 'Your journey to cognitive excellence begins now.');
            return user;

        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async login(email, password) {
        try {
            if (!firebaseInitialized) {
                throw new Error('Firebase not initialized');
            }

            const passwordHash = await utils.hashPassword(password);

            // Sign in with Firebase Auth
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Verify password hash matches
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const storedHash = userDoc.data().profile.passwordHash;
                if (storedHash !== passwordHash) {
                    await auth.signOut();
                    throw new Error('Invalid credentials');
                }
            }

            toast.success('Welcome back!', 'Loading your brain training data...');
            return user;

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            if (firebaseInitialized) {
                await auth.signOut();
            }
            state.user = null;
            state.userData = null;
            showAuthScreen();
            toast.info('Signed out', 'See you next time!');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    async onAuthStateChanged(callback) {
        if (firebaseInitialized) {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    state.user = user;
                    await this.loadUserData(user.uid);
                    callback(user);
                } else {
                    callback(null);
                }
            });
        }
    },

    async loadUserData(uid) {
        try {
            const doc = await db.collection('users').doc(uid).get();
            if (doc.exists) {
                state.userData = doc.data();
                this.calculateStreak();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    },

    calculateStreak() {
        const today = utils.getDateString();
        const lastPlayed = state.userData?.progress?.lastPlayedDate;
        
        if (!lastPlayed) {
            state.streak = 0;
            return;
        }

        const lastDate = new Date(lastPlayed);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Already played today, keep streak
        } else if (diffDays === 1) {
            state.streak = (state.streak || 0) + 1;
        } else {
            state.streak = 1;
        }

        state.lastPlayedDate = today;
    },

    async updateUserData(data) {
        if (!state.user || !firebaseInitialized) return;
        
        try {
            await db.collection('users').doc(state.user.uid).update(data);
            await this.loadUserData(state.user.uid);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    }
};

// ===================================
// Game Engine
// ===================================
const gameEngine = {
    currentGame: null,
    timer: null,
    score: 0,
    level: 1,
    startTime: 0,
    paused: false,

    games: {
        // Speed & Reflex
        'neural-snap': {
            name: 'Neural Snap',
            category: 'speed',
            icon: 'ph-crosshair',
            description: 'Click targets as fast as possible',
            levels: 50
        },
        'color-blitz': {
            name: 'Color Blitz',
            category: 'speed',
            icon: 'ph-palette',
            description: 'Match colors under time pressure',
            levels: 50
        },
        'rapid-math': {
            name: 'Rapid Math',
            category: 'speed',
            icon: 'ph-calculator',
            description: 'Solve equations faster than they appear',
            levels: 50
        },
        'sequence-break': {
            name: 'Sequence Break',
            category: 'speed',
            icon: 'ph-numbers',
            description: 'Click numbers in order as fast as possible',
            levels: 50
        },
        'reaction-test': {
            name: 'Reaction Test',
            category: 'speed',
            icon: 'ph-lightning',
            description: 'Measure your reaction time',
            levels: 50
        },

        // Memory
        'grid-lock': {
            name: 'Grid Lock',
            category: 'memory',
            icon: 'ph-grid-four',
            description: 'Remember and recreate patterns',
            levels: 50
        },
        'card-cascade': {
            name: 'Card Cascade',
            category: 'memory',
            icon: 'ph-cards',
            description: 'Match pairs from memory',
            levels: 50
        },
        'echo-recall': {
            name: 'Echo Recall',
            category: 'memory',
            icon: 'ph-waveform',
            description: 'Remember sequences of shapes and sounds',
            levels: 50
        },
        'list-master': {
            name: 'List Master',
            category: 'memory',
            icon: 'ph-list-numbers',
            description: 'Remember growing lists',
            levels: 50
        },
        'memory-palace': {
            name: 'Memory Palace',
            category: 'superhuman',
            icon: 'ph-building',
            description: 'Learn the ancient memory technique',
            levels: 50
        },

        // Logic
        'pattern-oracle': {
            name: 'Pattern Oracle',
            category: 'logic',
            icon: 'ph-brain',
            description: 'Find the next item in sequence',
            levels: 50
        },
        'cipher-cracker': {
            name: 'Cipher Cracker',
            category: 'logic',
            icon: 'ph-lock-key',
            description: 'Decode encrypted messages',
            levels: 50
        },
        'logic-grid': {
            name: 'Logic Grid',
            category: 'logic',
            icon: 'ph-table',
            description: 'Solve complex logic puzzles',
            levels: 50
        },
        'binary-translator': {
            name: 'Binary Translator',
            category: 'superhuman',
            icon: 'ph-binary',
            description: 'Convert binary/hex in your head',
            levels: 50
        },
        'mental-math': {
            name: 'Mental Math',
            category: 'superhuman',
            icon: 'ph-abacus',
            description: 'Calculate large problems mentally',
            levels: 50
        },

        // Psychology
        'focus-zone': {
            name: 'Focus Zone',
            category: 'psychology',
            icon: 'ph-eye',
            description: 'Maintain concentration under distraction',
            levels: 50
        },
        'decision-dilemma': {
            name: 'Decision Dilemma',
            category: 'psychology',
            icon: 'ph-scales',
            description: 'Make optimal decisions under pressure',
            levels: 50
        },
        'emotion-reader': {
            name: 'Emotion Reader',
            category: 'psychology',
            icon: 'ph-smiley',
            description: 'Read micro-expressions',
            levels: 50
        },
        'stress-test': {
            name: 'Stress Test',
            category: 'psychology',
            icon: 'ph-heartbeat',
            description: 'Perform under increasing pressure',
            levels: 50
        },

        // Advanced
        'dual-nback': {
            name: 'Dual N-Back',
            category: 'advanced',
            icon: 'ph-arrows-split',
            description: 'Gold standard of working memory',
            levels: 10
        },
        'calculation-pro': {
            name: 'Calculation Pro',
            category: 'advanced',
            icon: 'ph-math-operations',
            description: 'Advanced mental calculation',
            levels: 50
        },
        'visualization': {
            name: 'Visualization',
            category: 'advanced',
            icon: 'ph-cube',
            description: 'Hold and manipulate 3D shapes mentally',
            levels: 50
        },
        'speed-reading': {
            name: 'Speed Reading',
            category: 'advanced',
            icon: 'ph-book-open',
            description: 'Read fast with comprehension',
            levels: 50
        }
    },

    async start(gameId, level = 1) {
        this.currentGame = this.games[gameId];
        this.level = level;
        this.score = 0;
        this.paused = false;

        // Get user's current level for this game
        const gameProgress = state.userData?.progress?.games?.[gameId];
        if (gameProgress && gameProgress.currentLevel) {
            this.level = gameProgress.currentLevel;
        }

        // Show game modal
        const gameModal = document.getElementById('game-modal');
        const gameTitle = document.getElementById('game-title');
        const currentLevelEl = document.getElementById('current-level');
        const currentScoreEl = document.getElementById('current-score');
        
        gameTitle.textContent = this.currentGame.name;
        currentLevelEl.textContent = this.level;
        currentScoreEl.textContent = '0';
        
        gameModal.classList.remove('hidden');

        // Initialize game-specific UI
        this.initGameUI(gameId);
    },

    initGameUI(gameId) {
        const gameArea = document.getElementById('game-area');
        const gameTimer = document.getElementById('game-timer');
        
        // Reset timer
        gameTimer.textContent = '00:00';
        
        // Show start screen based on game type
        switch (gameId) {
            case 'neural-snap':
                this.renderNeuralSnapStart(gameArea);
                break;
            case 'reaction-test':
                this.renderReactionTestStart(gameArea);
                break;
            case 'grid-lock':
                this.renderGridLockStart(gameArea);
                break;
            case 'pattern-oracle':
                this.renderPatternOracleStart(gameArea);
                break;
            case 'mental-math':
                this.renderMentalMathStart(gameArea);
                break;
            case 'dual-nback':
                this.renderDualNBackStart(gameArea);
                break;
            default:
                this.renderGenericGameStart(gameArea);
        }

        // Setup controls
        document.getElementById('game-quit').onclick = () => this.quit();
        document.getElementById('game-pause').onclick = () => this.togglePause();
    },

    renderNeuralSnapStart(area) {
        const targetCount = Math.min(10 + this.level * 2, 50);
        const timePerTarget = Math.max(2 - this.level * 0.02, 0.5);
        
        area.innerHTML = `
            <div class="game-start">
                <div class="game-start-header">
                    <div class="game-start-icon">
                        <i class="ph ph-crosshair"></i>
                    </div>
                    <h2 class="game-start-title">Neural Snap</h2>
                    <p class="game-start-description">Click the targets as fast as you can. The faster you click, the higher your score!</p>
                </div>
                <div class="game-start-info">
                    <div class="info-card">
                        <i class="ph ph-target info-icon"></i>
                        <div class="info-value">${targetCount}</div>
                        <div class="info-label">Targets</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-timer info-icon"></i>
                        <div class="info-value">${timePerTarget.toFixed(1)}s</div>
                        <div class="info-label">Per Target</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-trophy info-icon"></i>
                        <div class="info-value">${this.level}</div>
                        <div class="info-label">Level</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="gameEngine.playNeuralSnap()">
                    <i class="ph ph-play"></i>
                    Start Game
                </button>
            </div>
        `;
    },

    playNeuralSnap() {
        const area = document.getElementById('game-area');
        const targetCount = Math.min(10 + this.level * 2, 50);
        const timePerTarget = Math.max(2 - this.level * 0.02, 0.5);
        
        let targetsHit = 0;
        let targetsMissed = 0;
        let totalTime = 0;
        const startTime = Date.now();

        area.innerHTML = `
            <div class="game-container">
                <div class="game-target-area neural-snap-area" id="snap-area"></div>
                <div class="neural-progress">
                    <div class="neural-progress-bar">
                        <div class="neural-progress-fill" id="snap-progress" style="width: 0%"></div>
                    </div>
                    <span class="neural-stat" id="snap-count">0 / ${targetCount}</span>
                </div>
            </div>
            <div class="countdown-overlay" id="countdown-overlay">
                <div class="countdown-number" id="countdown-number">3</div>
            </div>
        `;

        const snapArea = document.getElementById('snap-area');
        const progressBar = document.getElementById('snap-progress');
        const countDisplay = document.getElementById('snap-count');
        const countdownOverlay = document.getElementById('countdown-overlay');
        const countdownNumber = document.getElementById('countdown-number');

        // Countdown
        let count = 3;
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownNumber.textContent = count;
            } else if (count === 0) {
                countdownNumber.textContent = 'GO!';
            } else {
                clearInterval(countdownInterval);
                countdownOverlay.style.display = 'none';
                spawnTarget();
                startTimer();
            }
        }, 1000);

        function startTimer() {
            gameEngine.startTime = Date.now();
            gameEngine.timer = setInterval(() => {
                if (!gameEngine.paused) {
                    const elapsed = Math.floor((Date.now() - gameEngine.startTime) / 1000);
                    document.getElementById('game-timer').textContent = utils.formatTime(elapsed);
                }
            }, 100);
        }

        function spawnTarget() {
            if (targetsHit + targetsMissed >= targetCount) {
                endGame();
                return;
            }

            if (gameEngine.paused) return;

            const target = document.createElement('div');
            target.className = 'neural-target';
            target.innerHTML = '<i class="ph ph-crosshair"></i>';
            
            const areaRect = snapArea.getBoundingClientRect();
            const x = utils.randomInt(60, areaRect.width - 120);
            const y = utils.randomInt(60, areaRect.height - 120);
            
            target.style.left = x + 'px';
            target.style.top = y + 'px';

            target.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!gameEngine.paused) {
                    targetsHit++;
                    target.remove();
                    updateProgress();
                    setTimeout(spawnTarget, 200);
                }
            });

            snapArea.appendChild(target);

            // Target disappears after time
            setTimeout(() => {
                if (target.parentElement) {
                    targetsMissed++;
                    target.remove();
                    updateProgress();
                    setTimeout(spawnTarget, 200);
                }
            }, timePerTarget * 1000);
        }

        function updateProgress() {
            const progress = ((targetsHit + targetsMissed) / targetCount) * 100;
            progressBar.style.width = progress + '%';
            countDisplay.textContent = `${targetsHit} / ${targetCount}`;
            document.getElementById('current-score').textContent = targetsHit;
        }

        function endGame() {
            clearInterval(gameEngine.timer);
            totalTime = (Date.now() - gameEngine.startTime) / 1000;
            
            const results = {
                gameId: 'neural-snap',
                score: targetsHit,
                maxScore: targetCount,
                accuracy: Math.round((targetsHit / targetCount) * 100),
                time: totalTime,
                level: gameEngine.level,
                timestamp: Date.now()
            };

            gameEngine.showResults(results);
        }
    },

    renderReactionTestStart(area) {
        area.innerHTML = `
            <div class="game-start">
                <div class="game-start-header">
                    <div class="game-start-icon">
                        <i class="ph ph-lightning"></i>
                    </div>
                    <h2 class="game-start-title">Reaction Test</h2>
                    <p class="game-start-description">Click when the screen turns green. Wait for it, don't click early!</p>
                </div>
                <div class="game-start-info">
                    <div class="info-card">
                        <i class="ph ph-repeat info-icon"></i>
                        <div class="info-value">10</div>
                        <div class="info-label">Attempts</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-chart-line info-icon"></i>
                        <div class="info-value">Best</div>
                        <div class="info-label">Recorded</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-trophy info-icon"></i>
                        <div class="info-value">${this.level}</div>
                        <div class="info-label">Level</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="gameEngine.playReactionTest()">
                    <i class="ph ph-play"></i>
                    Start Test
                </button>
            </div>
        `;
    },

    playReactionTest() {
        const area = document.getElementById('game-area');
        let attempts = 0;
        const maxAttempts = 10;
        const times = [];
        let waiting = false;
        let startTime = 0;

        area.innerHTML = `
            <div class="reaction-area" id="reaction-area">
                <div class="reaction-screen waiting" id="reaction-screen">
                    Click to Start
                </div>
                <div class="reaction-time" id="reaction-time" style="display: none;">--- ms</div>
            </div>
        `;

        const screen = document.getElementById('reaction-screen');
        const timeDisplay = document.getElementById('reaction-time');

        screen.addEventListener('click', () => {
            if (attempts >= maxAttempts) {
                endGame();
                return;
            }

            if (!waiting) {
                // Start waiting
                waiting = true;
                screen.className = 'reaction-screen waiting';
                screen.textContent = 'Wait for green...';

                // Random delay
                const delay = utils.randomInt(2000, 5000);
                setTimeout(() => {
                    if (waiting) {
                        waiting = false;
                        startTime = Date.now();
                        screen.className = 'reaction-screen ready';
                        screen.textContent = 'CLICK NOW!';
                    }
                }, delay);
            } else if (screen.classList.contains('ready')) {
                // Clicked on green - success
                waiting = false;
                const reactionTime = Date.now() - startTime;
                times.push(reactionTime);
                attempts++;
                
                screen.className = 'reaction-screen click';
                screen.textContent = `${reactionTime} ms`;
                timeDisplay.style.display = 'block';
                timeDisplay.textContent = `Average: ${Math.round(times.reduce((a, b) => a + b, 0) / times.length)} ms`;

                document.getElementById('current-score').textContent = reactionTime;

                setTimeout(() => {
                    if (attempts < maxAttempts) {
                        screen.className = 'reaction-screen waiting';
                        screen.textContent = 'Click for next';
                        waiting = false;
                    } else {
                        endGame();
                    }
                }, 1000);
            } else {
                // Clicked too early
                screen.className = 'reaction-screen waiting';
                screen.textContent = 'Too early! Click to try again';
                waiting = false;
            }
        });

        function endGame() {
            const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
            const bestTime = Math.min(...times);
            
            const results = {
                gameId: 'reaction-test',
                score: avgTime,
                bestScore: bestTime,
                attempts: maxAttempts,
                level: gameEngine.level,
                timestamp: Date.now()
            };

            gameEngine.showResults(results);
        }
    },

    renderGridLockStart(area) {
        const gridSize = Math.min(3 + Math.floor(this.level / 10), 5);
        
        area.innerHTML = `
            <div class="game-start">
                <div class="game-start-header">
                    <div class="game-start-icon">
                        <i class="ph ph-grid-four"></i>
                    </div>
                    <h2 class="game-start-title">Grid Lock</h2>
                    <p class="game-start-description">Watch the pattern light up, then recreate it from memory.</p>
                </div>
                <div class="game-start-info">
                    <div class="info-card">
                        <i class="ph ph-grid-four info-icon"></i>
                        <div class="info-value">${gridSize}×${gridSize}</div>
                        <div class="info-label">Grid Size</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-clock info-icon"></i>
                        <div class="info-value">3s</div>
                        <div class="info-label">View Time</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-trophy info-icon"></i>
                        <div class="info-value">${this.level}</div>
                        <div class="info-label">Level</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="gameEngine.playGridLock()">
                    <i class="ph ph-play"></i>
                    Start Game
                </button>
            </div>
        `;
    },

    playGridLock() {
        const area = document.getElementById('game-area');
        const gridSize = Math.min(3 + Math.floor(this.level / 10), 5);
        const cellCount = gridSize * gridSize;
        const activeCount = Math.min(3 + Math.floor(this.level / 5), Math.floor(cellCount * 0.6));
        
        let phase = 'showing';
        let selected = [];
        let activeCells = [];

        area.innerHTML = `
            <div class="grid-lock-area">
                <div class="grid-lock-instruction" id="grid-instruction">Watch the pattern...</div>
                <div class="grid-lock-grid" id="grid-lock-grid" style="grid-template-columns: repeat(${gridSize}, 60px);"></div>
                <div class="neural-progress" style="margin-top: 20px;">
                    <span class="neural-stat" id="grid-progress">0 / ${activeCount}</span>
                </div>
            </div>
        `;

        const grid = document.getElementById('grid-lock-grid');
        const instruction = document.getElementById('grid-instruction');
        const progress = document.getElementById('grid-progress');

        // Create cells
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-lock-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => handleCellClick(i));
            grid.appendChild(cell);
        }

        // Generate random active cells
        const indices = Array.from({ length: cellCount }, (_, i) => i);
        activeCells = utils.shuffle(indices).slice(0, activeCount);

        // Show pattern
        setTimeout(() => {
            activeCells.forEach(index => {
                grid.children[index].classList.add('active');
            });

            setTimeout(() => {
                grid.querySelectorAll('.grid-lock-cell').forEach(cell => {
                    cell.classList.remove('active');
                });
                
                phase = 'playing';
                instruction.textContent = 'Recreate the pattern!';
                gameEngine.startTime = Date.now();
                gameEngine.timer = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - gameEngine.startTime) / 1000);
                    document.getElementById('game-timer').textContent = utils.formatTime(elapsed);
                }, 1000);
            }, 2000 + this.level * 100);
        }, 500);

        function handleCellClick(index) {
            if (phase !== 'playing') return;

            const cell = grid.children[index];
            
            if (activeCells.includes(index) && !selected.includes(index)) {
                selected.push(index);
                cell.classList.add('selected');
            } else if (!activeCells.includes(index)) {
                cell.classList.add('wrong');
                setTimeout(() => cell.classList.remove('wrong'), 300);
            }

            progress.textContent = `${selected.length} / ${activeCount}`;
            document.getElementById('current-score').textContent = selected.length;

            // Check if complete
            if (selected.length === activeCount) {
                const allCorrect = activeCells.every(c => selected.includes(c));
                endGame(allCorrect);
            }
        }

        function endGame(success) {
            clearInterval(gameEngine.timer);
            const time = (Date.now() - gameEngine.startTime) / 1000;
            
            const results = {
                gameId: 'grid-lock',
                score: success ? Math.round(100 - time * 5) : Math.round(selected.length / activeCount * 50),
                accuracy: Math.round(selected.length / activeCount * 100),
                time: time,
                level: gameEngine.level,
                success: success,
                timestamp: Date.now()
            };

            gameEngine.showResults(results);
        }
    },

    renderPatternOracleStart(area) {
        area.innerHTML = `
            <div class="game-start">
                <div class="game-start-header">
                    <div class="game-start-icon">
                        <i class="ph ph-brain"></i>
                    </div>
                    <h2 class="game-start-title">Pattern Oracle</h2>
                    <p class="game-start-description">Find the next number in the sequence. Train your pattern recognition!</p>
                </div>
                <div class="game-start-info">
                    <div class="info-card">
                        <i class="ph ph-list-numbers info-icon"></i>
                        <div class="info-value">5</div>
                        <div class="info-label">Numbers</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-trophy info-icon"></i>
                        <div class="info-value">${this.level}</div>
                        <div class="info-label">Level</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-target info-icon"></i>
                        <div class="info-value">10</div>
                        <div class="info-label">Rounds</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="gameEngine.playPatternOracle()">
                    <i class="ph ph-play"></i>
                    Start Game
                </button>
            </div>
        `;
    },

    playPatternOracle() {
        const area = document.getElementById('game-area');
        let currentRound = 0;
        const maxRounds = 10;
        let correct = 0;
        let sequence = [];
        let answer = 0;
        let options = [];

        area.innerHTML = `
            <div class="pattern-oracle-area">
                <div class="pattern-sequence" id="pattern-sequence"></div>
                <div class="pattern-question">?</div>
                <div class="pattern-options" id="pattern-options"></div>
                <div class="neural-progress" style="margin-top: 20px;">
                    <span class="neural-stat" id="pattern-round">${currentRound} / ${maxRounds}</span>
                    <span class="neural-stat" id="pattern-correct">Correct: ${correct}</span>
                </div>
            </div>
        `;

        gameEngine.startTime = Date.now();
        gameEngine.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - gameEngine.startTime) / 1000);
            document.getElementById('game-timer').textContent = utils.formatTime(elapsed);
        }, 1000);

        generateRound();

        function generateRound() {
            if (currentRound >= maxRounds) {
                endGame();
                return;
            }

            currentRound++;
            document.getElementById('pattern-round').textContent = `${currentRound} / ${maxRounds}`;

            // Generate sequence based on level
            const startNum = utils.randomInt(1, 20);
            const patternType = (currentRound + gameEngine.level) % 5;
            
            switch (patternType) {
                case 0: // Addition
                    const addStep = utils.randomInt(2, 5 + Math.floor(gameEngine.level / 10));
                    sequence = Array.from({ length: 5 }, (_, i) => startNum + i * addStep);
                    answer = sequence[5] = sequence[4] + addStep;
                    break;
                case 1: // Subtraction
                    const subStep = utils.randomInt(2, 5 + Math.floor(gameEngine.level / 10));
                    sequence = Array.from({ length: 5 }, (_, i) => startNum - i * subStep);
                    answer = sequence[5] = sequence[4] - subStep;
                    break;
                case 2: // Multiplication
                    const multStep = utils.randomInt(2, Math.min(3 + Math.floor(gameEngine.level / 15), 5));
                    sequence = Array.from({ length: 5 }, (_, i) => startNum * Math.pow(multStep, i));
                    answer = sequence[5] = sequence[4] * multStep;
                    break;
                case 3: // Squares
                    sequence = Array.from({ length: 5 }, (_, i) => Math.pow(startNum + i, 2));
                    answer = sequence[5] = Math.pow(startNum + 5, 2);
                    break;
                case 4: // Fibonacci-like
                    sequence = [startNum, startNum + utils.randomInt(1, 3)];
                    for (let i = 2; i < 5; i++) {
                        sequence.push(sequence[i-1] + sequence[i-2]);
                    }
                    answer = sequence[5] = sequence[4] + sequence[3];
                    break;
            }

            // Generate options
            options = utils.shuffle([
                answer,
                answer + utils.randomInt(1, 5),
                answer - utils.randomInt(1, 5),
                answer + utils.randomInt(6, 10)
            ].filter((v, i, a) => a.indexOf(v) === i));

            while (options.length < 4) {
                options.push(answer + options.length * 10);
            }

            options = options.slice(0, 4);
            if (!options.includes(answer)) {
                options[0] = answer;
                options = utils.shuffle(options);
            }

            renderSequence();
        }

        function renderSequence() {
            const seqContainer = document.getElementById('pattern-sequence');
            const optContainer = document.getElementById('pattern-options');

            seqContainer.innerHTML = sequence.map(num => 
                `<div class="pattern-item">${num}</div>`
            ).join('') + '<div class="pattern-question">?</div>';

            optContainer.innerHTML = options.map(opt => 
                `<div class="pattern-option" onclick="gameEngine.selectPatternOption(${opt})">${opt}</div>`
            ).join('');
        }
    },

    selectPatternOption(selected) {
        const optionEls = document.querySelectorAll('.pattern-option');
        optionEls.forEach(el => {
            el.style.pointerEvents = 'none';
            if (parseInt(el.textContent) === selected) {
                el.classList.add(selected === answer ? 'correct' : 'wrong');
            }
            if (parseInt(el.textContent) === answer) {
                el.classList.add('correct');
            }
        });

        if (selected === answer) {
            correct++;
            document.getElementById('pattern-correct').textContent = `Correct: ${correct}`;
            document.getElementById('current-score').textContent = correct;
        }

        setTimeout(() => {
            generateRound();
        }, 1000);
    },

    renderMentalMathStart(area) {
        area.innerHTML = `
            <div class="game-start">
                <div class="game-start-header">
                    <div class="game-start-icon">
                        <i class="ph ph-calculator"></i>
                    </div>
                    <h2 class="game-start-title">Mental Math</h2>
                    <p class="game-start-description">Solve math problems in your head. Type the answer before time runs out!</p>
                </div>
                <div class="game-start-info">
                    <div class="info-card">
                        <i class="ph ph-target info-icon"></i>
                        <div class="info-value">20</div>
                        <div class="info-label">Problems</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-trophy info-icon"></i>
                        <div class="info-value">${this.level}</div>
                        <div class="info-label">Level</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-clock info-icon"></i>
                        <div class="info-value">10s</div>
                        <div class="info-label">Per Problem</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="gameEngine.playMentalMath()">
                    <i class="ph ph-play"></i>
                    Start Game
                </button>
            </div>
        `;
    },

    playMentalMath() {
        const area = document.getElementById('game-area');
        let currentProblem = 0;
        const maxProblems = 20;
        let correct = 0;
        let currentAnswer = 0;
        let problemTimeout = null;

        area.innerHTML = `
            <div class="mental-math-area">
                <div class="mental-math-display">
                    <div class="mental-math-problem" id="math-problem">Ready?</div>
                </div>
                <input type="text" class="mental-math-input" id="math-input" placeholder="?" autofocus>
                <div class="mental-math-stats">
                    <div class="math-stat">
                        <div class="math-stat-value" id="math-correct">${correct}</div>
                        <div class="math-stat-label">Correct</div>
                    </div>
                    <div class="math-stat">
                        <div class="math-stat-value" id="math-progress">${currentProblem}/${maxProblems}</div>
                        <div class="math-stat-label">Progress</div>
                    </div>
                </div>
            </div>
        `;

        const input = document.getElementById('math-input');
        const problemDisplay = document.getElementById('math-problem');

        gameEngine.startTime = Date.now();
        gameEngine.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - gameEngine.startTime) / 1000);
            document.getElementById('game-timer').textContent = utils.formatTime(elapsed);
        }, 1000);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });

        generateProblem();

        function generateProblem() {
            if (currentProblem >= maxProblems) {
                endGame();
                return;
            }

            currentProblem++;
            document.getElementById('math-progress').textContent = `${currentProblem}/${maxProblems}`;
            input.value = '';
            input.focus();

            const level = gameEngine.level;
            let a, b, operator, problem;

            if (level <= 10) {
                // Simple addition/subtraction
                a = utils.randomInt(1, 50);
                b = utils.randomInt(1, 50);
                operator = Math.random() > 0.5 ? '+' : '-';
            } else if (level <= 20) {
                // Multiplication
                a = utils.randomInt(2, 12);
                b = utils.randomInt(2, 12);
                operator = Math.random() > 0.3 ? '×' : (Math.random() > 0.5 ? '+' : '-');
            } else if (level <= 30) {
                // Division and squares
                const type = Math.random();
                if (type < 0.3) {
                    a = utils.randomInt(10, 99);
                    b = utils.randomInt(2, 9);
                    operator = '×';
                } else if (type < 0.5) {
                    a = b * utils.randomInt(2, 10);
                    b = utils.randomInt(2, 9);
                    operator = '÷';
                } else if (type < 0.7) {
                    a = utils.randomInt(1, 15);
                    operator = '²';
                    currentAnswer = a * a;
                    problem = `${a}²`;
                    problemDisplay.textContent = problem;
                    return;
                } else {
                    a = utils.randomInt(1, 50);
                    b = utils.randomInt(1, 50);
                    operator = Math.random() > 0.5 ? '+' : '-';
                }
            } else {
                // Complex
                const type = Math.random();
                if (type < 0.3) {
                    a = utils.randomInt(10, 25);
                    b = utils.randomInt(10, 25);
                    operator = '×';
                } else if (type < 0.5) {
                    a = utils.randomInt(1, 20);
                    operator = '²';
                    currentAnswer = a * a;
                    problem = `${a}²`;
                    problemDisplay.textContent = problem;
                    return;
                } else if (type < 0.7) {
                    a = utils.randomInt(50, 99);
                    b = utils.randomInt(50, 99);
                    operator = '+';
                } else {
                    a = utils.randomInt(100, 999);
                    b = utils.randomInt(10, 99);
                    operator = '×';
                }
            }

            switch (operator) {
                case '+': currentAnswer = a + b; break;
                case '-': currentAnswer = a - b; break;
                case '×': currentAnswer = a * b; break;
                case '÷': currentAnswer = a / b; break;
            }

            problem = `${a} ${operator} ${b} = ?`;
            problemDisplay.textContent = problem;

            // Auto timeout
            clearTimeout(problemTimeout);
            problemTimeout = setTimeout(() => {
                checkAnswer(true);
            }, 10000);
        }

        function checkAnswer(timeout = false) {
            clearTimeout(problemTimeout);
            const userAnswer = parseInt(input.value);

            if (!timeout && userAnswer === currentAnswer) {
                correct++;
                document.getElementById('math-correct').textContent = correct;
                document.getElementById('current-score').textContent = correct;
            }

            setTimeout(() => {
                generateProblem();
            }, 300);
        }

        function endGame() {
            clearInterval(gameEngine.timer);
            clearTimeout(problemTimeout);
            
            const results = {
                gameId: 'mental-math',
                score: correct,
                maxScore: maxProblems,
                accuracy: Math.round((correct / maxProblems) * 100),
                level: gameEngine.level,
                timestamp: Date.now()
            };

            gameEngine.showResults(results);
        }
    },

    renderDualNBackStart(area) {
        area.innerHTML = `
            <div class="game-start">
                <div class="game-start-header">
                    <div class="game-start-icon">
                        <i class="ph ph-arrows-split"></i>
                    </div>
                    <h2 class="game-start-title">Dual N-Back</h2>
                    <p class="game-start-description">The gold standard of working memory training. Match positions and sounds N steps back.</p>
                </div>
                <div class="game-start-info">
                    <div class="info-card">
                        <i class="ph ph-repeat info-icon"></i>
                        <div class="info-value">20+N</div>
                        <div class="info-label">Rounds</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-trophy info-icon"></i>
                        <div class="info-value">${this.level}</div>
                        <div class="info-label">N-Back Level</div>
                    </div>
                    <div class="info-card">
                        <i class="ph ph-target info-icon"></i>
                        <div class="info-value">85%+</div>
                        <div class="info-label">Target</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="gameEngine.playDualNBack()">
                    <i class="ph ph-play"></i>
                    Start Training
                </button>
            </div>
        `;
    },

    playDualNBack() {
        const area = document.getElementById('game-area');
        const n = Math.min(this.level, 10);
        let currentRound = 0;
        const totalRounds = 20 + n;
        let positionHistory = [];
        let audioHistory = [];
        let correct = 0;
        let positionMatches = 0;
        let audioMatches = 0;

        const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const audioOptions = ['A', 'B', 'C', 'D'];

        area.innerHTML = `
            <div class="dual-nback-area">
                <div class="dual-nback-grid" id="nback-grid" style="grid-template-columns: repeat(3, 80px);">
                    ${positions.map(i => `<div class="nback-position" data-pos="${i}"></div>`).join('')}
                </div>
                <div style="margin: 20px 0;">
                    <span style="color: var(--text-secondary);">Round: </span>
                    <span id="nback-round" style="font-weight: 700; color: var(--accent-cyan);">0/${totalRounds}</span>
                    <span style="margin-left: 20px; color: var(--text-secondary);">N = </span>
                    <span style="font-weight: 700; color: var(--accent-violet);">${n}</span>
                </div>
                <div class="dual-nback-controls">
                    <button class="nback-btn" id="pos-match-btn" onclick="gameEngine.checkDualNBack('position')">
                        Position Match
                    </button>
                    <button class="nback-btn" id="audio-match-btn" onclick="gameEngine.checkDualNBack('audio')">
                        Audio Match
                    </button>
                </div>
                <div style="margin-top: 20px; display: flex; gap: 20px;">
                    <span>Position: <span id="nback-pos-correct" style="color: var(--accent-emerald);">0</span></span>
                    <span>Audio: <span id="nback-audio-correct" style="color: var(--accent-emerald);">0</span></span>
                </div>
            </div>
        `;

        const grid = document.getElementById('nback-grid');

        gameEngine.startTime = Date.now();
        gameEngine.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - gameEngine.startTime) / 1000);
            document.getElementById('game-timer').textContent = utils.formatTime(elapsed);
        }, 1000);

        // Play first round after delay
        setTimeout(() => playRound(), 1500);

        function playRound() {
            if (currentRound >= totalRounds) {
                endGame();
                return;
            }

            // Clear previous
            grid.querySelectorAll('.nback-position').forEach(p => {
                p.classList.remove('active', 'correct', 'wrong');
            });

            // Generate new position and audio
            const newPosition = positions[utils.randomInt(0, 8)];
            const newAudio = audioOptions[utils.randomInt(0, 3)];

            positionHistory.push(newPosition);
            audioHistory.push(newAudio);

            if (positionHistory.length > n + 1) {
                positionHistory.shift();
            }
            if (audioHistory.length > n + 1) {
                audioHistory.shift();
            }

            currentRound++;
            document.getElementById('nback-round').textContent = `${currentRound}/${totalRounds}`;

            // Show position
            grid.querySelector(`[data-pos="${newPosition}"]`).classList.add('active');

            // Play audio
            speakLetter(newAudio);

            setTimeout(() => {
                grid.querySelector(`[data-pos="${newPosition}"]`).classList.remove('active');
                
                if (currentRound < totalRounds) {
                    setTimeout(() => playRound(), 2000);
                }
            }, 500);
        }

        function speakLetter(letter) {
            const utterance = new SpeechSynthesisUtterance(letter);
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    },

    checkDualNBack(type) {
        const n = Math.min(this.level, 10);
        
        if (positionHistory.length < n + 1) return;

        const currentPos = positionHistory[positionHistory.length - 1];
        const nBackPos = positionHistory[positionHistory.length - 1 - n];
        const currentAudio = audioHistory[audioHistory.length - 1];
        const nBackAudio = audioHistory[audioHistory.length - 1 - n];

        if (type === 'position') {
            const isMatch = currentPos === nBackPos;
            if (isMatch) {
                positionMatches++;
                document.getElementById('nback-pos-correct').textContent = positionMatches;
                correct++;
            }
        } else {
            const isMatch = currentAudio === nBackAudio;
            if (isMatch) {
                audioMatches++;
                document.getElementById('nback-audio-correct').textContent = audioMatches;
                correct++;
            }
        }

        document.getElementById('current-score').textContent = correct;
    },

    renderGenericGameStart(area) {
        area.innerHTML = `
            <div class="game-start">
                <div class="game-start-header">
                    <div class="game-start-icon">
                        <i class="ph ${this.currentGame?.icon || 'ph-game-controller'}"></i>
                    </div>
                    <h2 class="game-start-title">${this.currentGame?.name || 'Game'}</h2>
                    <p class="game-start-description">${this.currentGame?.description || 'Get ready to train your brain!'}</p>
                </div>
                <button class="btn btn-primary btn-lg" onclick="gameEngine.startLevel()">
                    <i class="ph ph-play"></i>
                    Start Level ${this.level}
                </button>
            </div>
        `;
    },

    startLevel() {
        // Placeholder for other games
        toast.info('Coming Soon', 'This game is being developed. Check back soon!');
    },

    showResults(results) {
        const gameModal = document.getElementById('game-modal');
        
        // Save game results
        this.saveGameResults(results);

        // Calculate performance
        const performance = results.score / (results.maxScore || 1);
        const isWin = performance >= 0.7;
        const nextLevel = isWin ? this.level + 1 : this.level;

        // Determine difficulty adjustment
        let difficultyText = '';
        if (isWin && this.level < this.currentGame.levels) {
            difficultyText = '<span class="badge badge-emerald">Level Up! → ' + nextLevel + '</span>';
        } else if (!isWin && this.level > 1) {
            difficultyText = '<span class="badge badge-amber">Level Adjusted → ' + nextLevel + '</span>';
        }

        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <div class="game-results">
                <div class="results-header">
                    <div class="results-icon">
                        <i class="ph ${isWin ? 'ph-trophy' : 'ph-target'}"></i>
                    </div>
                    <h2 class="results-title">${isWin ? 'Great Job!' : 'Keep Practicing!'}</h2>
                    <p class="results-subtitle">${this.currentGame.name} - Level ${this.level}</p>
                </div>
                
                <div class="results-stats">
                    <div class="results-stat">
                        <div class="results-stat-value">${results.score}${results.maxScore ? '/' + results.maxScore : ''}</div>
                        <div class="results-stat-label">Score</div>
                    </div>
                    <div class="results-stat">
                        <div class="results-stat-value">${results.accuracy || Math.round(performance * 100)}%</div>
                        <div class="results-stat-label">Accuracy</div>
                    </div>
                    <div class="results-stat">
                        <div class="results-stat-value">${results.time ? utils.formatTime(results.time) : 'N/A'}</div>
                        <div class="results-stat-label">Time</div>
                    </div>
                    <div class="results-stat">
                        <div class="results-stat-value">${this.level}</div>
                        <div class="results-stat-label">Level</div>
                    </div>
                </div>

                ${difficultyText ? '<div style="text-align: center; margin-bottom: 20px;">' + difficultyText + '</div>' : ''}

                <div class="results-actions">
                    <button class="btn btn-secondary" onclick="gameEngine.quit()">
                        <i class="ph ph-arrow-left"></i>
                        Back to Games
                    </button>
                    <button class="btn btn-primary" onclick="gameEngine.start('${results.gameId}', ${nextLevel})">
                        <i class="ph ph-arrow-right"></i>
                        Play Again
                    </button>
                </div>
            </div>
        `;
    },

    async saveGameResults(results) {
        const gameId = results.gameId;
        const gameProgress = state.userData?.progress?.games?.[gameId] || {
            currentLevel: this.level,
            highScore: 0,
            totalPlays: 0,
            bestTime: Infinity,
            accuracy: 0,
            history: []
        };

        // Update progress
        gameProgress.totalPlays++;
        gameProgress.currentLevel = this.level;
        gameProgress.highScore = Math.max(gameProgress.highScore || 0, results.score);
        if (results.time && results.time < (gameProgress.bestTime || Infinity)) {
            gameProgress.bestTime = results.time;
        }

        // Calculate new accuracy (rolling average)
        const prevAccuracy = gameProgress.accuracy || 0;
        gameProgress.accuracy = Math.round((prevAccuracy * (gameProgress.totalPlays - 1) + (results.accuracy || 0)) / gameProgress.totalPlays);

        // Add to history
        gameProgress.history = [...(gameProgress.history || []), results].slice(-10);

        // Update in Firebase
        await authSystem.updateUserData({
            [`progress.games.${gameId}`]: gameProgress,
            'progress.lastPlayedDate': utils.getDateString()
        });

        // Check for achievements
        this.checkAchievements(gameId, gameProgress);
    },

    checkAchievements(gameId, gameProgress) {
        const achievements = state.userData?.achievements || {};
        
        // First game
        if (!achievements.firstGame && gameProgress.totalPlays >= 1) {
            achievements.firstGame = { unlocked: true, unlockedAt: Date.now() };
            toast.success('Achievement Unlocked!', 'First Game - You played your first brain training game!');
        }

        // 10 games
        if (!achievements.tenGames && gameProgress.totalPlays >= 10) {
            achievements.tenGames = { unlocked: true, unlockedAt: Date.now() };
            toast.success('Achievement Unlocked!', 'Dedicated - You played 10 games!');
        }

        // Update achievements
        authSystem.updateUserData({ achievements });
    },

    quit() {
        clearInterval(this.timer);
        this.currentGame = null;
        this.paused = false;
        document.getElementById('game-modal').classList.add('hidden');
        router.navigate('games');
    },

    togglePause() {
        this.paused = !this.paused;
        document.getElementById('game-pause').textContent = this.paused ? 'Resume' : 'Pause';
    }
};

// ===================================
// Page Renderers
// ===================================
async function renderDashboard() {
    const main = document.getElementById('main-content');
    
    // Calculate brain age
    const brainAge = state.userData?.progress?.brainAge || 50;
    const streak = state.streak || 0;
    const gamesPlayed = Object.values(state.userData?.progress?.games || {}).reduce((sum, g) => sum + (g.totalPlays || 0), 0);

    // Get today's workout recommendation
    const recommendation = getAIRecommendation();

    main.innerHTML = `
        <div class="page" id="dashboard-page">
            <div class="page-header">
                <h1 class="page-title gradient-text">Welcome back, ${state.userData?.profile?.name || 'Champion'}!</h1>
                <p class="page-subtitle">Ready to train your brain today?</p>
            </div>

            <div class="page-grid" style="grid-template-columns: 1fr 1fr; gap: 24px;">
                <!-- Brain Age Display -->
                <div class="brain-age-display">
                    <div class="brain-age-value">${brainAge}</div>
                    <div class="brain-age-label">Your Brain Age</div>
                    <p class="brain-age-subtitle">${brainAge <= 30 ? 'Outstanding cognitive performance!' : brainAge <= 45 ? 'Above average brain health' : 'Room for improvement - keep training!'}</p>
                    <div class="brain-age-comparison">
                        <i class="ph ${brainAge < 50 ? 'ph-trend-down' : 'ph-trend-up'}"></i>
                        <span>${brainAge < 50 ? Math.abs(50 - brainAge) + ' years younger' : Math.abs(brainAge - 50) + ' years to improve'} than chronological age</span>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="quick-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="quick-stat">
                        <div class="quick-stat-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-amber);">
                            <i class="ph ph-fire"></i>
                        </div>
                        <div class="quick-stat-value">${streak}</div>
                        <div class="quick-stat-label">Day Streak</div>
                    </div>
                    <div class="quick-stat">
                        <div class="quick-stat-icon" style="background: rgba(168, 85, 247, 0.1); color: var(--accent-violet);">
                            <i class="ph ph-game-controller"></i>
                        </div>
                        <div class="quick-stat-value">${gamesPlayed}</div>
                        <div class="quick-stat-label">Games Played</div>
                    </div>
                    <div class="quick-stat">
                        <div class="quick-stat-icon">
                            <i class="ph ph-lightning"></i>
                        </div>
                        <div class="quick-stat-value">${getAverageReactionTime()}ms</div>
                        <div class="quick-stat-label">Avg Reaction</div>
                    </div>
                    <div class="quick-stat">
                        <div class="quick-stat-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald);">
                            <i class="ph ph-chart-line-up"></i>
                        </div>
                        <div class="quick-stat-value">${getImprovementPercentage()}%</div>
                        <div class="quick-stat-label">Improvement</div>
                    </div>
                </div>
            </div>

            <!-- Today's Workout -->
            <div class="today-workout card" style="margin-top: 24px;">
                <div class="workout-header">
                    <div class="workout-title">
                        <i class="ph ph-brain"></i>
                        Today's AI-Curated Workout
                    </div>
                    <span class="workout-time">~20 min</span>
                </div>
                
                <div class="workout-games">
                    ${recommendation.games.map(game => `
                        <div class="workout-game" onclick="gameEngine.start('${game.id}', ${game.level})">
                            <div class="workout-game-icon">
                                <i class="ph ${game.icon}"></i>
                            </div>
                            <div class="workout-game-info">
                                <div class="workout-game-name">${game.name}</div>
                                <div class="workout-game-meta">${game.category} • Level ${game.level}</div>
                            </div>
                            <span class="workout-game-badge ${game.focus === 'weak' ? 'weak' : 'strength'}">
                                ${game.focus === 'weak' ? 'Focus Area' : 'Strength'}
                            </span>
                        </div>
                    `).join('')}
                </div>

                <button class="btn btn-primary workout-start-btn" onclick="startRecommendedWorkout()">
                    <i class="ph ph-play"></i>
                    Start Today's Workout
                </button>
            </div>

            <!-- Weekly Overview -->
            <div class="weekly-overview card" style="margin-top: 24px;">
                <div class="weekly-header">
                    <h3 class="weekly-title">This Week</h3>
                    <div class="weekly-nav">
                        <button class="weekly-nav-btn"><i class="ph ph-caret-left"></i></button>
                        <button class="weekly-nav-btn"><i class="ph ph-caret-right"></i></button>
                    </div>
                </div>
                <div class="weekly-days">
                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                        const today = new Date().getDay();
                        const isToday = i === today;
                        const hasActivity = [1, 3, 4, 5].includes(i); // Simulated activity
                        return `
                            <div class="weekly-day ${isToday ? 'today' : ''} ${hasActivity ? 'completed' : ''}">
                                <div class="weekly-day-name">${day}</div>
                                <div class="weekly-day-date">${i + 1}</div>
                                <div class="weekly-day-indicator"></div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- AI Insights -->
            <div class="card" style="margin-top: 24px;">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="ph ph-sparkle"></i>
                        AI Insights
                    </h3>
                </div>
                <div class="insights-list">
                    ${getAIInsights().map(insight => `
                        <div class="insight-item">
                            <div class="insight-icon">
                                <i class="ph ${insight.icon}"></i>
                            </div>
                            <div class="insight-content">
                                <div class="insight-title">${insight.title}</div>
                                <div class="insight-text">${insight.text}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Update sidebar stats
    document.getElementById('streak-count').textContent = streak;
    document.getElementById('sidebar-brain-age').textContent = brainAge;
}

function getAIRecommendation() {
    const games = state.userData?.progress?.games || {};
    const categories = state.userData?.progress?.categories || {};
    
    // Find weakest category
    const categoryScores = Object.entries(categories).map(([name, data]) => ({
        name,
        score: data.score || 0
    })).sort((a, b) => a.score - b.score);

    const weakestCategory = categoryScores[0]?.name || 'speed';
    
    // Get games for recommendation
    const gameList = Object.entries(gameEngine.games).map(([id, game]) => ({
        id,
        ...game,
        level: games[id]?.currentLevel || 1,
        plays: games[id]?.totalPlays || 0
    }));

    // Prioritize weak categories (70%) and strengths (30%)
    const weakGames = gameList
        .filter(g => g.category === weakestCategory)
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 2);

    const strengthGames = gameList
        .filter(g => g.category !== weakestCategory && g.plays > 0)
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 1);

    const recommended = [...weakGames, ...strengthGames].slice(0, 3);

    return {
        games: recommended.map(game => ({
            ...game,
            focus: game.category === weakestCategory ? 'weak' : 'strength'
        })),
        focusArea: weakestCategory
    };
}

function getAIInsights() {
    const games = state.userData?.progress?.games || {};
    const habits = state.userData?.habits || {};
    
    const insights = [];

    // Reaction time insight
    const reactionGame = games['reaction-test'];
    if (reactionGame?.bestScore) {
        insights.push({
            icon: 'ph-lightning',
            title: 'Reaction Speed',
            text: `Your best reaction time is <span class="insight-value">${reactionGame.bestScore}ms</span>. ${reactionGame.bestScore < 250 ? 'Excellent reflexes!' : 'Keep practicing to improve!'}`
        });
    }

    // Memory insight
    const memoryGames = Object.entries(games)
        .filter(([id]) => ['grid-lock', 'card-cascade', 'echo-recall'].includes(id))
        .map(([id, data]) => data.accuracy || 0);
    
    if (memoryGames.length > 0) {
        const avgMemory = Math.round(memoryGames.reduce((a, b) => a + b, 0) / memoryGames.length);
        insights.push({
            icon: 'ph-brain',
            title: 'Memory Performance',
            text: `Your average memory accuracy is <span class="insight-value">${avgMemory}%</span>. ${avgMemory > 80 ? 'Outstanding retention!' : 'Memory games will help improve this!'}`
        });
    }

    // Streak insight
    if (state.streak > 0) {
        insights.push({
            icon: 'ph-fire',
            title: 'Consistency',
            text: `You're on a <span class="insight-value">${state.streak}-day streak</span>! ${state.streak >= 7 ? 'Amazing dedication!' : 'Keep it going!'}`
        });
    }

    // General tip
    insights.push({
        icon: 'ph-lightbulb',
        title: 'Daily Tip',
        text: 'Research shows that 20 minutes of daily brain training is more effective than 2 hours once a week. Consistency is key!'
    });

    return insights;
}

function getAverageReactionTime() {
    const games = state.userData?.progress?.games || {};
    const reactionGame = games['reaction-test'];
    return reactionGame?.bestScore || '---';
}

function getImprovementPercentage() {
    const history = state.userData?.progress?.brainAgeHistory || [];
    if (history.length < 2) return '0';
    
    const first = history[0];
    const last = history[history.length - 1];
    const improvement = Math.round(((first - last) / first) * 100);
    return improvement > 0 ? improvement : '0';
}

function startRecommendedWorkout() {
    const recommendation = getAIRecommendation();
    if (recommendation.games.length > 0) {
        const firstGame = recommendation.games[0];
        gameEngine.start(firstGame.id, firstGame.level);
    }
}

async function renderTraining() {
    const main = document.getElementById('main-content');
    const recommendation = getAIRecommendation();

    main.innerHTML = `
        <div class="page" id="training-page">
            <div class="training-header">
                <h1 class="page-title">Training Center</h1>
                <p class="page-subtitle">AI-powered brain training tailored to your needs</p>
                
                <div class="training-tabs">
                    <button class="training-tab active">Daily Workout</button>
                    <button class="training-tab">Free Play</button>
                    <button class="training-tab">Test Mode</button>
                </div>
            </div>

            <!-- AI Recommendation -->
            <div class="ai-recommendation">
                <div class="ai-header">
                    <div class="ai-icon">
                        <i class="ph ph-brain"></i>
                    </div>
                    <div>
                        <div class="ai-title">AI Training Recommendation</div>
                        <div class="ai-subtitle">Personalized based on your performance data</div>
                    </div>
                </div>
                
                <div class="ai-insight">
                    <p class="ai-insight-text">
                        Based on your recent training, I've identified <strong>${recommendation.focusArea}</strong> as your primary area for improvement. 
                        Today's workout focuses on strengthening this area while maintaining your other skills.
                    </p>
                </div>

                <div class="ai-focus-areas">
                    <span class="focus-tag">
                        <i class="ph ph-target"></i>
                        Focus: ${recommendation.focusArea}
                    </span>
                    <span class="focus-tag" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); color: var(--accent-emerald);">
                        <i class="ph ph-check-circle"></i>
                        3 Games Selected
                    </span>
                </div>
            </div>

            <!-- Daily Workout Games -->
            <h3 style="margin: 24px 0 16px;">Today's Workout</h3>
            <div class="games-grid">
                ${recommendation.games.map(game => `
                    <div class="game-card ${game.category}" onclick="gameEngine.start('${game.id}', ${game.level})">
                        <div class="game-card-icon">
                            <i class="ph ${game.icon}"></i>
                        </div>
                        <div class="game-card-name">${game.name}</div>
                        <div class="game-card-category">${game.category}</div>
                        <div class="game-card-stats">
                            <div class="game-stat">
                                <div class="game-stat-value">${game.level}</div>
                                <div class="game-stat-label">Level</div>
                            </div>
                            <div class="game-stat">
                                <div class="game-stat-value">${game.plays}</div>
                                <div class="game-stat-label">Plays</div>
                            </div>
                        </div>
                        <div class="game-card-progress">
                            <div class="progress-label">
                                <span>Progress</span>
                                <span>${Math.round(game.level / game.levels * 100)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.round(game.level / game.levels * 100)}%"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Start Workout Button -->
            <div style="text-align: center; margin-top: 32px;">
                <button class="btn btn-primary btn-lg" onclick="startRecommendedWorkout()">
                    <i class="ph ph-play"></i>
                    Begin Today's Training
                </button>
            </div>
        </div>
    `;
}

async function renderGames() {
    const main = document.getElementById('main-content');
    const games = state.userData?.progress?.games || {};
    
    const categories = [
        { id: 'all', name: 'All Games', icon: 'ph-squares-four' },
        { id: 'speed', name: 'Speed & Reflex', icon: 'ph-lightning' },
        { id: 'memory', name: 'Memory', icon: 'ph-brain' },
        { id: 'logic', name: 'Logic', icon: 'ph-puzzle-piece' },
        { id: 'psychology', name: 'Psychology', icon: 'ph-heart-half' },
        { id: 'superhuman', name: 'Superhuman', icon: 'ph-star' },
        { id: 'advanced', name: 'Advanced', icon: 'ph-rocket' }
    ];

    const gameList = Object.entries(gameEngine.games).map(([id, game]) => ({
        id,
        ...game,
        level: games[id]?.currentLevel || 1,
        plays: games[id]?.totalPlays || 0,
        highScore: games[id]?.highScore || 0,
        accuracy: games[id]?.accuracy || 0
    }));

    main.innerHTML = `
        <div class="page" id="games-page">
            <div class="page-header">
                <h1 class="page-title">Game Library</h1>
                <p class="page-subtitle">${gameList.length} brain training games across 6 categories</p>
            </div>

            <div class="games-filters">
                ${categories.map(cat => `
                    <button class="filter-btn active" data-category="${cat.id}">
                        <i class="ph ${cat.icon}"></i>
                        ${cat.name}
                    </button>
                `).join('')}
            </div>

            <div class="games-grid" id="games-grid">
                ${gameList.map(game => `
                    <div class="game-card ${game.category}" data-game="${game.id}" onclick="gameEngine.start('${game.id}', ${game.level})">
                        <div class="game-card-icon">
                            <i class="ph ${game.icon}"></i>
                        </div>
                        <div class="game-card-name">${game.name}</div>
                        <div class="game-card-category">${game.category}</div>
                        <div class="game-card-stats">
                            <div class="game-stat">
                                <div class="game-stat-value">${game.level}</div>
                                <div class="game-stat-label">Level</div>
                            </div>
                            <div class="game-stat">
                                <div class="game-stat-value">${game.plays}</div>
                                <div class="game-stat-label">Plays</div>
                            </div>
                            <div class="game-stat">
                                <div class="game-stat-value">${game.accuracy}%</div>
                                <div class="game-stat-label">Acc</div>
                            </div>
                        </div>
                        <div class="game-card-progress">
                            <div class="progress-label">
                                <span>Level Progress</span>
                                <span>${Math.round(game.level / game.levels * 100)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.round(game.level / game.levels * 100)}%"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            document.querySelectorAll('.game-card').forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

async function renderAnalytics() {
    const main = document.getElementById('main-content');
    const brainAge = state.userData?.progress?.brainAge || 50;
    const games = state.userData?.progress?.games || {};
    const categories = state.userData?.progress?.categories || {};

    main.innerHTML = `
        <div class="page" id="analytics-page">
            <div class="page-header">
                <h1 class="page-title">Analytics</h1>
                <p class="page-subtitle">Track your cognitive improvement over time</p>
            </div>

            <!-- Stats Overview -->
            <div class="stats-grid" style="margin-bottom: 24px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="ph ph-brain"></i> Brain Age</span>
                    </div>
                    <div class="card-value gradient-text">${brainAge}</div>
                    <div class="card-trend up">
                        <i class="ph ph-trend-down"></i>
                        <span>-5 from baseline</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="ph ph-calendar-check"></i> Training Days</span>
                    </div>
                    <div class="card-value">${state.streak}</div>
                    <div class="card-trend up">
                        <i class="ph ph-fire"></i>
                        <span>Current streak</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="ph ph-trophy"></i> High Scores</span>
                    </div>
                    <div class="card-value">${Object.values(games).reduce((sum, g) => sum + (g.highScore || 0), 0)}</div>
                    <div class="card-trend">
                        <span class="text-muted">Total points</span>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="ph ph-chart-line"></i> Avg Accuracy</span>
                    </div>
                    <div class="card-value">${Math.round(Object.values(games).reduce((sum, g) => sum + (g.accuracy || 0), 0) / Math.max(Object.keys(games).length, 1))}%</div>
                    <div class="card-trend up">
                        <i class="ph ph-trend-up"></i>
                        <span>+3% this week</span>
                    </div>
                </div>
            </div>

            <!-- Category Breakdown -->
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-header">
                        <h3 class="analytics-title">
                            <i class="ph ph-chart-polar"></i>
                            Category Performance
                        </h3>
                    </div>
                    <div class="category-breakdown">
                        ${Object.entries(categories).map(([name, data]) => `
                            <div class="category-row">
                                <span class="category-name">${name.charAt(0).toUpperCase() + name.slice(1)}</span>
                                <div class="category-bar-container">
                                    <div class="category-bar ${name}" style="width: ${data.score || 0}%"></div>
                                </div>
                                <span class="category-value">${data.score || 0}</span>
                            </div>
                        `).join('')}
                        ${['speed', 'memory', 'logic', 'psychology', 'superhuman', 'advanced'].filter(c => !categories[c]).map(c => `
                            <div class="category-row">
                                <span class="category-name">${c.charAt(0).toUpperCase() + c.slice(1)}</span>
                                <div class="category-bar-container">
                                    <div class="category-bar ${c}" style="width: 0%"></div>
                                </div>
                                <span class="category-value">0</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Radar Chart -->
                <div class="analytics-card">
                    <div class="analytics-header">
                        <h3 class="analytics-title">
                            <i class="ph ph-chart-pie"></i>
                            Cognitive Radar
                        </h3>
                    </div>
                    <div class="radar-chart">
                        <svg viewBox="0 0 200 200" width="200" height="200">
                            <defs>
                                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.3"/>
                                    <stop offset="100%" stop-color="#a855f7" stop-opacity="0.3"/>
                                </linearGradient>
                            </defs>
                            <!-- Background circles -->
                            ${[20, 40, 60, 80, 100].map(r => `
                                <circle cx="100" cy="100" r="${r}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                            `).join('')}
                            <!-- Axes -->
                            ${[0, 60, 120, 180, 240, 300].map(angle => {
                                const x = 100 + 100 * Math.cos((angle - 90) * Math.PI / 180);
                                const y = 100 + 100 * Math.sin((angle - 90) * Math.PI / 180);
                                return `<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
                            }).join('')}
                            <!-- Data polygon -->
                            <polygon 
                                points="${getRadarPoints()}" 
                                fill="url(#radarGradient)" 
                                stroke="#00d4ff" 
                                stroke-width="2"
                            />
                            <!-- Labels -->
                            ${['Speed', 'Memory', 'Logic', 'Psych', 'Super', 'Advanced'].map((label, i) => {
                                const angle = (i * 60 - 90) * Math.PI / 180;
                                const x = 100 + 115 * Math.cos(angle);
                                const y = 100 + 115 * Math.sin(angle);
                                return `<text x="${x}" y="${y}" text-anchor="middle" fill="#8888a0" font-size="10">${label}</text>`;
                            }).join('')}
                        </svg>
                    </div>
                </div>

                <!-- Insights -->
                <div class="analytics-card full-width">
                    <div class="analytics-header">
                        <h3 class="analytics-title">
                            <i class="ph ph-sparkle"></i>
                            Insights & Correlations
                        </h3>
                    </div>
                    <div class="insights-list">
                        <div class="insight-item">
                            <div class="insight-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-amber);">
                                <i class="ph ph-moon"></i>
                            </div>
                            <div class="insight-content">
                                <div class="insight-title">Sleep Impact</div>
                                <div class="insight-text">Your reaction time is <span class="insight-value">14% slower</span> when sleeping under 6 hours. Aim for 7-8 hours for optimal performance.</div>
                            </div>
                        </div>
                        <div class="insight-item">
                            <div class="insight-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald);">
                                <i class="ph ph-barbell"></i>
                            </div>
                            <div class="insight-content">
                                <div class="insight-title">Exercise Boost</div>
                                <div class="insight-text">Days with 30+ minutes of exercise show <span class="insight-value">23% better memory scores</span>. Keep moving!</div>
                            </div>
                        </div>
                        <div class="insight-item">
                            <div class="insight-icon">
                                <i class="ph ph-calendar"></i>
                            </div>
                            <div class="insight-content">
                                <div class="insight-title">Best Training Time</div>
                                <div class="insight-text">Your performance peaks between <span class="insight-value">9-11 AM</span>. Schedule challenging tasks during this window.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getRadarPoints() {
    const categories = state.userData?.progress?.categories || {};
    const scores = [
        categories.speed?.score || 0,
        categories.memory?.score || 0,
        categories.logic?.score || 0,
        categories.psychology?.score || 0,
        categories.superhuman?.score || 0,
        categories.advanced?.score || 0
    ];
    
    return scores.map((score, i) => {
        const angle = (i * 60 - 90) * Math.PI / 180;
        const r = Math.max(score, 10); // Minimum radius
        const x = 100 + r * Math.cos(angle);
        const y = 100 + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');
}

async function renderHabits() {
    const main = document.getElementById('main-content');
    const today = utils.getDateString();
    const todayHabits = state.userData?.habits?.[today] || {};

    main.innerHTML = `
        <div class="page" id="habits-page">
            <div class="page-header">
                <h1 class="page-title">Life Habits</h1>
                <p class="page-subtitle">Track habits that impact your brain performance</p>
            </div>

            <div class="habits-grid">
                <!-- Sleep -->
                <div class="habit-card">
                    <div class="habit-card-header">
                        <div>
                            <div class="habit-icon" style="background: rgba(168, 85, 247, 0.1); color: var(--accent-violet);">
                                <i class="ph ph-moon-stars"></i>
                            </div>
                        </div>
                        <div class="habit-toggle ${todayHabits.sleep ? 'active' : ''}" onclick="toggleHabit('sleep')"></div>
                    </div>
                    <h3 class="habit-title">Sleep (7-9 hours)</h3>
                    <p class="habit-description">Quality sleep is the #1 factor for cognitive performance.</p>
                    <div class="habit-input-group">
                        <input type="number" placeholder="Hours" id="sleep-input" value="${todayHabits.sleep || ''}" min="0" max="12">
                        <button class="btn btn-primary" onclick="saveHabit('sleep')">Save</button>
                    </div>
                </div>

                <!-- Exercise -->
                <div class="habit-card">
                    <div class="habit-card-header">
                        <div>
                            <div class="habit-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald);">
                                <i class="ph ph-barbell"></i>
                            </div>
                        </div>
                        <div class="habit-toggle ${todayHabits.exercise ? 'active' : ''}" onclick="toggleHabit('exercise')"></div>
                    </div>
                    <h3 class="habit-title">Exercise (30+ min)</h3>
                    <p class="habit-description">Physical activity increases BDNF for brain growth.</p>
                    <div class="habit-input-group">
                        <input type="number" placeholder="Minutes" id="exercise-input" value="${todayHabits.exercise || ''}" min="0" max="180">
                        <button class="btn btn-primary" onclick="saveHabit('exercise')">Save</button>
                    </div>
                </div>

                <!-- Water -->
                <div class="habit-card">
                    <div class="habit-card-header">
                        <div>
                            <div class="habit-icon" style="background: rgba(0, 212, 255, 0.1); color: var(--accent-cyan);">
                                <i class="ph ph-drop"></i>
                            </div>
                        </div>
                        <div class="habit-toggle ${todayHabits.water ? 'active' : ''}" onclick="toggleHabit('water')"></div>
                    </div>
                    <h3 class="habit-title">Hydration (8+ glasses)</h3>
                    <p class="habit-description">Even 2% dehydration slows reaction time.</p>
                    <div class="habit-input-group">
                        <input type="number" placeholder="Glasses" id="water-input" value="${todayHabits.water || ''}" min="0" max="20">
                        <button class="btn btn-primary" onclick="saveHabit('water')">Save</button>
                    </div>
                </div>

                <!-- No Scroll -->
                <div class="habit-card">
                    <div class="habit-card-header">
                        <div>
                            <div class="habit-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--accent-red);">
                                <i class="ph ph-device-mobile"></i>
                            </div>
                        </div>
                        <div class="habit-toggle ${todayHabits.noScroll ? 'active' : ''}" onclick="toggleHabit('noScroll')"></div>
                    </div>
                    <h3 class="habit-title">No Screen Before Bed</h3>
                    <p class="habit-description">Avoid scrolling 1 hour before sleep for better rest.</p>
                    <div class="habit-input-group">
                        <button class="btn btn-${todayHabits.noScroll ? 'success' : 'secondary'}" onclick="toggleHabitAndSave('noScroll')">
                            ${todayHabits.noScroll ? '<i class="ph ph-check"></i> Done!' : 'Mark as Complete'}
                        </button>
                    </div>
                </div>

                <!-- Mood -->
                <div class="habit-card">
                    <div class="habit-card-header">
                        <div>
                            <div class="habit-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--accent-amber);">
                                <i class="ph ph-smiley"></i>
                            </div>
                        </div>
                    </div>
                    <h3 class="habit-title">How Are You Feeling?</h3>
                    <p class="habit-description">Track your mood to see correlations with performance.</p>
                    <div class="habit-input-group" style="justify-content: center; gap: 8px;">
                        ${[1, 2, 3, 4, 5].map(mood => `
                            <button class="btn btn-sm ${todayHabits.mood == mood ? 'btn-primary' : 'btn-secondary'}" onclick="saveHabit('mood', ${mood})">
                                ${mood === 1 ? '😫' : mood === 2 ? '😕' : mood === 3 ? '😐' : mood === 4 ? '😊' : '😄'}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Readiness Test -->
                <div class="habit-card" style="grid-column: span 2;">
                    <div class="habit-card-header">
                        <div>
                            <div class="habit-icon">
                                <i class="ph ph-lightning"></i>
                            </div>
                        </div>
                    </div>
                    <h3 class="habit-title">Quick Readiness Check</h3>
                    <p class="habit-description">Measure your current reaction time to start the day.</p>
                    <div style="text-align: center; margin-top: 16px;">
                        <button class="btn btn-primary btn-lg" onclick="gameEngine.start('reaction-test', 1)">
                            <i class="ph ph-play"></i>
                            Take Reaction Test
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function saveHabit(type, value) {
    const today = utils.getDateString();
    const input = document.getElementById(`${type}-input`);
    const habitValue = value !== undefined ? value : parseFloat(input?.value) || 0;
    
    const habits = state.userData?.habits || {};
    habits[today] = habits[today] || {};
    habits[today][type] = habitValue;

    await authSystem.updateUserData({ habits });
    toast.success('Saved!', `${type} recorded for today`);
    
    // Refresh page
    renderHabits();
}

function toggleHabit(type) {
    const toggle = event.target;
    toggle.classList.toggle('active');
}

async function toggleHabitAndSave(type) {
    const today = utils.getDateString();
    const habits = state.userData?.habits || {};
    habits[today] = habits[today] || {};
    habits[today][type] = !habits[today][type];
    
    await authSystem.updateUserData({ habits });
    renderHabits();
}

async function renderAchievements() {
    const main = document.getElementById('main-content');
    const achievements = state.userData?.achievements || {};
    const games = state.userData?.progress?.games || {};

    const achievementList = [
        { id: 'firstGame', icon: 'ph-game-controller', name: 'First Steps', desc: 'Complete your first brain training game', condition: () => Object.values(games).some(g => g.totalPlays >= 1) },
        { id: 'tenGames', icon: 'ph-fire', name: 'Dedicated', desc: 'Complete 10 total games', condition: () => Object.values(games).reduce((sum, g) => sum + (g.totalPlays || 0), 0) >= 10 },
        { id: 'fiftyGames', icon: 'ph-trophy', name: 'Committed', desc: 'Complete 50 total games', condition: () => Object.values(games).reduce((sum, g) => sum + (g.totalPlays || 0), 0) >= 50 },
        { id: 'hundredGames', icon: 'ph-medal', name: 'Brain Warrior', desc: 'Complete 100 total games', condition: () => Object.values(games).reduce((sum, g) => sum + (g.totalPlays || 0), 0) >= 100 },
        { id: 'weekStreak', icon: 'ph-calendar-check', name: 'Consistent', desc: 'Maintain a 7-day training streak', condition: () => state.streak >= 7 },
        { id: 'monthStreak', icon: 'ph-calendar-star', name: 'Unstoppable', desc: 'Maintain a 30-day training streak', condition: () => state.streak >= 30 },
        { id: 'allCategories', icon: 'ph-sparkle', name: 'Well Rounded', desc: 'Play at least one game in each category', condition: () => false },
        { id: 'levelTen', icon: 'ph-arrow-up', name: 'Rising Star', desc: 'Reach level 10 in any game', condition: () => Object.values(games).some(g => g.currentLevel >= 10) },
        { id: 'levelTwentyFive', icon: 'ph-star', name: 'Expert', desc: 'Reach level 25 in any game', condition: () => Object.values(games).some(g => g.currentLevel >= 25) },
        { id: 'brainAge30', icon: 'ph-brain', name: 'Young Mind', desc: 'Achieve a brain age of 30 or younger', condition: () => (state.userData?.progress?.brainAge || 50) <= 30 },
        { id: 'perfectScore', icon: 'ph-target', name: 'Perfectionist', desc: 'Score 100% accuracy on any game', condition: () => Object.values(games).some(g => g.accuracy === 100) },
        { id: 'speedDemon', icon: 'ph-lightning', name: 'Speed Demon', desc: 'Achieve reaction time under 200ms', condition: () => (games['reaction-test']?.bestScore || 999) < 200 }
    ];

    main.innerHTML = `
        <div class="page" id="achievements-page">
            <div class="page-header">
                <h1 class="page-title">Achievements</h1>
                <p class="page-subtitle">Track your milestones and accomplishments</p>
            </div>

            <div class="achievements-grid">
                ${achievementList.map(ach => {
                    const unlocked = achievements[ach.id]?.unlocked || ach.condition();
                    const unlockedAt = achievements[ach.id]?.unlockedAt;
                    return `
                        <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                            <div class="achievement-icon">
                                <i class="ph ${ach.icon}"></i>
                            </div>
                            <h3 class="achievement-name">${ach.name}</h3>
                            <p class="achievement-description">${ach.desc}</p>
                            ${unlocked ? `
                                <div class="achievement-date">
                                    <i class="ph ph-check-circle"></i>
                                    Unlocked ${unlockedAt ? utils.formatDate(unlockedAt) : 'today'}
                                </div>
                            ` : `
                                <div class="achievement-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 0%"></div>
                                    </div>
                                </div>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

async function renderSettings() {
    const main = document.getElementById('main-content');
    const profile = state.userData?.profile || {};
    const settings = state.userData?.settings || {};

    main.innerHTML = `
        <div class="page" id="settings-page">
            <div class="page-header">
                <h1 class="page-title">Settings</h1>
                <p class="page-subtitle">Manage your account and preferences</p>
            </div>

            <!-- Profile Card -->
            <div class="profile-card">
                <div class="profile-avatar">
                    ${profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div class="profile-info">
                    <div class="profile-name">${profile.name || 'User'}</div>
                    <div class="profile-email">${profile.email || state.user?.email || 'No email'}</div>
                    <div class="profile-since">Training since ${profile.createdAt ? utils.formatDate(profile.createdAt.toDate?.() || profile.createdAt) : 'recently'}</div>
                </div>
            </div>

            <!-- Training Settings -->
            <div class="settings-section">
                <h3 class="settings-title">Training Preferences</h3>
                
                <div class="settings-row">
                    <div class="settings-label">
                        <span class="settings-label-title">Daily Goal</span>
                        <span class="settings-label-desc">Target training minutes per day</span>
                    </div>
                    <select class="form-select" id="daily-goal" onchange="updateSetting('dailyGoalMinutes', this.value)">
                        <option value="10" ${settings.dailyGoalMinutes === 10 ? 'selected' : ''}>10 minutes</option>
                        <option value="20" ${settings.dailyGoalMinutes === 20 ? 'selected' : ''}>20 minutes</option>
                        <option value="30" ${settings.dailyGoalMinutes === 30 ? 'selected' : ''}>30 minutes</option>
                        <option value="45" ${settings.dailyGoalMinutes === 45 ? 'selected' : ''}>45 minutes</option>
                        <option value="60" ${settings.dailyGoalMinutes === 60 ? 'selected' : ''}>60 minutes</option>
                    </select>
                </div>

                <div class="settings-row">
                    <div class="settings-label">
                        <span class="settings-label-title">Sound Effects</span>
                        <span class="settings-label-desc">Play sounds during games</span>
                    </div>
                    <div class="toggle ${settings.soundEnabled !== false ? 'active' : ''}" onclick="updateToggle('soundEnabled', this)"></div>
                </div>

                <div class="settings-row">
                    <div class="settings-label">
                        <span class="settings-label-title">Notifications</span>
                        <span class="settings-label-desc">Daily training reminders</span>
                    </div>
                    <div class="toggle ${settings.notificationsEnabled ? 'active' : ''}" onclick="updateToggle('notificationsEnabled', this)"></div>
                </div>
            </div>

            <!-- Data Management -->
            <div class="settings-section">
                <h3 class="settings-title">Data Management</h3>
                
                <div class="settings-row">
                    <div class="settings-label">
                        <span class="settings-label-title">Export Data</span>
                        <span class="settings-label-desc">Download all your training data</span>
                    </div>
                    <button class="btn btn-secondary" onclick="exportData()">
                        <i class="ph ph-download"></i>
                        Export
                    </button>
                </div>

                <div class="settings-row">
                    <div class="settings-label">
                        <span class="settings-label-title">Clear All Data</span>
                        <span class="settings-label-desc">Permanently delete all your data</span>
                    </div>
                    <button class="btn btn-danger" onclick="confirmClearData()">
                        <i class="ph ph-trash"></i>
                        Clear
                    </button>
                </div>
            </div>

            <!-- Account -->
            <div class="settings-section">
                <h3 class="settings-title">Account</h3>
                
                <div class="settings-row">
                    <div class="settings-label">
                        <span class="settings-label-title">Sign Out</span>
                        <span class="settings-label-desc">Sign out of your account</span>
                    </div>
                    <button class="btn btn-ghost" onclick="authSystem.logout()">
                        <i class="ph ph-sign-out"></i>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function updateSetting(key, value) {
    const settings = state.userData?.settings || {};
    settings[key] = parseInt(value);
    await authSystem.updateUserData({ settings });
    toast.success('Saved', 'Settings updated');
}

async function updateToggle(key, element) {
    element.classList.toggle('active');
    const value = element.classList.contains('active');
    const settings = state.userData?.settings || {};
    settings[key] = value;
    await authSystem.updateUserData({ settings });
}

function exportData() {
    const data = JSON.stringify(state.userData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vidyun-manas-data-${utils.getDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported!', 'Your data has been downloaded');
}

function confirmClearData() {
    modal.open(`
        <p style="margin-bottom: 20px;">Are you sure you want to delete all your data? This action cannot be undone.</p>
        <p style="color: var(--accent-red); font-size: 0.875rem;">This will permanently delete all your progress, achievements, and training data.</p>
    `, { title: 'Clear All Data?', size: 'small' });
    
    modal.content.innerHTML += `
        <div class="modal-footer" style="margin-top: 20px;">
            <button class="btn btn-ghost" onclick="modal.close()">Cancel</button>
            <button class="btn btn-danger" onclick="clearAllData()">Delete Everything</button>
        </div>
    `;
}

async function clearAllData() {
    if (!state.user) return;
    
    try {
        await db.collection('users').doc(state.user.uid).delete();
        await authSystem.logout();
        modal.close();
        toast.success('Cleared', 'All data has been deleted');
    } catch (error) {
        toast.error('Error', 'Failed to delete data');
    }
}

async function renderWeeklyReview() {
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <div class="page" id="weekly-review-page">
            <div class="weekly-review">
                <div class="review-header">
                    <h1 class="review-title gradient-text">Weekly Review</h1>
                    <p class="review-date">${utils.formatDate(new Date())}</p>
                </div>

                <div class="review-summary">
                    <div class="review-stat">
                        <div class="review-stat-value">${state.streak}</div>
                        <div class="review-stat-label">Day Streak</div>
                    </div>
                    <div class="review-stat">
                        <div class="review-stat-value">${Object.values(state.userData?.progress?.games || {}).reduce((sum, g) => sum + (g.totalPlays || 0), 0)}</div>
                        <div class="review-stat-label">Games Completed</div>
                    </div>
                    <div class="review-stat">
                        <div class="review-stat-value">${state.userData?.progress?.brainAge || '--'}</div>
                        <div class="review-stat-label">Brain Age</div>
                    </div>
                </div>

                <div class="review-highlights">
                    <h3 class="review-section-title">This Week's Highlights</h3>
                    <div class="highlights-list">
                        <div class="highlight-item">
                            <div class="highlight-icon">
                                <i class="ph ph-trophy"></i>
                            </div>
                            <div class="highlight-content">
                                <div class="highlight-title">Best Performance</div>
                                <div class="highlight-text">Reaction time improved to ${state.userData?.progress?.games?.['reaction-test']?.bestScore || '--'}ms</div>
                            </div>
                        </div>
                        <div class="highlight-item">
                            <div class="highlight-icon">
                                <i class="ph ph-fire"></i>
                            </div>
                            <div class="highlight-content">
                                <div class="highlight-title">Consistency</div>
                                <div class="highlight-text">${state.streak >= 7 ? 'Amazing! You maintained your streak all week!' : 'Keep training daily to build your streak!'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="review-next-week">
                    <h3 class="review-section-title">Next Week's Focus</h3>
                    <div class="next-week-focus">
                        ${getAIRecommendation().games.slice(0, 2).map(game => `
                            <span class="focus-item">
                                <i class="ph ${game.icon}"></i>
                                ${game.name}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div style="text-align: center; margin-top: 32px;">
                    <button class="btn btn-primary btn-lg" onclick="router.navigate('training')">
                        <i class="ph ph-play"></i>
                        Start Next Week Strong
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===================================
// UI Functions
// ===================================
function showAuthScreen() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
    document.getElementById('loading-screen').classList.add('hidden');
}

function showApp() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('loading-screen').classList.add('hidden');
    
    // Navigate to dashboard
    router.navigate('dashboard');
}

function hideLoading() {
    document.getElementById('loading-screen').classList.add('hidden');
}

// ===================================
// Event Listeners
// ===================================
function setupEventListeners() {
    // Auth forms
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    // Login
    document.getElementById('login-btn').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = document.getElementById('login-btn');
        const errorEl = document.getElementById('auth-error');

        if (!email || !password) {
            errorEl.textContent = 'Please enter both email and password';
            errorEl.classList.remove('hidden');
            return;
        }

        btn.querySelector('.btn-text').classList.add('hidden');
        btn.querySelector('.btn-loader').classList.remove('hidden');
        btn.disabled = true;
        errorEl.classList.add('hidden');

        try {
            await authSystem.login(email, password);
            showApp();
        } catch (error) {
            errorEl.textContent = 'Invalid email or password';
            errorEl.classList.remove('hidden');
        } finally {
            btn.querySelector('.btn-text').classList.remove('hidden');
            btn.querySelector('.btn-loader').classList.add('hidden');
            btn.disabled = false;
        }
    });

    // Register
    document.getElementById('register-btn').addEventListener('click', async () => {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const goal = document.getElementById('register-goal').value;
        const btn = document.getElementById('register-btn');
        const errorEl = document.getElementById('auth-error');

        if (!name || !email || !password) {
            errorEl.textContent = 'Please fill in all fields';
            errorEl.classList.remove('hidden');
            return;
        }

        if (password.length < 8) {
            errorEl.textContent = 'Password must be at least 8 characters';
            errorEl.classList.remove('hidden');
            return;
        }

        btn.querySelector('.btn-text').classList.add('hidden');
        btn.querySelector('.btn-loader').classList.remove('hidden');
        btn.disabled = true;
        errorEl.classList.add('hidden');

        try {
            await authSystem.register(email, password, name, goal);
            showApp();
        } catch (error) {
            errorEl.textContent = error.message || 'Registration failed. Please try again.';
            errorEl.classList.remove('hidden');
        } finally {
            btn.querySelector('.btn-text').classList.remove('hidden');
            btn.querySelector('.btn-loader').classList.add('hidden');
            btn.disabled = false;
        }
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => authSystem.logout());

    // Modal backdrop close
    document.querySelector('.modal-backdrop')?.addEventListener('click', () => modal.close());

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.close();
        }
    });
}

// ===================================
// Initialization
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize utilities
    toast.init();
    modal.init();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize Firebase
    initializeFirebase();
    
    // Hide loading after a brief moment
    setTimeout(hideLoading, 1500);
    
    // Check auth state
    if (firebaseInitialized) {
        await authSystem.onAuthStateChanged((user) => {
            if (user) {
                showApp();
            } else {
                showAuthScreen();
            }
        });
    } else {
        // Firebase not configured, show setup instructions
        showAuthScreen();
        document.getElementById('auth-error').textContent = 'Firebase not configured. Please add your Firebase config in js/app.js';
        document.getElementById('auth-error').classList.remove('hidden');
    }
    
    // Initialize router
    router.init();
});

// Export for global access
window.toast = toast;
window.modal = modal;
window.router = router;
window.authSystem = authSystem;
window.gameEngine = gameEngine;
window.utils = utils;
window.state = state;
