require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer in-memory storage (max 5MB file size limit for sanity)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// In-memory data store
let scans = [];

// ROUTE 1: POST /api/scan
app.post('/api/scan', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    // Convert file buffer to base64 inlineData format
    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a plant health expert. Analyze this plant image and respond ONLY with valid JSON, no markdown, no explanation:
{
  "species": "common plant name",
  "scientific_name": "latin name",
  "health_score": integer 0-100,
  "status": "Healthy" or "Stressed" or "Critical",
  "diagnosis": "one sentence observation",
  "prescription": "one specific actionable fix",
  "is_plant": true or false
}
If no plant visible, is_plant false, health_score 0.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    const rawText = response.text();

    if (!rawText) {
      return res.status(500).json({ error: "Empty response from Gemini AI." });
    }

    // Clean JSON response from Gemini
    const cleaned = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .replace(/`/g, '')
      .replace(/^\s*json\s*/i, '')
      .trim();

    let diagnosis;
    try {
      diagnosis = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON:", rawText);
      return res.status(500).json({ error: "Failed to parse plant diagnosis data from AI response." });
    }

    if (diagnosis.is_plant === false || diagnosis.is_plant === 'false') {
      return res.status(200).json({ is_plant: false });
    }

    // Build scan object with randomized offsets near center of Amravati, India
    const scanResult = {
      id: Date.now(),
      species: diagnosis.species || "Unknown Plant",
      scientific_name: diagnosis.scientific_name || "Unknown Scientific Name",
      health_score: Math.max(0, Math.min(100, Number(diagnosis.health_score) || 0)),
      status: diagnosis.status || "Healthy",
      diagnosis: diagnosis.diagnosis || "No diagnosis provided.",
      prescription: diagnosis.prescription || "No prescription provided.",
      is_plant: true,
      lat: 20.9374 + (Math.random() - 0.5) * 0.04,
      lng: 77.7796 + (Math.random() - 0.5) * 0.04,
      timestamp: new Date().toISOString()
    };

    scans.push(scanResult);
    return res.status(200).json(scanResult);

  } catch (error) {
    console.error("Scan error:", error);
    return res.status(500).json({ error: "Internal server error during diagnosis: " + error.message });
  }
});

// ROUTE 2: GET /api/scans
app.get('/api/scans', (req, res) => {
  return res.status(200).json(scans);
});

// ROUTE 3: GET /api/stats
app.get('/api/stats', (req, res) => {
  const total = scans.length;
  const avg_health = total > 0 
    ? Math.round(scans.reduce((acc, curr) => acc + curr.health_score, 0) / total) 
    : 0;

  const uniqueSpeciesSet = new Set(scans.map(s => (s.species || '').toLowerCase().trim()));
  const unique_species = uniqueSpeciesSet.size;

  let trend = "stable";
  if (avg_health > 70) trend = "improving";
  else if (avg_health < 50) trend = "declining";

  return res.status(200).json({
    total,
    avg_health,
    unique_species,
    trend
  });
});

// ROUTE 4: GET / (Fallback - Express static handles index.html, but keeping this explicitly as requested)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
