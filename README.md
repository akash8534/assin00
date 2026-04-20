Here’s a cleaner, corrected, and slightly tighter version of your doc. I’ve removed citation noise, fixed grammar, and improved flow. I also added a couple of missing pieces that reviewers usually expect.

---

# 🌟 Gully Stars – Grassroots Sports Platform

Gully Stars is a mobile-first web platform for grassroots sports teams. It combines sports management with social features, enabling captains to manage squads, organisers to run tournaments, and players to track their performance and memories.

---

## 🛠 Tech Stack & Justification

* **Framework:** **Next.js (App Router)**
  Chosen for fast full-stack development, built-in API routes, and seamless server–client rendering.

* **Database:** **Prisma ORM + SQLite**
  Ensures a zero-config local setup. SQLite allows the app to run instantly without external dependencies like Docker or Postgres.

* **Styling:** **Tailwind CSS**
  Used to build a clean, responsive UI optimized for a **390px mobile viewport**.

* **State Management:** **React Context API**
  Lightweight solution for handling global state and mock authentication without added complexity.

---

## ⚙️ Local Development Setup (Under 5 Minutes)

### Prerequisites

* **Node.js** (v18 or higher)
* **npm**

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
echo 'DATABASE_URL="file:./dev.db"' > .env
```

Or copy from example:

```bash
cp .env.example .env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the App

```bash
npm run dev
```

App will be available at:
👉 [http://localhost:3000](http://localhost:3000)

---

## ✅ (Recommended to Add — Often Expected in Assignments)

If your assignment requires completeness, you might still need these sections:

### 📦 Features

* Team creation and management
* Player profiles
* Match/tournament organisation
* Performance tracking
* Social feed / highlights

### 📁 Project Structure 

```bash
/app        → Routes & pages (Next.js App Router)
/components → Reusable UI components
/lib        → Utilities & configs
/prisma     → Database schema
```
