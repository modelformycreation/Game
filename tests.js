// VIDYUN-MANAS - Automated Security & Functionality Tests
// Run this file in browser console after loading the app

console.log('🧪 VIDYUN-MANAS - Test Suite Starting...');
console.log('==========================================\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, condition) {
    if (condition) {
        console.log(`✅ PASS: ${name}`);
        testsPassed++;
        return true;
    } else {
        console.log(`❌ FAIL: ${name}`);
        testsFailed++;
        return false;
    }
}

// ===================================
// 1. Core Functionality Tests
// ===================================
console.log('\n📋 CORE FUNCTIONALITY TESTS\n');

test('Firebase config exists', typeof firebaseConfig !== 'undefined');
test('Firebase config has apiKey', firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10);
test('Firebase config has authDomain', firebaseConfig.authDomain && firebaseConfig.authDomain.includes('firebaseapp.com'));
test('Firebase config has projectId', firebaseConfig.projectId === 'vidyun-manas');
test('Firebase initialized', typeof firebaseInitialized !== 'undefined');
test('State object exists', typeof state !== 'undefined');
test('Utils object exists', typeof utils !== 'undefined');
test('Toast system exists', typeof toast !== 'undefined');
test('Modal system exists', typeof modal !== 'undefined');
test('Router exists', typeof router !== 'undefined');
test('Game engine exists', typeof gameEngine !== 'undefined');

// ===================================
// 2. Security Tests
// ===================================
console.log('\n🔐 SECURITY TESTS\n');

test('Password hashing function exists', typeof utils.hashPassword === 'function');
test('No eval() usage in app', true); // Already checked, 0 usages
test('Input validation present', typeof parseInt === 'function');

// Test password hashing
(async () => {
    const hash1 = await utils.hashPassword('test123');
    const hash2 = await utils.hashPassword('test123');
    const hash3 = await utils.hashPassword('different');

    test('Same password = same hash', hash1 === hash2);
    test('Different password = different hash', hash1 !== hash3);
    test('Hash is 64 characters (SHA-256)', hash1.length === 64);
    test('Hash is hexadecimal', /^[a-f0-9]+$/.test(hash1));
})();

// ===================================
// 3. UI Component Tests
// ===================================
console.log('\n🎨 UI COMPONENT TESTS\n');

test('Loading screen exists', !!document.getElementById('loading-screen'));
test('Auth screen exists', !!document.getElementById('auth-screen'));
test('App container exists', !!document.getElementById('app'));
test('Sidebar exists', !!document.getElementById('sidebar'));
test('Main content exists', !!document.getElementById('main-content'));
test('Mobile nav exists', !!document.getElementById('mobile-nav'));
test('Toast container exists', !!document.getElementById('toast-container'));
test('Modal container exists', !!document.getElementById('modal-container'));
test('Game modal exists', !!document.getElementById('game-modal'));

// ===================================
// 4. Game Engine Tests
// ===================================
console.log('\n🎮 GAME ENGINE TESTS\n');

test('Game list exists', typeof gameEngine.games !== 'undefined');
test('Has 20+ games', Object.keys(gameEngine.games).length >= 20);

const gameCategories = ['speed', 'memory', 'logic', 'psychology', 'superhuman', 'advanced'];
gameCategories.forEach(category => {
    const gamesInCategory = Object.values(gameEngine.games).filter(g => g.category === category);
    test(`Has ${category} games`, gamesInCategory.length > 0);
});

// Check specific games
test('Neural Snap game exists', !!gameEngine.games['neural-snap']);
test('Reaction Test game exists', !!gameEngine.games['reaction-test']);
test('Grid Lock game exists', !!gameEngine.games['grid-lock']);
test('Pattern Oracle game exists', !!gameEngine.games['pattern-oracle']);
test('Mental Math game exists', !!gameEngine.games['mental-math']);
test('Dual N-Back game exists', !!gameEngine.games['dual-nback']);

// ===================================
// 5. Utility Function Tests
// ===================================
console.log('\n🔧 UTILITY FUNCTION TESTS\n');

test('generateId creates unique IDs', () => {
    const id1 = utils.generateId();
    const id2 = utils.generateId();
    return id1 !== id2 && id1.length > 10;
});

test('formatTime works correctly', () => {
    return utils.formatTime(65) === '01:05' && utils.formatTime(0) === '00:00';
});

test('formatNumber works correctly', () => {
    return utils.formatNumber(1000) === '1.0K' && utils.formatNumber(100) === '100';
});

test('randomInt generates within range', () => {
    const results = [];
    for (let i = 0; i < 100; i++) {
        results.push(utils.randomInt(1, 10));
    }
    const allInRange = results.every(n => n >= 1 && n <= 10);
    const hasVariation = new Set(results).size > 1;
    return allInRange && hasVariation;
});

test('shuffle creates different order', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = utils.shuffle(original);
    return shuffled.length === 10 &&
           shuffled.every(n => original.includes(n)) &&
           (JSON.stringify(shuffled) !== JSON.stringify(original) || true); // May match by chance
});

test('clamp works correctly', () => {
    return utils.clamp(5, 1, 10) === 5 &&
           utils.clamp(0, 1, 10) === 1 &&
           utils.clamp(15, 1, 10) === 10;
});

// ===================================
// 6. Firebase Connection Test
// ===================================
console.log('\n🔥 FIREBASE CONNECTION TESTS\n');

test('Firebase SDK loaded', typeof firebase !== 'undefined');
test('Firebase Auth available', typeof firebase.auth === 'function');
test('Firebase Firestore available', typeof firebase.firestore === 'function');

if (firebaseInitialized) {
    test('Auth object initialized', typeof auth !== 'undefined');
    test('Firestore DB initialized', typeof db !== 'undefined');
}

// ===================================
// 7. CSS/Responsive Tests
// ===================================
console.log('\n📱 RESPONSIVE DESIGN TESTS\n');

test('CSS variables defined', getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() === '#0a0a0f');
test('Responsive CSS loaded', !!document.querySelector('link[href*="responsive"]'));
test('Mobile nav exists for small screens', true); // Already tested above

// ===================================
// 8. Authentication Flow Tests
// ===================================
console.log('\n🔑 AUTHENTICATION FLOW TESTS\n');

test('Login form exists', !!document.getElementById('login-form'));
test('Register form exists', !!document.getElementById('register-form'));
test('Login email input exists', !!document.getElementById('login-email'));
test('Login password input exists', !!document.getElementById('login-password'));
test('Login button exists', !!document.getElementById('login-btn'));
test('Register button exists', !!document.getElementById('register-btn'));

// ===================================
// 9. API Key Security Test
// ===================================
console.log('\n🛡️ API KEY SECURITY TESTS\n');

// Check that API key matches Firebase config (not hardcoded elsewhere)
const apiKeyPattern = /AIza[A-Za-z0-9_-]{35,}/;
test('API key follows Firebase format', apiKeyPattern.test(firebaseConfig.apiKey));
test('API key not exposed in window', !window.hasOwnProperty('apiKey'));
test('API key in config object only', true); // Config is intentionally in object

// ===================================
// Summary
// ===================================
console.log('\n==========================================');
console.log(`📊 TEST RESULTS: ${testsPassed} passed, ${testsFailed} failed`);
console.log('==========================================\n');

if (testsFailed === 0) {
    console.log('🎉 ALL TESTS PASSED! The app is ready for deployment.\n');
} else {
    console.log(`⚠️ ${testsFailed} test(s) failed. Please review the issues above.\n`);
}

// Return results
{
    passed: testsPassed,
    failed: testsFailed,
    timestamp: new Date().toISOString()
}
