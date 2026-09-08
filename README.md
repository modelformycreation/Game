> **Prototype status (2026-09-08):** This is incomplete and has known gameplay and security issues. Feature descriptions below include planned behavior, not verified functionality. See [HANDOFF.md](HANDOFF.md) for the current inventory, user-reported bugs, and next steps.

# Vidyun-manas 🧠

## World's Most Advanced AI-Driven Brain Training Platform

**Vidyun-manas** (Sanskrit: "Radiant Intellect") is a comprehensive cognitive enhancement system designed to transform your mental capabilities through personalized, adaptive brain training.

### 🚀 Features

- **23 Brain Training Games** across 6 categories:
  - Speed & Reflex (5 games)
  - Memory Masters (5 games)
  - Logic & Problem Solving (4 games)
  - Psychology & Mind (4 games)
  - Superhuman Skills (3 games)
  - Advanced Mastery (2 games)

- **AI-Powered Adaptive Training**
  - Personalized daily workouts based on your weak points
  - Automatic difficulty adjustment (staircase method)
  - Smart recommendations that evolve with your progress

- **Comprehensive Analytics**
  - Brain Age calculation
  - Category performance radar
  - Life-cognition correlation insights
  - Progress tracking over time

- **Life Habit Integration**
  - Sleep, exercise, hydration tracking
  - Correlation analysis between habits and brain performance
  - Readiness checks

- **Streak & Achievement System**
  - Daily training streaks
  - 12+ achievements to unlock
  - Progress milestones

### 🛠️ Setup Instructions

#### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** with Email/Password provider
4. Create a **Firestore Database** (start in test mode, then secure it)
5. Get your web app configuration

#### 2. Configure Firebase

Open `js/app.js` and replace the placeholder config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

#### 3. Secure Firestore Rules

In Firebase Console → Firestore → Rules, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### 4. Deploy

Option A: GitHub Pages (Free)
1. Push to GitHub
2. Enable GitHub Pages in repo settings
3. Your site will be at `https://username.github.io/Game/`

Option B: Local Development
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

### 🎮 Games

| Game | Category | Description |
|------|----------|-------------|
| Neural Snap | Speed | Click targets as fast as possible |
| Color Blitz | Speed | Match colors under time pressure |
| Rapid Math | Speed | Solve equations before time runs out |
| Sequence Break | Speed | Click numbers in order rapidly |
| Reaction Test | Speed | Measure reaction time |
| Grid Lock | Memory | Remember and recreate patterns |
| Card Cascade | Memory | Match pairs from memory |
| Echo Recall | Memory | Remember sequences |
| List Master | Memory | Remember growing lists |
| Memory Palace | Superhuman | Ancient memory technique training |
| Pattern Oracle | Logic | Find patterns in sequences |
| Cipher Cracker | Logic | Decode encrypted messages |
| Logic Grid | Logic | Solve complex logic puzzles |
| Binary Translator | Superhuman | Convert binary/hex mentally |
| Mental Math | Superhuman | Calculate large problems in head |
| Focus Zone | Psychology | Maintain concentration under distraction |
| Decision Dilemma | Psychology | Make optimal decisions quickly |
| Emotion Reader | Psychology | Read micro-expressions |
| Stress Test | Psychology | Perform under pressure |
| Dual N-Back | Advanced | Gold standard working memory |
| Calculation Pro | Advanced | Competition-level math |
| Visualization | Advanced | Mental 3D manipulation |
| Speed Reading | Advanced | Fast reading with comprehension |

### 🧪 The Science

Vidyun-manas is built on proven cognitive science:

- **Neuroplasticity**: The brain can change and grow at any age
- **Adaptive Difficulty**: Optimal challenge (not too easy, not too hard)
- **Spaced Repetition**: Strategic practice intervals
- **Staircase Method**: 3 wins → level up, 2 losses → level down
- **Consistency > Intensity**: Daily practice beats sporadic marathons

### 📊 Analytics Tracked

- Reaction time (ms)
- Memory accuracy (%)
- Logic accuracy (%)
- Processing speed
- Focus duration
- Decision quality
- Brain Age composite score

### 🔐 Security

- Passwords are hashed with SHA-256 + salt before storage
- Firebase Authentication handles sessions securely
- All user data is isolated to the authenticated user only
- Firestore security rules enforce access control

### 🎯 Usage Philosophy

1. **Baseline First**: Complete 5-day baseline testing to establish your starting numbers
2. **Daily Training**: 20-30 minutes of focused brain training
3. **AI Recommendations**: Follow the AI-curated workouts for optimal results
4. **Track Habits**: Log sleep, exercise, and hydration for correlation insights
5. **Weekly Review**: Check your weekly review every Sunday

### 📱 Responsive Design

- Desktop: Full sidebar navigation, keyboard shortcuts
- Tablet: Collapsible sidebar, touch-optimized
- Mobile: Bottom navigation, swipe gestures, large touch targets

### 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own brain training journey!

### 📄 License

MIT License - Train your brain freely!

---

**Remember**: The goal isn't to be perfect, it's to be better than yesterday. Consistency compounds. Every session counts. 🧠⚡
