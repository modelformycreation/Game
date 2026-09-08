# Vidyun-manas — next-model handoff

Updated: 2026-09-08. **Incomplete prototype with release-blocking gameplay bugs.** This document distinguishes requirements, earlier claims, user observations, and current source findings. Read it alongside `SPEC.md`; do not treat the spec or README as proof that a feature works.

## 1. User request and priorities

Build Vidyun-manas (user's chosen name; described as Sanskrit for “Radiant Intellect”), a complete brain-training platform:
- 30 genuinely playable games, with 50 levels per game.
- Firebase backend and Firebase email/password authentication; no external login providers.
- Passwords hashed before storage; never store plaintext passwords.
- AI-driven adaptive difficulty, personalized daily training, progress tracking, achievements, weekly reviews, and life-habit/performance correlations.
- Minimalist dark design, mobile-first responsive layout.
- User has been testing locally on port 8080.

Latest request: provide a detailed summary for a new model and open a pull request for this branch. The current turn documents and submits the existing prototype; it does **not** claim to repair or complete the games.

## 2. User's exact gameplay failures

1. **Neural Snap:** after shooting at least 10 targets, only Quit and Pause are visible; no completion/next-level step appears.
2. **Pattern Oracle:** shows `8, 24, 72, 216, 648, 1944, ?`. The next answer must be **5832**, but offered choices were **1943, 1947, 1951, 1944**. Clicking choices does nothing. User also reports only multiplication-by-three patterns.
3. Most other games show “Coming Soon” or do not open. The two accessible games are also broken.
4. User is understandably frustrated with earlier claims of completeness. Prioritize verified behavior over adding more nominal game cards.

The current source differs from the options in the user's report. Do not dismiss that report: verify which version is actually served, caching, and the deployed/preview revision.

## 3. Repository and delivery state

- Repository: `modelformycreation/Game`.
- Workspace: `/home/user/Game`.
- Session branch: `arena/01a0779b-game`; keep all work and pushes on it.
- Base commit: `7008941b5be0ce29ab12bc0fc39a01c2e952476c` (initial commit), base branch `main`.
- At this turn's inspection, HEAD was the initial commit, README was modified, and the application/spec/test files were untracked. There was **no active merge conflict or rebase**.
- Earlier conversation memory described an aborted rebase/conflict around `js/app.js` and a failed push; those are historical, not the current Git status.
- This turn is preserving the supplied files and opening a draft PR with known limitations. Check Git and GitHub for the final commit/PR state.
- No live browser verification, server restart, Firebase deployment, or production release was performed in this handoff turn.

## 4. Files and architecture

- `SPEC.md`: 851-line design and implementation plan. Includes design tokens, navigation, authentication, five-day baseline, adaptive daily training, 30-game library, analytics, weekly review, habits, achievements, Firebase schema and implementation phases. It is a **plan**, not completed functionality.
- `index.html`: auth UI, loading screen, app shell, sidebar/mobile navigation, game modal, toast/modal containers.
- `js/app.js`: ~3,647 lines of vanilla JavaScript; Firebase configuration, global state, utilities, auth, router, game engine, page rendering, initialization.
- `styles/main.css`, `components.css`, `games.css`, `responsive.css`: dark UI, components, games, responsive rules.
- `manifest.json`: web manifest; do not infer a working offline/PWA implementation from its presence.
- `README.md`: setup and feature descriptions, many currently overstated.
- `tests.js`: browser-console smoke-test script; currently has a syntax error.
- `SECURITY_TEST_REPORT.md`: historical report claiming 60/60 passing; **not reliable evidence of current security or functionality**.
- `HANDOFF.md`: this document.

No bundler/package manifest is present. Frontend loads Firebase compat SDK 10.7.1 from Google CDN, Inter and JetBrains Mono from Google Fonts, and Phosphor icon CSS from unpkg. It uses inline event handlers and exposes `toast`, `modal`, `router`, `authSystem`, `gameEngine`, `utils`, and `state` on `window`.

Routes: dashboard, training, games, analytics, habits, achievements, settings, weekly-review. Rendering mostly uses template strings assigned to `innerHTML`.

Local serving command:
```sh
cd /home/user/Game
python3 -m http.server 8080 --bind 0.0.0.0
```
Use a managed background process when launching a live preview. User-browser service URLs must not point to sandbox localhost. No server was verified running in this turn.

## 5. Firebase and persistence

Configured project: **vidyun-manas**; auth domain `vidyun-manas.firebaseapp.com`. Web app configuration is already in `js/app.js`; do not ask the user to recreate the project or send credentials. Firebase web config is public client configuration, not an admin credential.

Prior user context says Email/Password auth and Firestore were enabled and UID-isolated rules were applied. Live console configuration/rules were **not verified this turn**. README contains an example allowing authenticated users to read/write only `/users/{theirUid}`. No deployed-rules test or emulator suite is present.

User document shape includes:
- `profile`: email, name, goal, createdAt, **passwordHash** (security concern below).
- `baseline`: completed, results.
- `progress.games`: currentLevel, highScore, totalPlays, bestTime, accuracy, last ten history results.
- `progress.categories`: score/trend for speed, memory, logic, psychology, superhuman, advanced.
- `progress.brainAge`, brainAgeHistory, lastPlayedDate.
- `habits`: date-keyed entries for sleep, exercise, water, noScroll, mood.
- `achievements`, `weeklyReview`, `settings`.

`authSystem.updateUserData` updates Firestore then reloads the user document; failures are logged/swallowed, so callers may show success despite failed persistence. Registration/auth-state loading can race with creation of the user profile. Verify authentication, reload, sign-out, and deletion behavior with test accounts.

## 6. Actual game inventory

There are **23 registered game definitions, not 30**. Eleven have `play...` methods, but that does not mean eleven work end-to-end:

| Game | Method present? | Main status |
|---|---|---|
| Neural Snap | Yes | User reports missing completion; progression/lifecycle need repair |
| Reaction Test | Yes | Ready-state click branch is unreachable due to waiting flag logic |
| Grid Lock | Yes | Accuracy ignores wrong clicks; score can become negative |
| Pattern Oracle | Yes | Answer/display mismatch, handler scope error, missing endGame |
| Mental Math | Yes | Division operand bug, square timeout bug, repeated submission risk |
| Dual N-Back | Yes | Handler scope error, missing completion, only 10 declared levels |
| Color Blitz | Yes | Broken generic route; word and ink match, double-submit risk |
| Sequence Break | Yes | Broken generic route; fixed 25 numbers, inaccurate error accounting |
| Card Cascade | Yes | Broken generic route; selector collides with library game cards |
| Echo Recall | Yes | Broken generic route; fixed sequence, completion/input guards missing |
| Focus Zone | Yes | Broken generic route; handler assigned to wrong object |
| Rapid Math | No | No dedicated implementation |
| List Master | No | No dedicated implementation |
| Memory Palace | No | No dedicated implementation |
| Cipher Cracker | No | No dedicated implementation |
| Logic Grid | No | No dedicated implementation |
| Binary Translator | No | No dedicated implementation |
| Decision Dilemma | No | No dedicated implementation |
| Emotion Reader | No | No dedicated implementation |
| Stress Test | No | No dedicated implementation |
| Calculation Pro | No | No dedicated implementation |
| Visualization | No | No dedicated implementation |
| Speed Reading | No | No dedicated implementation |

Consult SPEC's full 30-game list to reconcile the missing seven definitions. Do not silently replace distinct games with Reaction Test.

## 7. Release-blocking source findings

### A. Pattern Oracle

- `playPatternOracle` builds five numbers, then assigns `answer = sequence[5] = ...`. Rendering maps the whole array, displaying six numbers **including the intended hidden answer**. It then asks for another term while choices still target the displayed sixth term.
- If keeping six visible numbers, compute the seventh term (5832 in the user's example); otherwise intentionally show five visible numbers and compute only the hidden sixth. Display and scoring must agree.
- Option filtering currently removes non-positive values, potentially deleting the actual answer for subtraction patterns. Ensure exactly four unique choices, exactly one correct, with negative/zero answers supported.
- `selectPatternOption` is a sibling method referencing `answer`, `correct`, and `generateRound` that are local to `playPatternOracle`: runtime ReferenceErrors explain clicks failing.
- `generateRound` calls `endGame()` after ten rounds, but that function is absent from this game's scope.
- Current source includes addition, subtraction, multiplication, squares, and Fibonacci-like generators; user only observed multiplication in the served version.

### B. Completion and level progression

- `showResults` already includes a `Play Level X` button in current source. Its presence in code is not proof users reach it.
- `start(gameId, level)` overwrites explicitly requested level with persisted currentLevel.
- `saveGameResults` saves the played level rather than the unlocked next level.
- `nextLevel` is not clamped: a win at level 50 can offer level 51.
- Results saving is asynchronous and not awaited; define consistent progression independent of stale reloads and report save failures.
- Neural Snap's countdown, spawn delays and target expiry are not all tracked/cancelled. Pause can stall spawning or allow targets to expire; quit clears only the shared interval. Need deterministic cleanup on quit, finish, restart and game switch.
- Shared Pause currently mostly toggles a boolean/label; most timers and handlers ignore it.

### C. Routing and controls

- `start` stores a definition without `id`; `renderGenericGameStart` reads `currentGame.id`, gets `unknown`, and creates a Start button with that value.
- `initGameUI` has dedicated starts for only the original six. Most library cards therefore use the broken generic route, including five added methods.
- `startLevel` silently defaults to Reaction Test for unsupported IDs. Remove the misleading fallback and implement genuine games.
- Library filters read `card.dataset.category` but library markup lacks that data attribute; all filter buttons initially have `active`.

### D. Other implemented games

- Reaction Test sets `waiting = false` when green appears; the next click enters `if (!waiting)` and starts waiting again instead of reaching the ready branch. Early-click delays also need cancellation.
- Mental Math division uses `b` before initialization to compute `a`. Square cases return before arming the problem timer. Guard against repeated Enter submissions and use finite, valid answers.
- Focus Zone buttons call `gameEngine.answerFocus`, but implementation assigns `window.answerFocus`. Choices can contain duplicates; repeated clicks and distraction interval cleanup need fixing.
- Dual N-Back's external handler references locally scoped position/audio history and counters. `endGame` is missing and the last round doesn't schedule completion. Need accurate hit/miss/false-alarm accounting and one answer per channel per round.
- Color Blitz uses identical ink and word, defeating its stated interference task. Buttons are not locked while waiting for the next round.
- Card Cascade uses global `document.querySelectorAll('.game-card')[index]`, colliding with library cards behind the modal. Scope to the board and use distinct classes. Accuracy is always 100% after matching, irrespective of moves.
- Echo Recall doesn't stop input immediately after a wrong answer or completion; queued callbacks can repeatedly finish or run after quitting.
- Sequence Break always uses 25 numbers; error counters are unused, accuracy is always 100%, and time-based score can be negative.
- Grid Lock wrong choices do not reduce accuracy, and elapsed-time scoring may become negative.
- Level labels do not establish 50 distinct/scaled levels. Audit meaningful difficulty for every game.

## 8. Security and honesty gaps

- Current password hash is SHA-256 with a fixed public string `vidyun_salt`, duplicated in Firestore, then compared after Firebase sign-in. This is not a suitable independent password storage system and can break Firebase password-reset flows.
- Recommended remediation: rely on Firebase Authentication's server-side password hashing/storage, remove duplicate password hashes and login comparison, and plan deletion/migration of legacy `profile.passwordHash` fields. This still meets the requirement that stored passwords be hashed. Do not replace Firebase auth with a custom client-side hash scheme.
- Profile names/emails are interpolated into HTML without escaping; investigate stored XSS and move untrusted values to textContent/escaping.
- Export currently serializes the whole user document including passwordHash. Remove credential-derived fields from user data and exports.
- README/report claims of comprehensive XSS protection, validation, and 60/60 security success are not established by the test script.
- “AI” recommendations currently use simple sorting by category score/plays; not a complete adaptive system.
- Brain age starts at 50, dashboard chronological-age comparison assumes 50, analytics includes hardcoded improvements/correlations, and weekly activity is simulated. Do not present these as measured health facts.
- Weekly review counts lifetime plays rather than a properly scoped week. Baseline, category updates, habit correlations and claimed staircase progression need implementation.
- Achievements are partly display-time conditions; tenGames persistence checks per-game plays while UI describes total plays. Streak loading/calculation needs correction and persistence tests.

## 9. Validation actually performed this turn

- `node --check js/app.js`: **passed syntax only**. Does not detect closure/reference errors or prove gameplay.
- `node --check tests.js`: **failed**, `SyntaxError: Unexpected token ':'` around line 202. Repair before attempting the browser suite.
- No end-to-end browser tests, live Firebase auth/rules tests, mobile tests, or full 50-level playthrough were run.
- Existing tests include unconditional true checks and weak checks such as `typeof parseInt === 'function'` labeled input validation. Replace these with behavioral/security assertions.
- Earlier claim “60/60 passed” must not be repeated as a verified current result.

## 10. Recommended next implementation order and acceptance tests

1. Establish the exact served revision; reproduce reported errors in browser console.
2. Fix Pattern Oracle state/closure, generation and final results; regression-test the exact six-term example with 5832 available and clickable. Test all pattern types, negative answers, unique choices, ten-round completion and rapid double clicks.
3. Fix Neural Snap lifecycle and completion, next-level selection, saving and level caps. Test hitting all targets, missing all, mixed hits, pause/resume, quit during countdown, next level after reload, and final level 50.
4. Give each game a stable ID and explicit route; fix controls/scope and timer cleanup in every method. Never silently substitute another game.
5. Replace the broken smoke-test script with automated browser tests plus deterministic generator tests. Include mobile/touch operation and overlapping library/board selectors.
6. Repair auth security and data lifecycle; validate deployed Firestore rules using isolated test users/emulator. Never solicit credentials in chat.
7. Finish and validate all 30 games with 50 meaningful levels each (including Dual N-Back).
8. Implement real adaptive progression, baseline, category aggregates, weekly date filtering, habit correlation calculations and achievements. Show honest empty states until sufficient data exists; remove fabricated metrics.
9. Reconcile README/spec/report with verified functionality, then mark the PR ready only when appropriate.

Do not promise completeness based on function existence, generated CSS, or a syntax check. The next model should use the actual filesystem and tests as the source of truth and report remaining gaps plainly.

### Delivery update

The first push was rejected because the remote session branch already had commits `c7808cf` (initial platform) and `156427d` (Firebase configuration). Fetched and merged that history without force-pushing. Overlapping files retained the current local prototype and documentation after comparison; the older remote contained the original option generator and fewer game methods. This explains a possible version difference in the user's observations, but the served revision still needs browser verification. Merge conflicts were resolved; this is not an outstanding rebase task.
