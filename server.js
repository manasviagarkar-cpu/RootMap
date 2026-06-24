require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── In-Memory State ────────────────────────────────────────────────────────
let scans = [];

let myPlants = [
  { id: 1, name: 'Balcony Tulsi', species: 'Tulsi', stage: 3, daysAlive: 22, streak: 6, email: 'demo@rootmap.app', healthScore: 88, dailyTasks: { water: true, check: false, snap: false }, lat: 20.9374, lng: 77.7796 },
  { id: 2, name: 'Kitchen Mint', species: 'Mint',   stage: 4, daysAlive: 41, streak: 12, email: 'demo@rootmap.app', healthScore: 74, dailyTasks: { water: false, check: true, snap: false }, lat: 20.9412, lng: 77.7834 },
];

let communityPosts = [
  {
    id: 1, title: 'My Tulsi is flourishing! 🌿 28 days strong', species: 'Tulsi', daysAlive: 28,
    imgKey: 'tulsi', lat: 20.9374, lng: 77.7796, user: 'GreenThumb_Aman', aiScore: 92,
    upvotes: 14, timestamp: new Date(Date.now() - 3600000).toISOString(),
    comments: [{ user: 'PlantNerd99', text: 'Incredible growth! What fertilizer are you using?', time: new Date(Date.now() - 1800000).toISOString() }]
  },
  {
    id: 2, title: 'Anyone else have yellowing leaves on their Tomatoes?', species: 'Tomato', daysAlive: 35,
    imgKey: 'tomato', lat: 20.9412, lng: 77.7856, user: 'RootMapper_Priya', aiScore: 58,
    upvotes: 7, timestamp: new Date(Date.now() - 7200000).toISOString(),
    comments: [{ user: 'BioFarmer_Raj', text: 'Try nitrogen-rich fertilizer, looks like deficiency!', time: new Date(Date.now() - 3600000).toISOString() }]
  },
  {
    id: 3, title: 'Sweet Basil blooming beautifully on my window sill 🌱', species: 'Sweet Basil', daysAlive: 18,
    imgKey: 'basil', lat: 20.9280, lng: 77.7720, user: 'UrbanGarden_Meera', aiScore: 87,
    upvotes: 21, timestamp: new Date(Date.now() - 10800000).toISOString(),
    comments: []
  }
];

const nurseries = [
  { id: 1, name: 'Green Paradise Nursery',   address: 'Rajkamal Chowk, Amravati',     contact: '+91-98230-11234', rating: 4.7, lat: 20.9390, lng: 77.7850, speciality: 'Herbs & Medicinal' },
  { id: 2, name: 'Prakriti Plant House',      address: 'Near Gandhi Chowk, Amravati',  contact: '+91-94234-87654', rating: 4.4, lat: 20.9320, lng: 77.7780, speciality: 'Ornamental & Fruit' },
  { id: 3, name: 'Nature\'s Basket',          address: 'Badnera Road, Amravati',        contact: '+91-77210-55678', rating: 4.2, lat: 20.9450, lng: 77.7900, speciality: 'Organic & Vegetable' },
  { id: 4, name: 'Hari Om Garden Centre',     address: 'Hanuman Nagar, Amravati',       contact: '+91-85030-44901', rating: 4.5, lat: 20.9230, lng: 77.7810, speciality: 'Trees & Shrubs' },
];

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// POST /api/scan - AI plant diagnosis
app.post('/api/scan', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Gemini API key not configured.' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a plant health expert. Analyze this plant image and respond ONLY with valid JSON, no markdown:
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
      { inlineData: { data: req.file.buffer.toString('base64'), mimeType: req.file.mimetype } }
    ]);

    const rawText = result.response.text();
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').replace(/`/g, '').trim();

    let diagnosis;
    try { diagnosis = JSON.parse(cleaned); }
    catch { return res.status(500).json({ error: 'Failed to parse AI response.' }); }

    if (diagnosis.is_plant === false) return res.status(200).json({ is_plant: false });

    const scanResult = {
      id: Date.now(),
      species: diagnosis.species || 'Unknown Plant',
      scientific_name: diagnosis.scientific_name || '',
      health_score: Math.max(0, Math.min(100, Number(diagnosis.health_score) || 0)),
      status: diagnosis.status || 'Healthy',
      diagnosis: diagnosis.diagnosis || '',
      prescription: diagnosis.prescription || '',
      is_plant: true,
      lat: 20.9374 + (Math.random() - 0.5) * 0.04,
      lng: 77.7796 + (Math.random() - 0.5) * 0.04,
      timestamp: new Date().toISOString()
    };

    scans.push(scanResult);
    return res.status(200).json(scanResult);
  } catch (err) {
    console.error('Scan error:', err);
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
});

// GET /api/scans
app.get('/api/scans', (req, res) => res.json(scans));

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const total = scans.length;
  const avg_health = total > 0 ? Math.round(scans.reduce((a, b) => a + b.health_score, 0) / total) : 0;
  const unique_species = new Set(scans.map(s => s.species.toLowerCase())).size;
  return res.json({ total, avg_health, unique_species });
});

// GET /api/nurseries
app.get('/api/nurseries', (req, res) => res.json(nurseries));

// ── My Plants API ──────────────────────────────────────────────────────────
// GET /api/my-plants
app.get('/api/my-plants', (req, res) => res.json(myPlants));

// POST /api/my-plants
app.post('/api/my-plants', (req, res) => {
  const { name, species, email } = req.body;
  if (!name || !species) return res.status(400).json({ error: 'name and species required' });
  const newPlant = {
    id: Date.now(),
    name, species, email: email || '',
    stage: 1, daysAlive: 0, healthScore: 75, streak: 0,
    dailyTasks: { water: false, check: false, snap: false },
    lat: 20.9374 + (Math.random() - 0.5) * 0.05,
    lng: 77.7796 + (Math.random() - 0.5) * 0.05,
    createdAt: new Date().toISOString()
  };
  myPlants.push(newPlant);
  return res.status(201).json(newPlant);
});

// POST /api/my-plants/:id/stage
app.post('/api/my-plants/:id/stage', (req, res) => {
  const plant = myPlants.find(p => p.id === Number(req.params.id));
  if (!plant) return res.status(404).json({ error: 'Plant not found' });
  
  const newStage = Number(req.body.stage);
  if (newStage >= 1 && newStage <= 6) {
    plant.stage = newStage;
    plant.daysAlive = (newStage - 1) * 7;
  }

  const STAGES = ["Seed", "Sprout", "Seedling", "Vegetative", "Flowering", "Fruiting"];
  const stageName = STAGES[plant.stage - 1];
  const emailSent = {
    to: plant.email || 'grower@rootmap.org',
    subject: `🌱 RootMap Growth Alert: ${plant.name} reached ${stageName} stage!`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background: #f8fafc;">
        <h2 style="color: #16a34a;">🌱 RootMap Growth Update!</h2>
        <p>Congratulations! Your plant <strong>${plant.name}</strong> (${plant.species}) has successfully grown into the <strong>${stageName}</strong> stage!</p>
        <p>Current plant age is <strong>${plant.daysAlive} days</strong> with a care health score of <strong>${plant.healthScore}%</strong>.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 11px; color: #64748b;">This email notification was automatically sent by the RootMap Grow Companion because your plant advanced stages.</p>
      </div>
    `
  };

  console.log(`[MOCK EMAIL SEND] To: ${emailSent.to} | Subject: ${emailSent.subject}`);
  return res.json({ plant, emailSent });
});

// POST /api/my-plants/:id/task
app.post('/api/my-plants/:id/task', (req, res) => {
  const plant = myPlants.find(p => p.id === Number(req.params.id));
  if (!plant) return res.status(404).json({ error: 'Plant not found' });

  const { taskName } = req.body;
  if (plant.dailyTasks && taskName in plant.dailyTasks) {
    plant.dailyTasks[taskName] = !plant.dailyTasks[taskName];
    if (plant.dailyTasks[taskName]) {
      plant.streak += 1;
      plant.healthScore = Math.min(100, plant.healthScore + 5);
    } else {
      plant.streak = Math.max(0, plant.streak - 1);
      plant.healthScore = Math.max(0, plant.healthScore - 5);
    }
  }
  return res.json(plant);
});

// DELETE /api/plants/:id and /api/my-plants/:id
app.delete(['/api/plants/:id', '/api/my-plants/:id'], (req, res) => {
  const idx = myPlants.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Plant not found' });
  myPlants.splice(idx, 1);
  return res.json({ success: true });
});

// ─── Community Posts API ────────────────────────────────────────────────────
// GET /api/community/posts
app.get('/api/community/posts', (req, res) => {
  const mapped = communityPosts.map(p => ({
    ...p,
    health_score: p.health_score !== undefined ? p.health_score : p.aiScore
  }));
  return res.json(mapped.slice().reverse());
});

// POST /api/community/posts
app.post('/api/community/posts', (req, res) => {
  const { title, species, daysAlive, imgKey, lat, lng, user, image, health_score } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  
  const score = Number(health_score) || Math.floor(55 + Math.random() * 40);
  const post = {
    id: Date.now(),
    title,
    species: species || 'Unknown',
    daysAlive: Number(daysAlive) || 1,
    imgKey: imgKey || 'basil',
    image: image || '',
    lat: Number(lat) || 20.9374,
    lng: Number(lng) || 77.7796,
    user: user || 'Anonymous Grower',
    aiScore: score,
    health_score: score,
    upvotes: 0,
    timestamp: new Date().toISOString(),
    comments: []
  };
  communityPosts.push(post);
  return res.status(201).json(post);
});

// POST /api/community/posts/:id/upvote
app.post('/api/community/posts/:id/upvote', (req, res) => {
  const post = communityPosts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Not found' });
  post.upvotes++;
  return res.json(post);
});

// POST /api/community/posts/:id/comment or comments
app.post(['/api/community/posts/:id/comment', '/api/community/posts/:id/comments'], (req, res) => {
  const post = communityPosts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Not found' });
  const { user, text } = req.body;
  if (!text) return res.status(400).json({ error: 'comment text required' });
  const comment = { user: user || 'Grower', text, time: new Date().toISOString() };
  post.comments.push(comment);
  return res.json(comment);
});

// ─── Leaderboard API ────────────────────────────────────────────────────────
// GET /api/leaderboard
app.get('/api/leaderboard', (req, res) => {
  const demo = [
    { rank: 1, user: 'BioFarmer_Raj',       plants: 12, plantsCount: 12, avgHealth: 91, badge: '🥇', streak: 47 },
    { rank: 2, user: 'GreenThumb_Aman',      plants: 9,  plantsCount: 9,  avgHealth: 88, badge: '🥈', streak: 28 },
    { rank: 3, user: 'UrbanGarden_Meera',    plants: 8,  plantsCount: 8,  avgHealth: 85, badge: '🥉', streak: 21 },
    { rank: 4, user: 'RootMapper_Priya',     plants: 6,  plantsCount: 6,  avgHealth: 79, badge: '🌟', streak: 14 },
    { rank: 5, user: 'NatureLover_Sanjay',   plants: 5,  plantsCount: 5,  avgHealth: 72, badge: '🌿', streak: 9 },
  ];
  // Inject current user's plants into leaderboard
  const yourPlants = myPlants.length;
  const yourHealth = myPlants.length > 0
    ? Math.round(myPlants.reduce((a, b) => a + b.healthScore, 0) / myPlants.length)
    : 0;
  const yourStreak = 6;
  if (yourPlants > 0) {
    demo.push({ rank: '—', user: 'You 🌱', plants: yourPlants, plantsCount: yourPlants, avgHealth: yourHealth, badge: '🪴', streak: yourStreak });
  }
  return res.json(demo);
});

// Fallback
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`🌿 RootMap server running on http://localhost:${PORT}`));
