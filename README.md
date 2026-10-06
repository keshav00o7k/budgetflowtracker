# 💰 Budget Flow — Fullstack Personal Finance & Expense Tracker

> **A sleek, local-first and cloud-synced personal finance platform designed to give you total control over your monthly budget, daily expenses, and long-term financial habits.**

---

## 🎯 Project Vision & Purpose

**Budget Flow** was built to solve a simple problem: most budgeting apps are either bloated with unnecessary ads and third-party trackers, or locked behind rigid subscriptions. 

Budget Flow delivers:
- **100% Privacy & Zero Tracking**: No third-party data tracking, bot trackers, or external analytics scripts.
- **Local-First with Cloud Sync**: Works instantly offline using client storage, and seamlessly syncs to **MongoDB** when connected.
- **Smart Budget Suggestions**: Automatically calculates monthly surpluses or deficits and recommends next month's budget based on your real spending behavior.
- **Luxury Dark Aesthetic**: Designed with a high-contrast dark palette, glassmorphism cards, fluid animations, and responsive layouts for desktop and mobile.

---

## ✨ Key Features

### 📊 1. Monthly Budget Management & Smart Rollover
- Set and adjust budgets per month.
- Dynamic budget progress bar with warning indicators when approaching or exceeding limits.
- **Smart Next-Budget Prediction**: Recommends adjusting next month’s budget dynamically based on previous surplus or overspending.

### 💸 2. Daily Expense Tracking
- Quick-add expenses with amount, category, date, and custom notes.
- Instant edit and delete actions with confirmation dialogs.
- Categorization across **9 default categories**: `Food`, `Grocery`, `Fuel`, `Shopping`, `Travel`, `Bills`, `Entertainment`, `Health`, and `Other`.

### 📈 3. Visual Analytics & Insights
- **Category Breakdown**: Interactive Pie Chart displaying percentage of spending per category.
- **12-Month Spending Trend**: Smooth Line Chart showing monthly spending trajectories over time.
- **Budget vs. Actual**: Bar Chart comparing budgeted amounts versus actual spending.

### 📜 4. Historical Archive & Performance
- Full archive of all past months.
- Tracks saved surplus amounts and deficit penalties month-by-month.

### 💾 5. Data Sovereignty & Portability
- **JSON Export**: Download a full offline backup of all your budgets and expenses with one click.
- **JSON Import**: Restore data from any saved backup file.
- **Factory Reset**: One-click data reset with confirmation safeguards.

---

## 🏗️ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React 19 / Next.js 15)         │
│  - App Router (Layout & Pages)                         │
│  - Tailwind CSS v4 & Radix UI Primitives               │
│  - Recharts for Data Visualization                     │
│  - Optimistic UI Updates + Local-First Fallback        │
└──────────────────────────┬─────────────────────────────┘
                           │
                 HTTP JSON REST APIs
                           │
┌──────────────────────────▼─────────────────────────────┐
│          Backend (Node.js Server Runtime)              │
│  Option A: Next.js API Route Handlers (/api/*)         │
│  Option B: Standalone Express.js Server (Port 5000)    │
└──────────────────────────┬─────────────────────────────┘
                           │
                  Mongoose ODM Connection
                           │
┌──────────────────────────▼─────────────────────────────┐
│                  MongoDB Database                      │
│  - Collections: expenses, budgets, settings            │
└────────────────────────────────────────────────────────┘
```

### Core Technologies:
| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/), [Radix UI](https://www.radix-ui.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), PostCSS, Custom OKLCH Color Tokens |
| **Backend** | [Node.js](https://nodejs.org/), Next.js Route Handlers / [Express.js](https://expressjs.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) for complete type safety |

---

## 📡 API Reference

The project includes built-in REST API endpoints running under `/api/`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/expenses` | List all expenses (supports `?month=YYYY-MM` & `?category=...` filters) |
| `POST` | `/api/expenses` | Create a new expense entry |
| `PUT` | `/api/expenses/:id` | Update an existing expense by ID |
| `DELETE` | `/api/expenses/:id` | Delete an expense by ID |
| `GET` | `/api/budgets` | Get all monthly budget allocations |
| `POST` | `/api/budgets` | Set or update a monthly budget (`upsert`) |
| `GET` | `/api/data` | Bulk hydration endpoint (returns budgets, expenses, and history in 1 request) |
| `POST` | `/api/data` | Bulk actions (`action: "reset"` or `action: "import"`) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.17 or higher recommended)
- **MongoDB** (Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

---

### Step 1: Clone and Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd budgetflowtracker-main

# Install frontend and Next.js dependencies
npm install
```

---

### Step 2: Configure Environment Variables
Create or edit `.env.local` in the project root:
```env
# For Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/budgetflow

# OR for MongoDB Atlas Cloud:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/budgetflow?retryWrites=true&w=majority
```

---

### Step 3: Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### (Optional) Running the Standalone Express Backend
If you want to run the standalone Express server:
```bash
cd server
npm install
npm run dev
```
Express will run on `http://localhost:5000`.

---

## 📁 Directory Structure

```
budgetflowtracker-main/
├── .env.example                # Example environment variables
├── .env.local                  # Local MongoDB URI and secrets
├── next.config.mjs             # Next.js configuration
├── postcss.config.mjs          # Tailwind CSS PostCSS plugin config
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler config
│
├── server/                     # Standalone Express backend (Optional)
│   ├── package.json            # Express server dependencies
│   └── server.js               # Express REST API
│
└── src/
    ├── app/                    # Next.js App Router
    │   ├── api/                # Backend Node.js API endpoints
    │   │   ├── budgets/        # Budget route handlers (GET/POST)
    │   │   ├── data/           # Full data sync & import/reset
    │   │   └── expenses/       # Expense CRUD route handlers
    │   ├── globals.css         # Global styles & luxury design tokens
    │   ├── layout.tsx          # Root HTML layout & SEO metadata
    │   └── page.tsx            # Main client app entry point
    │
    ├── components/             # Reusable UI & Feature components
    │   ├── budget/             # Dashboard, Analytics, Expenses, History, Settings
    │   └── ui/                 # Accessible Radix UI components
    │
    ├── lib/                    # Shared utilities & database
    │   ├── budget/             # Types, calculations, storage, & API client
    │   ├── mongodb.ts          # Singleton cached Mongoose connection
    │   └── utils.ts            # Tailwind CSS class merger (cn)
    │
    └── models/                 # Mongoose Database Models
        ├── Budget.ts           # Monthly budget schema
        ├── Expense.ts          # Expense item schema
        └── Settings.ts         # User preferences schema
```

---

## 🔒 Security & Privacy Guarantee
- **Zero Lovable/Platform Trackers**: All proprietary SDKs, error beacons, and bot taggers have been permanently eliminated.
- **Local Fallback**: If the database is disconnected, data is safely maintained in your browser's `localStorage` and will resync upon reconnection.
- **No Third-Party Analytics**: Your financial figures belong solely to you.

---

## 📄 License
This project is open-source under the **MIT License**.
