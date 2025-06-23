export async function summarizeWithGemini(text) {
  const apiKey = "AIzaSyAzk_epRibbfcd2_g2ozq36kB-uwGUn9dE";
    

  const body = {
    contents: [{
      parts: [{ text: `Summarize this privacy policy and extract:
      - What personal data is collected
      - Why it is collected
      - Any potential risks
      - Display each in a short bullet and tag it: [DATA], [USE], [RISK]` }]
    }],
    generationConfig: { temperature: 0.5 }
  };

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
    
  );

  const result = await response.json();
  console.log("Sending to Gemini:", text);
console.log("Gemini Response:", result);
  return result?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary.";
}
