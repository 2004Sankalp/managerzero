# ⚡ ManagerZero

> **The AI-Powered Chief of Staff for Engineering Managers**

ManagerZero is a full-stack AI platform that automates the operational overhead of engineering management. It uses a multi-agent AI architecture (powered by Google Gemini) to handle daily standups, extract action items from meetings, and analyze client feedback sentiment — so engineering managers can focus on leading, not chasing updates.

---

## 🚀 Features

### 🧠 Multi-Agent AI Backend
ManagerZero runs a fleet of specialized AI agents, each with a single, focused responsibility:

| Module | Agents |
|---|---|
| **Standup** | Progress Analyzer, Mood Analyzer, Blocker Detector, Briefing Writer |
| **Meeting** | Summarizer, Task Extractor, Risk Detector, Email Drafter |
| **Feedback** | Sentiment Analyzer, Theme Extractor, Churn Predictor, Action Recommender |

### 📋 Automated Standups
- Collect and summarize daily team progress
- Detect blockers automatically
- Generate a written morning briefing for the manager
- Track sprint health score (1–10) with at-risk counts

### 🗓️ Meeting Intelligence
- Paste a meeting transcript → get an instant summary
- Extract all action items with owners and deadlines
- Detect risks and decisions from conversations
- Auto-draft follow-up emails to stakeholders

### 💬 Feedback & Sentiment Analysis
- Analyze client or team feedback for sentiment trends
- Extract recurring themes across multiple submissions
- Predict churn risk from feedback signals
- Generate recommended actions based on insights

### 📊 Manager Dashboard
- Real-time metrics overview
- Role-based access (Manager vs Employee views)
- Clean, dark-mode UI with smooth animations

---

## 🏗️ Tech Stack

### Frontend (`managerzero/`)
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI Framework & Build Tool |
| Tailwind CSS 3 | Styling |
| React Router v7 | Navigation & Role-based routing |
| Motion (Framer Motion) | Animations |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend (`server/`)
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API Server |
| Google Gemini API (`@google/genai`) | AI Agent Engine |
| Resend | Email delivery |
| express-rate-limit | API protection (1000 req / 15 min) |
| express-validator | Input validation |

---

## 📁 Project Structure

```
hackathon/
├── managerzero/              # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Marketing landing page
│   │   │   ├── Login.jsx             # Auth page
│   │   │   ├── Dashboard.jsx         # Manager dashboard
│   │   │   ├── Standup.jsx           # Daily standup module
│   │   │   ├── Meetings.jsx          # Meeting intelligence module
│   │   │   ├── Feedback.jsx          # Sentiment & feedback module
│   │   │   ├── ClientFeedbackForm.jsx # Public feedback form
│   │   │   └── employee/
│   │   │       └── Dashboard.jsx     # Employee view
│   │   ├── components/               # Reusable UI components
│   │   ├── context/AppContext.jsx    # Global state
│   │   └── services/api.js           # API client
│   └── public/assets/                # Static assets (video, images)
│
└── server/                   # Node.js Backend
    ├── agents/
    │   ├── standup/           # 4 standup AI agents
    │   ├── meeting/           # 4 meeting AI agents
    │   └── feedback/          # 4 feedback AI agents
    ├── orchestrator/          # Coordinates agent pipelines
    ├── routes/                # API route handlers
    ├── middleware/            # Logger, error handler, validator
    └── services/
        ├── geminiClient.js    # Gemini AI wrapper
        └── emailService.js    # Email via Resend
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [Google Gemini API Key](https://aistudio.google.com/) (free tier available)
- A [Resend API Key](https://resend.com/) (for email features, optional)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/managerzero.git
cd managerzero
```

---

### 2. Setup the Backend

```bash
cd server
npm install
```

Create your environment file:
```bash
cp .env.example .env   # Then edit .env with your actual keys
```

Add your keys to `server/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
RESEND_API_KEY=your_resend_api_key_here   # Optional
PORT=5000
```

Start the server:
```bash
node index.js
```

The server will run at `http://localhost:5000`

---

### 3. Setup the Frontend

Open a new terminal:

```bash
cd managerzero
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`

---

## 🔌 API Endpoints

### Health Check
```
GET /health
```

### Standup Module
```
POST /api/standup/analyze        # Analyze standup updates
```

### Meeting Module
```
POST /api/meeting/analyze        # Analyze meeting transcript
```

### Feedback Module
```
POST /api/feedback/analyze       # Analyze feedback submissions
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini AI API key |
| `RESEND_API_KEY` | ⚠️ Optional | For email drafting features |
| `PORT` | ⚠️ Optional | Server port (default: 5000) |

> ⚠️ **Never commit your `.env` file.** It is already excluded via `.gitignore`.

---

## 🛡️ Security

- `.env` files are git-ignored — secrets never leave your machine
- Rate limiting: 1000 requests per 15-minute window per IP
- Input validation on all API endpoints via `express-validator`
- CORS configured to allow only the frontend origin

---

## 📬 Contact

Built with ❤️ for hackathon.

**Sankalp Kumar** — [2004sankalp@gmail.com](mailto:2004sankalp@gmail.com)
