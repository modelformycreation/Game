# VIDYUN-MANAS — World's Most Advanced AI-Driven Brain Training Platform

## 1. Concept & Vision

**VIDYUN-MANAS** (Sanskrit: "Radiant Intellect") is not just a brain training app — it's a complete cognitive transformation system designed for a single user who demands world-class mental performance. Unlike generic brain games, Vidyun-manas uses AI-driven adaptive algorithms to create personalized daily challenges that target your exact weak points, track your life habits alongside cognitive metrics, and prove measurable improvement through honest data. The platform feels like having a personal neuroscientist, data analyst, and life coach — all powered by Firebase for seamless cross-device access.

**Core Philosophy:** "Measure everything. Adapt constantly. Never plateau."

---

## 2. Design Language

### Aesthetic Direction
**Minimalist Dark Intelligence** — Clean, focused interface inspired by high-end scientific tools and modern AI dashboards. Dark theme reduces eye strain during extended sessions. Subtle neon accents (cyan, violet) indicate progress and achievements. No clutter, no distractions — pure cognitive training.

### Color Palette
- **Background Primary:** `#0a0a0f` (Deep space black)
- **Background Secondary:** `#12121a` (Card surfaces)
- **Background Tertiary:** `#1a1a24` (Elevated elements)
- **Text Primary:** `#e8e8f0` (High contrast white)
- **Text Secondary:** `#8888a0` (Muted descriptions)
- **Accent Primary:** `#00d4ff` (Cyan - speed/reaction)
- **Accent Secondary:** `#a855f7` (Violet - memory/logic)
- **Accent Tertiary:** `#10b981` (Emerald - achievements)
- **Accent Warning:** `#f59e0b` (Amber - caution)
- **Accent Danger:** `#ef4444` (Red - errors/high stress)
- **Success Gradient:** `linear-gradient(135deg, #00d4ff, #a855f7)`

### Typography
- **Primary Font:** 'Inter', sans-serif (clean, highly legible)
- **Mono Font:** 'JetBrains Mono', monospace (for stats, timers, codes)
- **Headings:** Inter Bold, tracking -0.02em
- **Body:** Inter Regular, 16px base, 1.6 line-height
- **Stats/Numbers:** JetBrains Mono, tabular figures

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Border radius: 8px (cards), 12px (buttons), 16px (modals), 50% (avatars)
- Card shadows: `0 4px 24px rgba(0, 212, 255, 0.05)`

### Motion Philosophy
- **Entrance animations:** Fade up + scale (0.95 → 1.0), 300ms ease-out
- **State transitions:** 200ms ease-in-out for all interactive elements
- **Progress animations:** Smooth count-up numbers, 1000ms duration
- **Success feedback:** Subtle pulse + glow effect
- **Error feedback:** Quick shake animation (3 cycles, 100ms)
- **Loading states:** Skeleton screens with shimmer effect

### Visual Assets
- **Icons:** Phosphor Icons (duotone style)
- **Charts:** Custom SVG with gradient fills
- **Decorative:** Subtle grid pattern background, floating particles on dashboard
- **Achievement badges:** Custom SVG shields with glow effects

---

## 3. Layout & Structure

### Navigation Architecture
```
├── Login/Register (Auth Gate)
├── Onboarding (5-day baseline testing)
└── Main App
    ├── Dashboard (Home)
    │   ├── Today's Overview
    │   ├── AI-Recommended Workout
    │   ├── Quick Stats
    │   └── Life Habits Tracker
    ├── Training
    │   ├── Daily Workout (AI-curated)
    │   ├── Free Play (All games)
    │   └── Test Day Mode
    ├── Analytics
    │   ├── Brain Age Score
    │   ├── Category Breakdown
    │   ├── Progress Over Time
    │   └── Life Correlation Insights
    ├── Weekly Review (Sundays)
    ├── Achievements
    └── Settings
        ├── Profile
        ├── Life Tracking Settings
        └── Data Export
```

### Responsive Strategy
- **Mobile (< 768px):** Single column, bottom navigation, touch-optimized
- **Tablet (768-1024px):** Two-column grid, sidebar collapsible
- **Desktop (> 1024px):** Full layout, keyboard shortcuts, persistent sidebar

### Visual Pacing
- **Dashboard:** Quick scan, high-level metrics prominent
- **Game Screen:** Full focus, minimal UI, maximum screen for gameplay
- **Analytics:** Scrollable deep-dive, data-rich but organized in digestible cards
- **Weekly Review:** Celebratory, progress-focused, Sunday ritual feel

---

## 4. Features & Interactions

### 4.1 Authentication System

**Registration Flow:**
1. Enter email, create master password
2. Password hashed with bcrypt (cost factor 12) before Firebase storage
3. Create profile: Name, Age, Initial life goals
4. Brief onboarding explaining the system
5. Start 5-day baseline testing

**Login Flow:**
1. Enter email + password
2. Client-side bcrypt hash of password
3. Compare hash with Firebase stored hash
4. Success: Load user profile + redirect to appropriate screen
5. Failure: "Invalid credentials" (never reveal which field is wrong)

**Security Measures:**
- Passwords NEVER stored in plaintext
- All Firebase rules restrict data to authenticated user only
- Session token stored in localStorage, refreshed on activity
- Auto-logout after 30 days of inactivity

### 4.2 Baseline Testing Week (Days 1-5)

**Day 1: Speed Baseline**
- Neural Snap (5 attempts, record average)
- Reaction Time Test (10 attempts, record best + average)
- Sequence Break (record completion time)

**Day 2: Memory Baseline**
- Grid Lock (standard 4x4, 5 attempts, record accuracy)
- Card Cascade (standard 8 cards, record time)
- List Master (start at 5 items, record span)

**Day 3: Logic Baseline**
- Pattern Oracle (10 puzzles, record accuracy)
- Cipher Cracker (3 ciphers, record time)
- Logic Grid (2 puzzles, record completion)

**Day 4: Psychology Baseline**
- Focus Zone (2 minutes, record distraction score)
- Decision Dilemma (10 scenarios, record optimal choices)
- Emotion Reader (10 faces, record accuracy)

**Day 5: Superhuman Skills Baseline**
- Mental Math (20 problems, record accuracy + time)
- Binary Translator (10 conversions, record accuracy)
- Dual N-Back (1-back baseline, record accuracy)

**Baseline Results:**
- Calculate initial "Brain Age" (composite score)
- Identify strongest and weakest categories
- Generate initial adaptive difficulty recommendations
- Set realistic improvement targets

### 4.3 Daily Training System

**Morning Readiness Check (60 seconds):**
1. 3 reaction time tests (record average)
2. Log: Sleep hours (slider 0-12), Exercise minutes (0-60), Water glasses (0-10)
3. Optional: How do you feel? (1-5 scale)

**AI-Curated Daily Workout:**
- App analyzes last 7 days of data
- Identifies weakest category (weighted by recency)
- Selects 3-4 games targeting weak areas (70%) + 1 strong area (30%)
- Each game duration: 5-15 minutes
- Total workout: 20-45 minutes (adjustable in settings)

**Workout Flow:**
1. "Today's Training" screen shows recommended games
2. User can accept recommendation or modify
3. Game starts with countdown
4. Real-time feedback during game
5. Results screen with comparison to personal best
6. Next game auto-loads or manual selection
7. Completion summary with today's gains

**Adaptive Difficulty (Staircase Method):**
- Track last 3 attempts per game
- 3 consecutive wins → Level up
- 2 consecutive failures → Level down
- 1 win + 1 loss → Maintain level
- Visual indicator of current difficulty trend

**Flexible Scheduling:**
- No strict daily requirements
- Weekly target: X minutes total (settable)
- Overtraining one day = system suggests lighter next day
- Undertraining → gentle notification, no guilt
- Rolling 7-day average tracked

### 4.4 Game Library (6 Categories, 30 Games, 50 Levels Each)

#### TIER 1: Speed & Reflex (Cyan Accent)

**1. Neural Snap**
- Objective: Click/tap targets as fast as possible
- Gameplay: Targets appear at random positions, click them before they vanish
- Levels 1-10: 10 targets, 2s each
- Levels 11-20: 15 targets, 1.5s each
- Levels 21-30: 20 targets, 1.2s each
- Levels 31-40: 25 targets, 1s each
- Levels 41-50: 30 targets, 0.8s each
- Metrics: Average reaction time, targets hit %, total time
- Scoring: Targets hit × speed bonus - penalties for misses

**2. Color Blitz**
- Objective: Press matching color button faster than opponent (AI)
- Gameplay: See color → Press matching button before AI
- Levels 1-10: 4 colors, 2s decision window
- Levels 11-20: 4 colors, 1.5s window, AI slightly faster
- Levels 21-30: 6 colors, 1.2s window
- Levels 31-40: 6 colors, 1s window, decoy colors added
- Levels 41-50: 8 colors, 0.8s window, multiple decisions
- Metrics: Win rate %, average decision time
- Scoring: Wins - losses with speed bonus

**3. Rapid Math**
- Objective: Solve equations faster than they appear
- Gameplay: Math problem shown, type answer before timer expires
- Levels 1-10: Addition/subtraction (single digits)
- Levels 11-20: Mixed operations (two operands)
- Levels 21-30: Parentheses, three operands
- Levels 31-40: Multiplication (single digits)
- Levels 41-50: Division, squares, mixed operations
- Metrics: Problems solved, accuracy %, average time per problem
- Scoring: Correct answers × speed multiplier

**4. Sequence Break**
- Objective: Click numbers 1-50 (or 1-100) as fast as possible
- Gameplay: Grid of shuffled numbers, click in ascending order
- Levels 1-10: 1-25 numbers, 4×4 grid
- Levels 11-20: 1-50 numbers, 5×5 grid
- Levels 21-30: 1-75 numbers, 6×6 grid, some distractors
- Levels 31-40: 1-100 numbers, 7×7 grid
- Levels 41-50: 1-100 with decoys, 7×7 grid, time bonus
- Metrics: Total time, errors, efficiency score
- Scoring: Time - (errors × 5 seconds)

**5. Peripheral Vision**
- Objective: Catch flashing lights in peripheral vision
- Gameplay: Focus center, side indicators flash briefly
- Levels 1-10: Single side, 1 second flash, 5 rounds
- Levels 11-20: Any side, 0.8s flash, 8 rounds
- Levels 21-30: Two simultaneous, 0.6s flash, 10 rounds
- Levels 31-40: Random count (1-3), 0.5s flash
- Levels 41-50: Fast sequence, 0.3s flash, must recall all
- Metrics: Detection accuracy %, reaction time
- Scoring: Correct detections × speed bonus

#### TIER 2: Memory Masters (Violet Accent)

**6. Grid Lock**
- Objective: Remember and recreate grid patterns (photographic training)
- Gameplay: Grid lights up in sequence → recreate from memory
- Levels 1-10: 3×3 grid, 3-4 lights, 3 second view
- Levels 11-20: 4×4 grid, 5-6 lights, 2.5 second view
- Levels 21-30: 4×4 grid, 7-8 lights, 2 second view
- Levels 31-40: 5×5 grid, 8-10 lights, 1.5 second view
- Levels 41-50: 5×5 grid, 12-15 lights, 1 second view
- Metrics: Sequence accuracy %, order accuracy %
- Scoring: Correct positions × order bonus

**7. Card Cascade**
- Objective: Flip and match pairs with increasing difficulty
- Gameplay: Cards face down, flip two at a time, find matches
- Levels 1-10: 8 cards (4 pairs), unlimited time
- Levels 11-20: 12 cards (6 pairs), 60 second limit
- Levels 21-30: 16 cards (8 pairs), 45 second limit
- Levels 31-40: 20 cards (10 pairs), 40 second limit
- Levels 41-50: 24 cards (12 pairs), 35 second limit
- Metrics: Completion time, moves made, efficiency %
- Scoring: Base score - time penalty - move penalty

**8. Echo Recall**
- Objective: Remember sequences of shapes, colors, positions, sounds
- Gameplay: Sequence plays → recreate it
- Levels 1-10: 3-item sequence, single type (shapes)
- Levels 11-20: 5-item sequence, single type
- Levels 21-30: 7-item sequence, mixed types
- Levels 31-40: 10-item sequence, increasing speed
- Levels 41-50: 15-item sequence, multiple modalities
- Metrics: Sequence accuracy %, longest sequence remembered
- Scoring: Items remembered × length multiplier

**9. Detail Hunter**
- Objective: View image briefly → answer detailed questions
- Gameplay: Study image for 5 seconds → answer 5 questions
- Levels 1-10: Simple scenes, basic questions
- Levels 11-20: Complex scenes, specific details
- Levels 21-30: Multiple objects, spatial questions
- Levels 31-40: Text-heavy scenes, reading comprehension
- Levels 41-50: Abstract patterns, pattern recognition
- Metrics: Questions correct %, confidence vs accuracy
- Scoring: Correct × difficulty multiplier

**10. List Master**
- Objective: Remember and recall growing lists
- Gameplay: See list → memorize → recall when prompted
- Levels 1-10: 5 items, category given
- Levels 11-20: 8 items, category given
- Levels 21-30: 10 items, recall in order
- Levels 31-40: 12 items, recall any order
- Levels 41-50: 15 items, with distractors, order matters
- Metrics: Items recalled, order accuracy %
- Scoring: Items × order bonus

#### TIER 3: Logic & Problem Solving (Emerald Accent)

**11. Cipher Cracker**
- Objective: Decode encrypted messages using logic
- Gameplay: Encrypted text shown → deduce pattern → decode message
- Levels 1-10: Simple substitution (Caesar cipher)
- Levels 11-20: Advanced substitution with spaces
- Levels 21-30: Number substitution
- Levels 31-40: Multi-layer encryption
- Levels 41-50: Custom ciphers, minimal clues
- Metrics: Completion time, hints used, accuracy %
- Scoring: Base score - time penalty - hint penalty

**12. Pattern Oracle**
- Objective: Find the next item in a sequence
- Gameplay: See sequence pattern → select correct next item
- Levels 1-10: Simple number patterns (arithmetic)
- Levels 11-20: Geometric patterns
- Levels 21-30: Complex number patterns (quadratic, fibonacci)
- Levels 31-40: Multi-dimensional patterns
- Levels 41-50: Abstract patterns, visual + numeric
- Metrics: Accuracy %, time per problem
- Scoring: Correct × speed bonus

**13. Logic Grid**
- Objective: Solve complex logic puzzles with constraints
- Gameplay: Grid with clues → deduce relationships
- Levels 1-10: 2×2 grid, 4 clues
- Levels 11-20: 3×3 grid, 6 clues
- Levels 21-30: 4×4 grid, 8 clues
- Levels 31-40: 4×4 grid, 6 clues (more deduction needed)
- Levels 41-50: 5×5 grid, complex constraints
- Metrics: Completion time, errors made
- Scoring: Base score - time penalty - error penalty

**14. Bridge Builder**
- Objective: Solve physics/logic puzzles to build bridges
- Gameplay: Drag and drop elements to solve puzzles
- Levels 1-10: Simple connections
- Levels 11-20: Resource constraints
- Levels 21-30: Multiple solutions, optimize
- Levels 31-40: Complex systems
- Levels 41-50: Multi-stage puzzles
- Metrics: Solution quality, materials used, time
- Scoring: Efficiency × completion bonus

**15. Chess Vision**
- Objective: Visualize chess moves without a board
- Gameplay: See move notation → mentally execute → answer question
- Levels 1-10: Single piece, simple moves
- Levels 11-20: Multiple pieces, no captures
- Levels 21-30: Captures and simple checks
- Levels 31-40: Complex positions, multiple moves
- Levels 41-50: Full visualization, 3+ move sequences
- Metrics: Accuracy %, time per position
- Scoring: Correct × complexity bonus

#### TIER 4: Psychology & Mind (Amber Accent)

**16. Emotion Reader**
- Objective: Read micro-expressions and emotions
- Gameplay: See face image → identify emotion from options
- Levels 1-10: Basic emotions (happy, sad, angry, fearful)
- Levels 11-20: Subtle emotions (annoyed, anxious, surprised)
- Levels 21-30: Micro-expressions (fleeting genuine vs fake)
- Levels 31-40: Complex emotional states
- Levels 41-50: Blended emotions, ambiguous faces
- Metrics: Accuracy %, confidence vs accuracy correlation
- Scoring: Correct × difficulty × confidence calibration bonus

**17. Decision Dilemma**
- Objective: Make optimal decisions under pressure
- Gameplay: Scenario presented → choose best option quickly
- Levels 1-10: Simple binary choices
- Levels 11-20: Multi-option scenarios
- Levels 21-30: Time pressure, partial information
- Levels 31-40: Ethical dilemmas, no clear answer
- Levels 41-50: Complex scenarios, multiple factors
- Metrics: Optimal choice %, time to decision
- Scoring: Optimal choices × speed bonus

**18. Lie Detector**
- Objective: Identify inconsistencies and lies in stories
- Gameplay: Listen to/read story → identify contradictions
- Levels 1-10: Obvious lies, single statement
- Levels 11-20: Subtle inconsistencies
- Levels 21-30: Multiple speakers, timeline issues
- Levels 31-40: Complex narratives, missing details
- Levels 41-50: Expert level, psychological tells
- Metrics: Lies caught %, false accusations %
- Scoring: Correct detections - false positives

**19. Focus Zone**
- Objective: Maintain concentration despite distractions
- Gameplay: Primary task while distractions appear
- Levels 1-10: Simple click task, minimal distractions
- Levels 11-20: Multiple task types, moderate distractions
- Levels 21-30: Complex primary task, frequent distractions
- Levels 31-40: Multiple distractions, must prioritize
- Levels 41-50: Chaotic environment, maintain accuracy
- Metrics: Primary task accuracy, distraction recovery time
- Scoring: Accuracy × distraction resistance multiplier

**20. Stress Test**
- Objective: Perform accurately under increasing pressure
- Gameplay: Task difficulty and time pressure increase
- Levels 1-10: Slow build, manage stress response
- Levels 11-20: Moderate pressure, accuracy drops if stressed
- Levels 21-30: High pressure, maintain performance
- Levels 31-40: Intense pressure, focus techniques needed
- Levels 41-50: Maximum pressure, psychological resilience
- Metrics: Performance under pressure, recovery time
- Scoring: Performance × pressure multiplier

#### TIER 5: Superhuman Skills (Gradient Accent)

**21. Memory Palace**
- Objective: Learn and practice the memory palace technique
- Gameplay: Associate items with locations → recall in order
- Tutorial: Built-in Memory Palace basics
- Levels 1-10: 5 items, familiar location
- Levels 11-20: 10 items, complex route
- Levels 21-30: 15 items, speed recall
- Levels 31-40: 20 items, multiple palaces
- Levels 41-50: 30+ items, rapid encoding
- Metrics: Items recalled, time to encode, recall speed
- Scoring: Items × accuracy × speed bonus

**22. Mental Math Master**
- Objective: Calculate large problems mentally
- Gameplay: See problem → type answer → verify
- Levels 1-10: 2-digit addition/subtraction
- Levels 11-20: 2-digit × 2-digit multiplication
- Levels 21-30: Squares up to 50²
- Levels 31-40: Percentages, fractions
- Levels 41-50: 3-digit operations, mixed
- Metrics: Accuracy %, problems solved, average time
- Scoring: Correct × complexity × speed bonus

**23. Binary Translator**
- Objective: Convert binary/hex/decimal in your head
- Gameplay: See number in one base → type in another
- Levels 1-10: Binary to decimal (4-bit)
- Levels 11-20: Decimal to binary (8-bit)
- Levels 21-30: Hex to binary/decimal
- Levels 31-40: Rapid conversions, mixed bases
- Levels 41-50: Complex operations in different bases
- Metrics: Conversion accuracy %, time per conversion
- Scoring: Correct × size × speed bonus

**24. Speed Reading**
- Objective: Read and comprehend text at high speed
- Gameplay: Text displayed → questions → comprehension check
- Levels 1-10: 100 WPM, simple text
- Levels 11-20: 200 WPM, moderate text
- Levels 21-30: 300 WPM, complex text
- Levels 31-40: 400 WPM, technical text
- Levels 41-50: 500+ WPM, any text
- Metrics: WPM achieved, comprehension %
- Scoring: Comprehension × WPM multiplier

**25. Visualization Pro**
- Objective: Hold and manipulate 3D shapes mentally
- Gameplay: See 3D shape → answer questions about it
- Levels 1-10: Simple rotations
- Levels 11-20: Shape combinations
- Levels 21-30: Complex transformations
- Levels 31-40: Multiple shapes, spatial reasoning
- Levels 41-50: Abstract spatial puzzles
- Metrics: Accuracy %, visualization speed
- Scoring: Correct × complexity × speed

#### TIER 6: Advanced Mastery (Rainbow/Platinum Accent)

**26. Dual N-Back**
- Objective: Gold standard of working memory training
- Gameplay: Audio + visual sequence, match N-back
- Levels 1-4: 1-back to 4-back (N level = N-back)
- Scoring based on: Hits, false alarms, A' score
- Standard: 20+ minutes daily for 6+ weeks for optimal results

**27. Multitask Master**
- Objective: Handle multiple tasks simultaneously
- Gameplay: 2-3 concurrent tasks, manage all
- Levels 1-10: 2 simple tasks
- Levels 11-20: 2 complex tasks
- Levels 21-30: 3 tasks, various priorities
- Levels 31-40: 3 complex tasks
- Levels 41-50: Dynamic task switching
- Metrics: All task accuracy, task switching cost
- Scoring: Minimum accuracy × task count bonus

**28. Calculation Pro**
- Objective: Advanced mental calculation abilities
- Gameplay: Complex calculations in head
- Levels 1-10: 3-digit × 2-digit
- Levels 11-20: Squaring 3-digit numbers
- Levels 21-30: Cube roots
- Levels 31-40: Compound operations
- Levels 41-50: Competition-level problems
- Metrics: Accuracy %, problems solved
- Scoring: Correct × difficulty × speed

**29. Pattern Recognition Expert**
- Objective: Find complex patterns in data
- Gameplay: Analyze data → identify patterns → predict
- Levels 1-10: Simple sequences
- Levels 11-20: Multi-variable patterns
- Levels 21-30: Abstract patterns
- Levels 31-40: Complex systems
- Levels 41-50: Chaotic data, prediction challenges
- Metrics: Prediction accuracy %
- Scoring: Correct predictions × data complexity

**30. Cognitive Flexibility**
- Objective: Switch between tasks and mental sets efficiently
- Gameplay: Task changes mid-execution, adapt quickly
- Levels 1-10: 2 task types, slow switching
- Levels 11-20: 3 task types
- Levels 21-30: Rapid switching
- Levels 31-40: Unpredictable switching
- Levels 41-50: Maximum flexibility required
- Metrics: Accuracy across tasks, switch cost
- Scoring: Mean accuracy - switch penalty

### 4.5 Analytics Dashboard

**Brain Age Score:**
- Composite score (16-100) based on:
  - Reaction time (25%)
  - Memory accuracy (25%)
  - Logic/problem solving (25%)
  - Learning speed (25%)
- Displayed as "Your Brain Age: 32" (lower is better)
- Tracked weekly, with trend arrow

**Category Breakdown:**
- Radar chart showing 6 categories
- Each category: 0-100 score
- Color-coded: weak (red) to strong (green)
- Click to drill down into category details

**Progress Over Time:**
- Line graphs showing improvement
- Time periods: 7 days, 30 days, 90 days, all time
- Metrics: Brain age, per-category scores, games played
- Personal bests highlighted

**Life Correlation Insights:**
- "Your reaction time is 14% slower when sleeping under 6 hours"
- "Your memory score improves 23% on days with 30+ min exercise"
- "Optimal performance: 7-8 hours sleep, 20 min exercise, 8 glasses water"
- Correlation analysis updated weekly

### 4.6 Weekly Review (Sundays)

**Automatic Generation:**
- Triggered every Sunday at user's typical training time
- Summary of week's training
- Comparison to previous week
- Breakdown of category improvements
- Streak status
- Next week's focus areas
- Achievement unlocks (if any)

**Visual Design:**
- Celebratory design (gradients, glows)
- Easy to screenshot and share (with yourself)
- Motivational messaging
- Clear action items for next week

### 4.7 Habit Tracking

**Daily Check-ins:**
- Sleep hours (logged after waking)
- Exercise minutes (logged after workout)
- Water glasses (logged throughout day)
- No-scroll after 10 PM (logged next morning)
- Mood rating (1-5 scale)

**Correlation Dashboard:**
- See how habits affect brain performance
- Build evidence-based personal insights
- Adjust habits based on data, not guesswork

### 4.8 Achievement System

**Milestones:**
- First Game Completed
- 7-Day Streak
- 30-Day Streak
- 100-Day Streak
- 100 Games Played
- 1000 Games Played
- All Games Played (at least once)

**Category Mastery:**
- Speed Master (reach level 30 in all Tier 1 games)
- Memory Master (reach level 30 in all Tier 2 games)
- Logic Master (reach level 30 in all Tier 3 games)
- Psychology Master (reach level 30 in all Tier 4 games)
- Superhuman (reach level 30 in all Tier 5 games)
- Complete Master (reach level 50 in all games)

**Special Achievements:**
- Brain Age 20 (achieve youngest possible brain age)
- Consistency King (train 365 days)
- Night Owl (train after midnight regularly)
- Early Bird (train before 6 AM regularly)
- Perfect Week (7 days, all targets met)

---

## 5. Component Inventory

### Navigation Components

**Sidebar (Desktop):**
- States: Expanded, collapsed, mobile-hidden
- Items: Dashboard, Training, Analytics, Achievements, Settings
- Active indicator: Cyan glow left border
- Hover: Subtle background shift

**Bottom Navigation (Mobile):**
- States: Default, active, notification badge
- 5 main sections with icons
- Active: Filled icon + cyan color

### Card Components

**Stat Card:**
- States: Loading (skeleton), data, error
- Content: Title, value, trend indicator, sparkline
- Hover: Subtle lift shadow

**Game Card:**
- States: Locked, available, in-progress, mastered
- Content: Icon, name, category badge, level progress
- Hover: Scale up slightly, glow border

**Achievement Card:**
- States: Locked (greyed), unlocked (colored), new (pulse)
- Content: Badge icon, name, description, unlock date

### Input Components

**Button:**
- States: Default, hover, active, disabled, loading
- Variants: Primary (cyan), secondary (ghost), danger (red)
- Sizes: Small, medium, large
- Loading: Spinner replaces text

**Text Input:**
- States: Empty, focused, filled, error, disabled
- Features: Label, placeholder, helper text, error message
- Validation: Real-time with debounce

**Slider:**
- States: Default, dragging, disabled
- Track: Dark background, cyan fill
- Thumb: Circular, glow on drag

### Feedback Components

**Toast Notification:**
- Types: Success (green), error (red), info (cyan), warning (amber)
- Animation: Slide in from top, auto-dismiss 5s
- Action: Optional action button

**Progress Bar:**
- Types: Determinate, indeterminate
- Animation: Smooth fill, shimmer on loading
- Label: Percentage optional

**Modal:**
- Types: Confirmation, form, alert
- Animation: Fade + scale in
- Backdrop: Blur + dark overlay
- Close: X button, click outside, Escape key

### Game Components

**Timer Display:**
- Large countdown (center of screen)
- Color shifts: Normal → Yellow (< 10s) → Red (< 5s)
- Audio cues: Optional beeps at intervals

**Score Display:**
- Current score prominent
- Combo multiplier when active
- Animated on increment

**Game Board:**
- Full viewport usage
- Touch/click optimized targets
- Clear visual feedback on interaction

---

## 6. Technical Approach

### Frontend Architecture
- **Framework:** Vanilla JavaScript with modular structure (ES6 modules)
- **Styling:** CSS3 with CSS Variables for theming
- **State Management:** Custom store pattern with localStorage sync
- **Routing:** Hash-based SPA routing (#/dashboard, #/training, etc.)

### Firebase Integration

**Authentication:**
- Firebase Auth with email/password
- Custom claims for user metadata
- Session persistence: 30 days

**Firestore Database Schema:**
```
users/
  {userId}/
    profile/
      email: string
      name: string
      createdAt: timestamp
      settings: object
    baseline/
      completed: boolean
      results: object (by day)
      brainAgeInitial: number
    progress/
      games/
        {gameId}/
          currentLevel: number
          highScore: number
          totalPlays: number
          bestTime: number
          accuracy: number
          lastPlayed: timestamp
          streak: number
          history: array (last 10 attempts)
      categories/
        {category}/
          score: number
          trend: string
      brainAge: number
      brainAgeHistory: array
    habits/
      {date}/
        sleep: number
        exercise: number
        water: number
        noScroll: boolean
        mood: number
    achievements/
      {achievementId}/
        unlocked: boolean
        unlockedAt: timestamp
    weeklyReview/
      current: object
      history: array
```

**Firebase Security Rules:**
- User can only read/write their own data
- Validated data structure on writes
- No direct database access without authentication

### Data Persistence Strategy
- All game data → Firebase Firestore
- Auth state → Firebase Auth + localStorage token
- Offline support: Firebase SDK handles offline writes
- Sync: Automatic when connection restored

### API/Function Endpoints
- Firebase Functions for:
  - Weekly review generation (scheduled, Sundays 9 AM)
  - Achievement verification
  - Brain age calculation
  - Data aggregation for insights

### Performance Optimization
- Lazy load game components
- Preload next recommended game
- Service Worker for fast loading
- Image compression for any visual content
- Debounced state saves to Firebase

### Testing Strategy
- Manual testing on all games
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile responsive testing
- Firebase security rules validation
- Data integrity checks

---

## 7. Implementation Phases

### Phase 1: Foundation
- Firebase project setup
- Authentication system
- Basic routing
- Theme/styling foundation

### Phase 2: Core Training
- 5 baseline testing games
- Data collection system
- Basic analytics display

### Phase 3: Full Game Library
- All 30 games implemented
- Adaptive difficulty system
- Scoring and progression

### Phase 4: Intelligence
- AI recommendation engine
- Life correlation analysis
- Weekly review generation

### Phase 5: Polish
- Achievement system
- Visual refinements
- Performance optimization
- Documentation

---

## 8. Success Metrics

**Platform Success:**
- Consistent daily usage (goal: 7+ days/week)
- Measurable brain age improvement over 30 days
- All 30 games played at least once
- Habit tracking compliance

**Technical Success:**
- 100% data sync reliability
- Sub-second load times
- Zero data loss incidents
- Cross-device seamless experience

---

**VIDYUN-MANAS** — Where cognitive excellence meets personalized AI.
