## Usage

1. Register an account (or log in if you already have one)
2. From the Dashboard, view live prayer times and the Hijri date
3. Use Qibla, Quran, Tracker, Journal, Tasbeeh, and Adkar from the main buttons and the "☰ More" menu
4. Toggle the interface language (English/French) from the "☰ More" menu
5. Allow notification permission to receive local Azan alerts at prayer time

## Live Links

- Backend API: https://spiritual-corner.onrender.com
- Web app: https://spiritual-corner-web.onrender.com

## References & Tools Used

**Frameworks & Runtimes**
- [Node.js](https://nodejs.org/) — backend JavaScript runtime
- [Express](https://expressjs.com/) — backend web framework
- [React](https://react.dev/) — web frontend library
- [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/) — mobile framework and toolchain
- [Vite](https://vitejs.dev/) — web build tool and dev server

**Database**
- [MongoDB](https://www.mongodb.com/) / [MongoDB Atlas](https://www.mongodb.com/atlas) — cloud database
- [Mongoose](https://mongoosejs.com/) — MongoDB object modeling for Node.js
- [MongoDB Compass](https://www.mongodb.com/products/compass) — used during local development to inspect the database

**Authentication & Security**
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — JWT session tokens
- [bcrypt](https://www.npmjs.com/package/bcrypt) — password and PIN hashing
- Node's built-in [`crypto`](https://nodejs.org/api/crypto.html) module — AES-256-CBC journal encryption
- [cors](https://www.npmjs.com/package/cors) — cross-origin request handling for the web frontend

**Navigation & State**
- [Expo Router](https://docs.expo.dev/router/introduction/) — mobile navigation
- [React Router](https://reactrouter.com/) — web navigation
- [i18next](https://www.i18next.com/) / [react-i18next](https://react.i18next.com/) — English/French language support

**Device & Native Features (Mobile)**
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) — GPS for prayer times and Qibla
- [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/) — Quran audio playback
- [expo-sensors](https://docs.expo.dev/versions/latest/sdk/sensors/) — magnetometer for the live Qibla compass
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) — local Azan notifications
- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) — secure token/session storage
- [EAS Build](https://docs.expo.dev/build/introduction/) — cloud Android APK builds

**External APIs**
- [Aladhan API](https://aladhan.com/prayer-times-api) — prayer times and Hijri calendar
- [Al Quran Cloud API](https://alquran.cloud/api) — surah list and Quran verse text

**Testing**
- [Mocha](https://mochajs.org/) — test runner
- [Chai](https://www.chaijs.com/) — assertion library
- [Postman](https://www.postman.com/) — manual API testing during backend development

**Deployment & Version Control**
- [Render](https://render.com/) — backend (Web Service) and web app (Static Site) hosting
- [GitHub](https://github.com/) — version control and source repository
- [Git](https://git-scm.com/) — version control system

**Development Tools**
- [Visual Studio Code](https://code.visualstudio.com/) — code editor
- [Expo Go](https://expo.dev/go) — live mobile testing during development
- [Squoosh](https://squoosh.app/) — image compression for background photos

**Media & Design Assets**
- **Quran audio recitation:** Abdel Rahman Benmoussa (Warsh style)
- **Azan notification sound:** short takbir clip, Internet Archive Community Audio collection
- **Background photography:** [Pexels](https://www.pexels.com/) and [Unsplash](https://unsplash.com/), individual photographers credited in project asset notes

## Future Improvements

## Future Improvements

- **Age/gender-based avatar with contextual reminders** — an avatar chosen based on the user's age and gender that pops up (Duolingo-style) to remind them about prayer time, Tasbeeh, and time-appropriate Adkar (wake up, morning, evening, before bed)
- **Mushaf page view, multiple reciters, and Azan style by country** — real Quran page images (Mushaf-style) instead of plain verse text, a choice of reciters for Quran audio, and a choice of Azan recordings by country/style (as originally envisioned in early planning)
- **Emotional & spiritual wellbeing log** — a private, login-protected space to record how you're feeling in relation to your spiritual practice (prayer and good deeds), rather than just tracking whether tasks were completed. This idea originated during early project brainstorming but wasn't part of the final submitted proposal scope.
- **Configurable Azan notifications** — per-prayer on/off toggles, plus a selectable early-reminder time (2/5/10/15 minutes before) in addition to the on-time alert, managed from a Settings screen
- **Good Deeds tracker** — a tree visual where each leaf represents a daily good deed; tapping a leaf marks it done, with a weekly history view to look back on the week's progress
- Full Arabic language support with proper RTL (right-to-left) layout
- Additional languages (originally scoped to six; two — English and French — were completed given the project timeline)
- Verse-by-verse Quran audio synchronization (would require per-ayah audio timing data)
- Live rotating Qibla compass on web (dependent on broader browser magnetometer support)
- Remote push notifications as an alternative to local scheduled notifications
- Animated rolling-beads visual for the Tasbeeh counter
- Further accessibility and dark-mode contrast refinements