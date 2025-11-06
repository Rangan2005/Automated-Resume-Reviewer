# 🧠 AI-Powered Resume Reviewer

An intelligent web app that analyzes PDF resumes using **Google Gemini AI**, highlighting strengths, weaknesses, and suggestions — and gives an overall score.

---

## 🚀 Features
- 📄 Upload any **PDF resume**
- 🤖 Uses **Gemini AI** to analyze and review
- 🧩 Outputs structured JSON (strengths, weaknesses, suggestions, score)
- ⚡ Beautiful and responsive UI

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript, PDF.js  
- **Backend:** Node.js, Express  
- **AI Model:** Gemini 2.0 Flash API  
- **Environment Management:** dotenv  

---

## 📁 Project Structure
```
ai-resume-reviewer/
│
├── index.html
├── style.css
├── script.js
│
├── server.js
├── package.json
├── package-lock.json
├── .env                # stores your Gemini API key (NOT committed)
├── .gitignore
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/ai-resume-reviewer.git
cd ai-resume-reviewer
```

---

### 2️⃣ Install dependencies
```bash
npm install
```

---

### 3️⃣ Add your Gemini API key
Create a file named `.env` in the project root:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> ⚠️ Never share or commit your `.env` file!

---

### 4️⃣ Start the backend server
```bash
node server.js
```

Server will start on:
```
http://localhost:5000
```

---

### 5️⃣ Open the frontend
You can directly open `index.html` in your browser, **or** serve it via VS Code Live Server.

When you upload a PDF and click “Analyze Resume”,  
the frontend sends the extracted text to your backend (`/analyze` route),  
which then communicates with Gemini AI securely.

---

## 🧩 Environment Variables
| Variable | Description |
|-----------|--------------|
| `GEMINI_API_KEY` | Your API key from [Google AI Studio](https://aistudio.google.com/) |

---

## 🧰 Development Tips
- Make sure Node.js ≥ **18.0.0**
- Keep `.env` and `node_modules/` out of Git (`.gitignore` handles this)
- You can modify the prompt in `server.js` to change the AI’s tone or format

---

## 🧾 Example Output
```json
{
  "strengths": ["Strong academic background", "Good technical skills"],
  "weaknesses": ["Lack of leadership experience", "No mention of certifications"],
  "suggestions": ["Add a summary section", "Include measurable achievements"],
  "score": "8/10"
}
```

---

## 🛡️ Security Notes
- API key is stored **server-side** only (safe from browser exposure)
- Frontend communicates only with your local backend
- Use `.env` and `.gitignore` to protect credentials

---

## 📜 License
MIT License © 2025

---

## 💡 Author
Developed by **Subhrajyoti Basu**  
If you find this useful, give it a ⭐ on GitHub!
