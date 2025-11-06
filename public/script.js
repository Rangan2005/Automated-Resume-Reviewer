// Extract text from PDF using PDF.js
async function extractTextFromPDF(file) {
  const pdfData = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  let textContent = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    text.items.forEach(item => {
      textContent += item.str + " ";
    });
  }
  return textContent;
}

document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("resumeFile");
  const loadingDiv = document.getElementById("loading");
  const resultsDiv = document.getElementById("results");

  if (!fileInput.files.length) {
    alert("Please upload a PDF resume first!");
    return;
  }

  const file = fileInput.files[0];
  loadingDiv.style.display = "block";
  resultsDiv.classList.add("hidden");

  try {
    const resumeText = await extractTextFromPDF(file);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText })
    });

    const data = await response.json();
    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Clean any markdown wrappers like ```json ... ```
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("Gemini Raw Response:", aiText);

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      console.error("JSON parse error:", err, aiText);
      parsed = { strengths: [], weaknesses: [], suggestions: [], score: "N/A" };
    }

    // Fill UI
    document.getElementById("strengths").innerHTML =
      parsed.strengths?.map(s => `<li>${s}</li>`).join("") || "<li>No data</li>";

    document.getElementById("weaknesses").innerHTML =
      parsed.weaknesses?.map(w => `<li>${w}</li>`).join("") || "<li>No data</li>";

    document.getElementById("suggestions").innerHTML =
      parsed.suggestions?.map(s => `<li>${s}</li>`).join("") || "<li>No data</li>";

    document.getElementById("score").innerText = parsed.score || "N/A";

    resultsDiv.classList.remove("hidden");
  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    loadingDiv.style.display = "none";
  }
});