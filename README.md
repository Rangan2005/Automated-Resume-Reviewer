# 🧠 AI-Powered Resume Reviewer v2.0

An intelligent web application that analyzes PDF resumes using **Google Gemini AI** with secure **JWT authentication**. Get instant feedback on strengths, weaknesses, and suggestions with a modern, beautiful UI.

---

## ✨ New Features in v2.0
- 🔐 **JWT Authentication** - Secure user login/registration
- 🎨 **Modern UI/UX** - Beautiful gradient design with smooth animations
- 🐛 **Error Handling** - Robust error handling for API calls
- 📊 **Animated Results** - Interactive score display with progress bars
- 📱 **Responsive Design** - Works perfectly on all devices

---

## 🚀 Features
- 📄 Upload any **PDF resume**
- 🤖 Uses **Gemini 2.0 Flash** AI for intelligent analysis
- 🔐 Secure **JWT-based authentication**
- 🧩 Structured feedback (strengths, weaknesses, suggestions, score)
- ⚡ Beautiful and responsive UI with smooth animations
- 🎯 Real-time feedback with loading states

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), PDF.js
- **Backend:** Node.js, Express.js
- **Authentication:** JSON Web Tokens (JWT)
- **AI Model:** Google Gemini 2.0 Flash API
- **Environment Management:** dotenv

---

## 📁 Project Structure
```
ai-resume-reviewer/
│
├── public/
│   ├── index.html      # Main HTML with auth UI
│   ├── style.css       # Modern, responsive styles
│   └── script.js       # Frontend logic with auth
│
├── server.js           # Express server with JWT auth
├── package.json        # Dependencies and scripts
├── .env                # Environment variables (create this)
├── .env.example        # Template for .env file
├── .gitignore         # Git ignore rules
│
└── README.md          # This file
```

---

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites
- Node.js >= 18.0.0
- npm (comes with Node.js)
- A Google Gemini API key

### 2️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/ai-resume-reviewer.git
cd ai-resume-reviewer
```

### 3️⃣ Install dependencies
```bash
npm install
```

### 4️⃣ Set up environment variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Edit `.env` and add your keys:
```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
JWT_SECRET=your_secure_random_string_here
```

**Get your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy and paste it into your `.env` file

**Generate a secure JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5️⃣ Start the server
```bash
npm start
```

Server will start on:
```
http://localhost:5000
```

### 6️⃣ Open the application
Open your browser and navigate to:
```
http://localhost:5000
```

---

## 🔐 Authentication Flow

1. **First Time Users:**
   - Click "Sign Up"
   - Enter a username and password
   - You'll be automatically logged in

2. **Returning Users:**
   - Enter your username and password
   - Click "Sign In"

3. **Session Management:**
   - Your session is stored securely using JWT
   - Tokens are valid for 24 hours
   - You can sign out anytime

---

## 📝 How to Use

1. **Login/Register** to access the app
2. **Upload** a PDF resume (max 5MB)
3. **Click** "Analyze Resume"
4. **Wait** for AI to process (usually 5-10 seconds)
5. **Review** the detailed feedback:
   - ⭐ Strengths
   - ⚠️ Areas to Improve
   - 💡 Recommendations
   - 📊 Overall Score
6. **Analyze** another resume or sign out

---

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Create new account
- `POST /api/login` - Sign in
- `POST /api/analyze` - Analyze resume (requires JWT token)
- `GET /api/health` - Health check

---

## 🛡️ Security Features

- ✅ JWT token-based authentication
- ✅ Secure password handling (basic - upgrade to bcrypt in production)
- ✅ API key stored server-side only
- ✅ Token expiration (24 hours)
- ✅ Protected API endpoints
- ✅ Input validation
- ✅ XSS protection with HTML escaping

---

## 🚀 Production Deployment Tips

**Before deploying to production:**

1. **Use a proper database** (MongoDB, PostgreSQL, etc.)
2. **Hash passwords** with bcrypt:
   ```bash
   npm install bcrypt
   ```
3. **Use environment variables** for all secrets
4. **Enable HTTPS** with SSL/TLS
5. **Add rate limiting** to prevent abuse
6. **Implement refresh tokens** for better security
7. **Add logging** for monitoring
8. **Set up CORS** properly
9. **Use a strong JWT secret** (32+ characters)

---

## 🐛 Troubleshooting

### "Error: Failed to execute 'json' on 'Response'"
- **Fixed in v2.0** with proper error handling
- Server now returns consistent JSON responses
- Better validation of API responses

### "Session expired"
- Your JWT token has expired (24 hours)
- Simply login again

### "Connection error"
- Check if server is running on port 5000
- Check your internet connection
- Verify GOOGLE_API_KEY in .env

### PDF not parsing correctly
- Ensure PDF contains readable text (not just images)
- Try a different PDF if issues persist
- Check file size (must be under 5MB)

---

## 📚 Learning Resources

This project is beginner-friendly! Here's what you can learn:

- **Frontend:** Modern HTML/CSS/JavaScript
- **Backend:** Node.js & Express.js
- **Authentication:** JWT implementation
- **API Integration:** Working with external APIs
- **Error Handling:** Try-catch blocks and validation
- **Async/Await:** Modern JavaScript patterns
- **PDF Processing:** Using PDF.js library

---

## 🧩 Example Output
```json
{
  "strengths": [
    "Strong technical skills in Python and JavaScript",
    "Relevant work experience at top tech companies",
    "Clear and well-structured resume layout"
  ],
  "weaknesses": [
    "Lacks quantifiable achievements",
    "Missing leadership experience",
    "No mention of soft skills"
  ],
  "suggestions": [
    "Add metrics to demonstrate impact (e.g., 'Increased efficiency by 30%')",
    "Include leadership roles or team management experience",
    "Add a skills section highlighting both technical and soft skills"
  ],
  "score": "7/10"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📜 License

MIT License © 2025

---

## 💡 Author

**Subhrajyoti Basu**

If you find this useful:
- ⭐ Star this repository
- 🐛 Report issues
- 💡 Suggest new features
- 🤝 Contribute to the project

---

## 🔮 Future Enhancements

- [ ] Export results as PDF
- [ ] Resume comparison feature
- [ ] ATS (Applicant Tracking System) compatibility check
- [ ] Multiple resume templates suggestions
- [ ] Email notifications
- [ ] User dashboard with history
- [ ] OAuth integration (Google, GitHub)
- [ ] Resume builder tool

---

## ⚠️ Disclaimer

This tool provides AI-generated suggestions. Always review and customize feedback according to your specific needs. The AI's analysis should be used as guidance, not absolute truth.