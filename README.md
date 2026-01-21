# SmartFinance
## An AI-Powered Financial Ecosystem with Cross-Platform Support

SmartFinance is a production-grade personal finance application that bridges the gap between raw bank data and actionable financial intelligence. By utilizing Large Language Models (LLMs) and a secure multi-profile architecture, it allows users to manage complex budgets and receive personalized coaching.

---

## 🚀 Live Demo

**Production URL:** [https://finance-manager-m3au.onrender.com](https://finance-manager-m3au.onrender.com)

### User Demo Account
Explore the full application with pre-loaded sample data:

- **Username:** `levifamily`
- **Password:** `123456`
- **Profile PIN:** `1234` (for all profiles)

*Note: This is a shared demo account. Data may be modified by other users.*

### Admin Panel (Optional)
Access administrative features at `/admin`:

- **Username:** `admin`
- **Password:** `123456`

*Want to create your own admin account? Use registration secret: `8d71a29d18feaa71e398cdc9946f0a5e`*

### Create Your Own Account
Feel free to register a new account to test the full onboarding flow, profile creation, and data management features.

---

### Platforms

* **Mobile:** A high-performance React Native (Expo) application. This is the flagship of the project, featuring custom hooks for modular logic, fluid UI transitions, and an optimized "AI Coach" interface.

* **Backend:** A scalable Node.js/Express API written in TypeScript. It follows a "Service-Model" architecture with specialized wrappers for DB transactions and AI orchestration.

* **Web Dashboard:** A React (Vite) website built with the same features as mobile and administrative data management.

---

### Key Features

1. **Smart AI Financial Coaching**

    1. **Context-Aware Financial Coaching:** The AI doesn't just look at a single transaction; it analyzes a 6-month window of your spending velocity.

       * **Data Aggregation:** The backend generates a comprehensive JSON context containing `recentlyClosedGlobalBudget`, `categoryProgress`, and `relevantAiHistory`.

       * **Behavioral Analysis:** Using `gpt-oss-120b`, the system identifies patterns (e.g., "Your grocery spending is 15% higher on weekends") and suggests actionable savings.

    2. **The "Defensive" AI Wrapper:** Working with LLMs can be unpredictable. I engineered a custom resilience layer to ensure the app never crashes due to AI formatting errors:

       * **Boundary Detection:** Uses custom regex to locate `{}` boundaries within the model's response, stripping away any conversational "noise" or hallucinations.

       * **State Management:** Implemented an asynchronous "Status Polling" pattern (idle → processing → completed) in `AiModel.ts` to ensure a smooth user experience while the model generates heavy reports.

    3. **Visual Insight Cards:** AI insights are delivered via high-impact "Insight Cards" in the mobile app, providing users with a quick summary of their financial health at a glance.

2. **Semantic AI Categorization Engine**
   
   Traditional financial apps rely on rigid "If/Else" statements to categorize spending. SmartFinance uses Semantic Mapping:

   * **Intelligent Parsing:** Takes raw bank files and uses `openai/gpt-oss-120b` (via Cerebras/HuggingFace) to map them to user-defined categories.

   * **Defensive Parsing:** A custom extraction utility uses boundary-detection to pull clean JSON from AI responses, ensuring system stability even if the LLM includes conversational text.

3. **Multi-Profile & Child-Account Architecture**
   
   Built for families and personal use, the system supports a hierarchical profile model:

   * **Atomic Profile Creation:** Uses MongoDB sessions to ensure that a profile, its expense document, and its AI history doc are created as a single unit (ACID compliance).

   * **Independent Security:** Each profile is protected by a secondary hashed PIN, allowing for "shared account, private data" scenarios.

4. **Advanced Budgeting Logic**
   
   * **Nested Tracking:** Manages a 3-tier financial hierarchy: Global Budget > Category Budget > Individual Transactions.

   * **Real-time Synchronization:** Leverages MongoDB `arrayFilters` and positional operators (such as `$[catFilter]`) to perform high-performance, atomic updates to nested objects directly in the DB engine.

---

###  📱 App Showcase (Mobile Version)

| Real-time Budget Health | Conversational AI Coach | Semantic Mapping |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/708a4906-dd9e-4be5-bbe4-31d292372973" width="100%" /> | <img src="https://github.com/user-attachments/assets/9f4b2ec9-96c1-4c0e-a230-cbddddf640d4" width="100%" /> | <img src="https://github.com/user-attachments/assets/186cd647-9a01-49ba-ab1d-4705afe3a9f7" width="100%" /> |

---

### 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React Native (Expo), React (Vite), Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB Atlas (Aggregation Pipelines, ACID Transactions) |
| **AI / ML** | Cerebras & HuggingFace Inference (`gpt-oss-120b`) |
| **Security** | JWT (Refresh Token Rotation), Bcrypt |
| **Infrastructure** | Cloudinary (Media), Render (Deployment) |

---

### 🔧 Local Development Setup

#### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

#### Installation

1. **Clone the repository:**
```bash
   git clone https://github.com/VainGer/finance-manager
   cd finance-manager
```

2. **Configure environment variables:**
   
   Create `.env` file in `server/dotenv/` directory:
```env
   MONGO_URI=your_mongodb_connection_string
   DB_NAME=smartfinance
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   HF_TOKEN=your_huggingface_token
   JWT_SECRET=your_jwt_secret
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   JWT_REFRESH_MAX_VALIDITY=30d
   JWT_ADMIN_ACCESS_EXPIRATION=1h
   ADMIN_REG_SECRET=8d71a29d18feaa71e398cdc9946f0a5e
```

3. **Run the backend:**
```bash
   cd server
   npm install
   npm run dev
```

4. **Run the mobile app:**
```bash
   cd client/app
   npm install
   npx expo start
```

5. **Run the web dashboard:**
```bash
   cd client/web
   npm install
   npm run dev
```

---

### 📄 License

This project was developed as a final capstone project for Practical Software Engineering degree at Shenkar College (2023-2025).


---

### 🙏 Acknowledgments

Built as part of the Practical Software Engineering program at Shenkar College of Engineering, Design and Art.
