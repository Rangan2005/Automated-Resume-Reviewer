// Global variables
let authToken = localStorage.getItem('authToken');
let currentUsername = localStorage.getItem('username');

// DOM Elements
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authError = document.getElementById('authError');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  if (authToken) {
    showApp();
  } else {
    showAuth();
  }
  
  setupAuthListeners();
  setupAppListeners();
});

// ==================== AUTH FUNCTIONS ====================
function showAuth() {
  authSection.classList.remove('hidden');
  appSection.classList.add('hidden');
}

function showApp() {
  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  document.getElementById('currentUser').textContent = currentUsername;
}

function showError(message) {
  authError.textContent = message;
  authError.classList.remove('hidden');
  setTimeout(() => authError.classList.add('hidden'), 5000);
}

function setupAuthListeners() {
  // Switch between login and register
  document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    authError.classList.add('hidden');
  });

  document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    authError.classList.add('hidden');
  });

  // Login
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
      showError('Please enter username and password');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        authToken = data.token;
        currentUsername = data.username;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('username', currentUsername);
        showApp();
      } else {
        showError(data.error || 'Login failed');
      }
    } catch (error) {
      showError('Connection error. Please try again.');
      console.error('Login error:', error);
    }
  });

  // Register
  document.getElementById('registerBtn').addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!username || !password) {
      showError('Please enter username and password');
      return;
    }

    if (password.length < 4) {
      showError('Password must be at least 4 characters');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        authToken = data.token;
        currentUsername = data.username;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('username', currentUsername);
        showApp();
      } else {
        showError(data.error || 'Registration failed');
      }
    } catch (error) {
      showError('Connection error. Please try again.');
      console.error('Register error:', error);
    }
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    authToken = null;
    currentUsername = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    showAuth();
    resetApp();
  });
}

// ==================== APP FUNCTIONS ====================
function setupAppListeners() {
  const fileInput = document.getElementById('resumeFile');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resetBtn = document.getElementById('resetBtn');

  // File selection
  fileInput.addEventListener('change', (e) => {
    const fileName = document.getElementById('fileName');
    if (e.target.files.length > 0) {
      fileName.textContent = e.target.files[0].name;
      analyzeBtn.disabled = false;
    } else {
      fileName.textContent = 'Choose PDF file';
      analyzeBtn.disabled = true;
    }
  });

  // Analyze button
  analyzeBtn.addEventListener('click', analyzeResume);

  // Reset button
  resetBtn.addEventListener('click', resetApp);
}

function resetApp() {
  document.getElementById('resumeFile').value = '';
  document.getElementById('fileName').textContent = 'Choose PDF file';
  document.getElementById('analyzeBtn').disabled = true;
  document.getElementById('results').classList.add('hidden');
  document.querySelector('.upload-section').classList.remove('hidden');
}

// Extract text from PDF using PDF.js
async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    let textContent = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      text.items.forEach(item => {
        textContent += item.str + " ";
      });
    }
    return textContent.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Analyze resume
async function analyzeResume() {
  const fileInput = document.getElementById('resumeFile');
  const loadingDiv = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');
  const uploadSection = document.querySelector('.upload-section');

  if (!fileInput.files.length) {
    alert('Please upload a PDF resume first!');
    return;
  }

  const file = fileInput.files[0];

  // Validate file type
  if (!file.type.includes('pdf')) {
    alert('Please upload a PDF file');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  uploadSection.classList.add('hidden');
  loadingDiv.classList.remove('hidden');
  resultsDiv.classList.add('hidden');

  try {
    // Extract text from PDF
    const resumeText = await extractTextFromPDF(file);

    if (!resumeText || resumeText.length < 50) {
      throw new Error('Could not extract enough text from PDF. Please ensure your PDF contains readable text.');
    }

    // Send to backend
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ resumeText })
    });

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      alert('Session expired. Please login again.');
      showAuth();
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze resume');
    }

    const data = await response.json();

    // Validate response structure
    if (!data.strengths || !data.weaknesses || !data.suggestions || !data.score) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response from AI');
    }

    // Display results
    displayResults(data);

  } catch (error) {
    alert('Error: ' + error.message);
    console.error('Analysis error:', error);
    uploadSection.classList.remove('hidden');
  } finally {
    loadingDiv.classList.add('hidden');
  }
}

// Display results
function displayResults(data) {
  const resultsDiv = document.getElementById('results');
  
  // Strengths
  const strengthsList = document.getElementById('strengths');
  strengthsList.innerHTML = Array.isArray(data.strengths) && data.strengths.length > 0
    ? data.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')
    : '<li>No specific strengths identified</li>';

  // Weaknesses
  const weaknessesList = document.getElementById('weaknesses');
  weaknessesList.innerHTML = Array.isArray(data.weaknesses) && data.weaknesses.length > 0
    ? data.weaknesses.map(w => `<li>${escapeHtml(w)}</li>`).join('')
    : '<li>No specific weaknesses identified</li>';

  // Suggestions
  const suggestionsList = document.getElementById('suggestions');
  suggestionsList.innerHTML = Array.isArray(data.suggestions) && data.suggestions.length > 0
    ? data.suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')
    : '<li>No specific suggestions available</li>';

  // Score
  const scoreElement = document.getElementById('score');
  const scoreFill = document.getElementById('scoreFill');
  scoreElement.textContent = data.score || 'N/A';

  // Animate score bar
  if (data.score && data.score.includes('/')) {
    const scoreValue = parseInt(data.score.split('/')[0]);
    const scoreMax = parseInt(data.score.split('/')[1]);
    const percentage = (scoreValue / scoreMax) * 100;
    setTimeout(() => {
      scoreFill.style.width = percentage + '%';
    }, 100);
  }

  resultsDiv.classList.remove('hidden');
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}