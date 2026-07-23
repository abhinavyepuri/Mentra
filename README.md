# Mentra — AI-Powered Smart Classroom & Socratic Learning Platform

Mentra is a comprehensive, full-stack educational intelligence platform designed to bridge the gap between classroom teaching and individual student learning. Powered by Google Gemini AI, Mentra equips teachers with actionable insights and real-time student alerts while providing students with personalized Socratic guidance, peer study pods, and gamified learning milestones.

---

## 🌟 Key Features

### For Students:
- **Interactive AI Study Helper**: Socratic AI tutor that guides students step-by-step through complex STEM & humanities topics without giving away raw answers.
- **Silent Doubt Logging**: Automatically logs subtle student confusions during Socratic chats to keep teachers informed without embarrassing students.
- **Targeted Practice Quizzes**: Adaptive quiz generator targeting identified weak concepts (+50 PTS bonus).
- **Gamification & Leaderboard**: Earn points, level up, unlock achievement badges with interactive tooltips, and track streak days.
- **Group Study Pods**: AI-clustered collaborative peer pods with assigned roles (Facilitator, Explainer, Synthesizer, Questioner).

### For Teachers & Admin:
- **Real-Time Student Alerts**: Automated notification engine for struggling students, doubt build-ups, and disengagement.
- **Classroom Insights Compiler**: Generates class confidence scores, confusion indexes, and next-lecture agendas.
- **AI Remedial Lesson Plan Generator**: Instant step-by-step remediation plans for specific student misconceptions.
- **Quiz Creator & Assessment Analyzer**: Generate Bloom's-aligned quizzes from syllabus text and analyze raw exam score distributions.
- **LMS & Analytics Integrations**: Modal preview for connecting Google Classroom, Looker Studio, and Moodle (LTI 1.3).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion, Recharts
- **Backend**: Node.js, Express, Vite (Development Server & Middleware), Esbuild
- **AI Core**: Google Gemini 3.6 Flash (`@google/genai` SDK)
- **Styling & UI**: Tailwind CSS v4, Custom Performance Mode for low-spec devices

---

## 🚀 Quick Start (Running on Localhost)

### Prerequisites
- **Node.js**: Version 18 or 20+ installed on your computer.
- **Package Manager**: `npm` (comes with Node.js) or `bun`.

### Step 1: Extract the Downloaded ZIP
Unzip the downloaded project archive to a folder on your computer.

### Step 2: Install Dependencies
Open your terminal (Command Prompt / Terminal / PowerShell), navigate to the project directory, and run:
```bash
npm install
```

### Step 3: Configure Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in any code editor (e.g., VS Code) and add your Gemini API Key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```
   > 💡 **Get a Free Gemini API Key**: Obtain one in 30 seconds at [Google AI Studio](https://aistudio.google.com/).

### Step 4: Start the Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Visit **`http://localhost:3000`** in your web browser!

---

## 🔑 FAQ & Architecture Details

### 1. Will the API keys still work after downloading the ZIP?
- **Workspace Secrets**: The API key set inside AI Studio's cloud editor is kept private and is **not** included in downloaded ZIP files for security reasons.
- **To enable live AI features locally**: Get a free API key from [Google AI Studio](https://aistudio.google.com/) and paste it into `.env` as `GEMINI_API_KEY="your_key"`.
- **Offline / Graceful Fallback**: If no API key is provided, Mentra includes built-in fallback mock data for all 7 AI endpoints, so the entire platform remains 100% functional out of the box!

### 2. Where is the data stored?
- Mentra currently runs an **In-Memory Express Data Store** (`server.ts`).
- All state changes (adding classrooms, resolving doubts, submitting quizzes, updating points) persist live in server memory during your runtime session.
- To reset the data back to default mock states at any time, click the **"Reset Demo Data"** button in the top header.
- *Production Note*: To connect a permanent database (e.g. PostgreSQL, MongoDB, or Firebase), you can replace the in-memory arrays in `server.ts` with database queries.

### 3. Can I run this on `localhost`?
Yes! As detailed in the Quick Start above, running `npm run dev` starts the Express server with Vite middleware on `http://localhost:3000`.

---

## 🚆 Hosting on Railway

You can host Mentra on [Railway](https://railway.app/) in a few clicks:

1. **Push to GitHub**:
   Upload your extracted project directory to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Mentra platform"
   git branch -M main
   git remote add origin https://github.com/your-username/mentra.git
   git push -u origin main
   ```

2. **Deploy on Railway**:
   - Log in to [Railway.app](https://railway.app/).
   - Click **New Project** → **Deploy from GitHub repo**.
   - Select your `mentra` repository.

3. **Configure Environment Variables in Railway**:
   - In your Railway project dashboard, go to **Variables**.
   - Add the following variable:
     - `GEMINI_API_KEY`: `your_gemini_api_key`
     - `NODE_ENV`: `production`

4. **Build & Start Commands**:
   Railway will automatically read `package.json` and run:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start` (`node dist/server.cjs`)

5. **Expose Public Domain**:
   - In Railway Settings under **Networking**, click **Generate Domain**.
   - Open your live Railway URL to access Mentra anywhere!

---

## 📜 Available NPM Scripts

- `npm run dev` — Starts local development server with Vite hot reloading on port 3000.
- `npm run build` — Compiles the React frontend and bundles `server.ts` into a self-contained `dist/server.cjs` file.
- `npm start` — Runs the compiled production server (`node dist/server.cjs`).
- `npm run lint` — Runs TypeScript type checks.
- `npm run clean` — Removes build artifacts from `dist/`.

---

## 🎨 Performance Mode for Low-Spec Devices
For students or classrooms using lower-spec hardware or Chromebooks, Mentra features a **Low Power Mode**:
- Toggle the **Performance / Low Power Mode** button (⚡ icon) in the top header bar.
- This automatically disables resource-heavy CSS backdrop blurs, glow effects, and heavy transitions for smooth execution on low-CPU devices.
