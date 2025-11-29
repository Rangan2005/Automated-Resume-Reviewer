import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Required to handle __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, "public")));

// Simple in-memory user storage (in production, use a database)
const users = new Map();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Registration endpoint
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  if (users.has(username)) {
    return res.status(409).json({ error: "Username already exists" });
  }

  users.set(username, { password, createdAt: new Date() });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ message: "Registration successful", token, username });
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const user = users.get(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ message: "Login successful", token, username });
});

// POST endpoint to Gemini API (protected with JWT)
app.post("/api/analyze", authenticateToken, async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ error: "No resume text provided" });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert HR professional and resume reviewer. Analyze the following resume and provide feedback.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no explanations, no extra text.

Format:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "score": "X/10"
}

Resume Content:
${resumeText}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return res.status(response.status).json({ 
        error: "AI service error", 
        details: errorText 
      });
    }

    const data = await response.json();
    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!aiText) {
      return res.status(500).json({ 
        error: "No response from AI",
        rawData: data 
      });
    }

    aiText = aiText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
      
      if (!parsed.strengths || !parsed.weaknesses || !parsed.suggestions || !parsed.score) {
        throw new Error("Invalid response structure");
      }
      
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("AI Text:", aiText);
      
      return res.json({
        strengths: ["Unable to parse AI response"],
        weaknesses: ["Please try again"],
        suggestions: ["Upload resume again"],
        score: "N/A",
        rawResponse: aiText
      });
    }

    res.json(parsed);
    
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📝 Make sure to set GOOGLE_API_KEY in your .env file`);
  });
}

// Export for Vercel
export default app;