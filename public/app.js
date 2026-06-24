// RootMap Frontend Application Logic

// ─── Constants & Configurations ──────────────────────
const AMRAVATI = [20.9374, 77.7796];

const SEED_PINS = [
  { lat: 20.9374, lng: 77.7796, species: 'Neem',           score: 88, status: 'Healthy' },
  { lat: 20.9412, lng: 77.7834, species: 'Tulsi',          score: 92, status: 'Healthy' },
  { lat: 20.9290, lng: 77.7720, species: 'Mango',          score: 45, status: 'Stressed' },
  { lat: 20.9501, lng: 77.7910, species: 'Banana',         score: 31, status: 'Critical' },
  { lat: 20.9338, lng: 77.7650, species: 'Peepal',         score: 76, status: 'Healthy' },
  { lat: 20.9455, lng: 77.7780, species: 'Gulmohar',       score: 85, status: 'Healthy' },
  { lat: 20.9210, lng: 77.7860, species: 'Hibiscus',       score: 23, status: 'Critical' },
  { lat: 20.9360, lng: 77.7950, species: 'Curry Leaf',     score: 79, status: 'Healthy' },
  { lat: 20.9470, lng: 77.7830, species: 'Rose',           score: 55, status: 'Stressed' },
  { lat: 20.9280, lng: 77.7760, species: 'Papaya',         score: 18, status: 'Critical' }
];

const DEMO_PLANTS = [
  {
    species: 'Sweet Basil',
    scientific_name: 'Ocimum basilicum',
    health_score: 91,
    status: 'Healthy',
    diagnosis: 'Thriving with dense green foliage.',
    prescription: 'Pinch off flower buds as they appear to extend the harvest season and encourage bushy growth.',
    is_plant: true,
    svg: `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f1a0f'/><text x='200' y='130' font-size='80' text-anchor='middle'>🌿</text><text x='200' y='195' font-size='22' text-anchor='middle' fill='%2322c55e' font-family='Arial' font-weight='bold'>Sweet Basil</text><text x='200' y='225' font-size='13' text-anchor='middle' fill='%236b7280' font-family='Arial'>Demo Mode — Ocimum basilicum</text></svg>`
  },
  {
    species: 'Tomato Plant',
    scientific_name: 'Solanum lycopersicum',
    health_score: 58,
    status: 'Stressed',
    diagnosis: 'Mild nitrogen deficiency — yellowing on lower leaves.',
    prescription: 'Apply a nitrogen-rich liquid fertilizer and water consistently.',
    is_plant: true,
    svg: `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f1a0f'/><text x='200' y='130' font-size='80' text-anchor='middle'>🍅</text><text x='200' y='195' font-size='22' text-anchor='middle' fill='%23f59e0b' font-family='Arial' font-weight='bold'>Tomato Plant</text><text x='200' y='225' font-size='13' text-anchor='middle' fill='%236b7280' font-family='Arial'>Demo Mode — Solanum lycopersicum</text></svg>`
  },
  {
    species: 'Aloe Vera',
    scientific_name: 'Aloe barbadensis miller',
    health_score: 82,
    status: 'Healthy',
    diagnosis: 'Strong succulent growth, reduce watering frequency.',
    prescription: 'Allow the soil to dry out completely between waterings to prevent root rot.',
    is_plant: true,
    svg: `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f1a0f'/><text x='200' y='130' font-size='80' text-anchor='middle'>🪴</text><text x='200' y='195' font-size='22' text-anchor='middle' fill='%2322c55e' font-family='Arial' font-weight='bold'>Aloe Vera</text><text x='200' y='225' font-size='13' text-anchor='middle' fill='%236b7280' font-family='Arial'>Demo Mode — Aloe barbadensis miller</text></svg>`
  }
];

const SOIL_PRESETS = {
  "Tomato": { ph: "6.0 - 6.8", npk: "5 - 10 - 10", mix: "40% garden soil, 30% compost, 20% cocopeat, 10% perlite sand. Needs heavy potassium for fruiting." },
  "Tulsi": { ph: "6.5 - 7.5", npk: "10 - 10 - 10", mix: "50% rich loamy soil, 30% organic manure/compost, 20% river sand for good drainage." },
  "Sweet Basil": { ph: "6.0 - 7.0", npk: "12 - 4 - 8", mix: "40% light potting soil, 30% coco peat, 20% organic compost, 10% vermiculite." },
  "Aloe Vera": { ph: "7.0 - 8.0", npk: "10 - 40 - 10", mix: "50% coarse sand/perlite, 30% garden loam, 20% peat moss. Cactus/succulent mix standard." },
  "Mint": { ph: "6.5 - 7.0", npk: "10 - 10 - 10", mix: "60% rich loamy organic compost, 40% cocopeat. Likes moist, damp soil conditions." },
  "Rose": { ph: "6.0 - 6.5", npk: "15 - 30 - 15", mix: "40% clay loam soil, 40% well-rotted horse manure/compost, 20% peat." },
  "Neem": { ph: "6.2 - 7.0", npk: "10 - 15 - 10", mix: "70% sandy loam garden soil, 20% compost, 10% perlite. Extremely drought-resistant." }
};

const STAGES = ["Seed", "Sprout", "Seedling", "Vegetative", "Flowering", "Fruiting"];

// ─── Application State ──────────────────────────────
let map = null;
let scansLayer = null;
let socialLayer = null;
let nurseriesLayer = null;

let localScans = [];
let myPlants = [];
let activePlantId = null;
let activeScope = 'city';

// Three.js visualizer variables
let scene, camera, renderer, controls, plantGroup;

// Demo scan variables
let demoIndex = 0;
let selectedFile = null;
let localStream = null;

// ─── DOM References ──────────────────────────────────
// Toggle switches (loaded dynamically in listeners)

// Scan components
const uploadZone     = document.getElementById('upload-zone');
const fileInput      = document.getElementById('file-input');
const uploadDefault  = document.getElementById('upload-default');
const uploadPreview  = document.getElementById('upload-preview');
const previewImg     = document.getElementById('preview-img');
const fileNameLabel  = document.getElementById('file-name-label');
const clearBtn       = document.getElementById('clear-btn');
const scanBtn        = document.getElementById('scan-btn');
const scanIcon       = document.getElementById('scan-icon');
const scanLabel      = document.getElementById('scan-label');
const scanSpinner    = document.getElementById('scan-spinner');
const demoBtn        = document.getElementById('demo-btn');
const cameraBtn      = document.getElementById('camera-btn');
const cameraContainer = document.getElementById('camera-container');
const cameraStream   = document.getElementById('camera-stream');
const btnCapture     = document.getElementById('btn-capture');
const btnCloseCamera = document.getElementById('btn-close-camera');
const errorBox       = document.getElementById('error-box');
const errorText      = document.getElementById('error-text');
const resultCard     = document.getElementById('result-card');
const scoreRing      = document.getElementById('score-ring');
const scoreDisplay   = document.getElementById('score-display');
const statusPill     = document.getElementById('status-pill');
const speciesName    = document.getElementById('species-name');
const cardSubtitle   = document.getElementById('card-subtitle');
const diagnosisText  = document.getElementById('diagnosis-text');
const prescriptionText = document.getElementById('prescription-text');
const fallbackBanner = document.getElementById('fallback-banner') || document.createElement('div');

const navScanCount   = document.getElementById('nav-scan-count');
const ciTotal        = document.getElementById('ci-total');
const ciAvg          = document.getElementById('ci-avg');
const ciInsight      = document.getElementById('ci-insight');
const uniqueCountEl  = document.getElementById('unique-species-count');
const historySection = document.getElementById('history-section');
const historyList    = document.getElementById('history-list');

const intelToggle    = document.getElementById('city-intel-toggle');
const intelBody      = document.getElementById('city-intel-body');
const intelChevron   = document.getElementById('city-intel-chevron');

// Daily Checklist
const taskWater = document.getElementById('task-water');
const taskCheck = document.getElementById('task-check');
const taskSnap = document.getElementById('task-snap');
const careStreakBadge = document.getElementById('care-streak-badge');

// Garden Tracker Components
const addPlantForm = document.getElementById('add-plant-form');
const newPlantName = document.getElementById('new-plant-name');
const newPlantSpecies = document.getElementById('new-plant-species');
const newPlantEmail = document.getElementById('new-plant-email');
const growthStageRange = document.getElementById('growth-stage-range') || document.createElement('input');
const growthTimeBadge = document.getElementById('growth-time-badge');
const btnAdvanceStage = document.getElementById('btn-advance-stage');
const threeStageLabel = document.getElementById('three-stage-label');

const soilPh = document.getElementById('soil-ph');
const soilNpk = document.getElementById('soil-npk');
const soilMix = document.getElementById('soil-mix');

const badgeCanopy = document.getElementById('badge-canopy');

// Social Feed Components
const btnOpenPostModal = document.getElementById('btn-open-post-modal');
const postModal = document.getElementById('post-modal');
const closePostModal = document.getElementById('close-post-modal');
const postForm = document.getElementById('post-form');
const postTitle = document.getElementById('post-title');
const postSpecies = document.getElementById('post-species');
const postDays = document.getElementById('post-days');
const postImgSelect = document.getElementById('post-img-select');
const postLatlng = document.getElementById('post-latlng');
const postLocateBtn = document.getElementById('post-locate-btn');
const socialFeed = document.getElementById('social-feed');

// Maps Filters
const filterScans = document.getElementById('filter-scans');
const filterSocial = document.getElementById('filter-social');
const filterNurseries = document.getElementById('filter-nurseries');
const mapToggleScope = document.getElementById('map-toggle-scope');

// Email Inbox Modal
const inboxModal = document.getElementById('inbox-modal');
const closeInboxModal = document.getElementById('close-inbox-modal');
const inboxEmailContent = document.getElementById('inbox-email-content');
const dismissInboxBtn = document.getElementById('dismiss-inbox-btn');

// Grower Gamified RPG state variables
let growerLvl = parseInt(localStorage.getItem('growerLvl')) || 1;
let growerXp = parseInt(localStorage.getItem('growerXp')) || 0;

// Simulation engine state variables
let isAutoGrowing = false;
let growthInterval = null;
let growthSpeed = 1; // 1 day per 5 seconds

// ─── Initialization ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initListeners();
  initThreeVisualizer();
  loadInitialData();
  fetchWeatherForecast();
  updateXpUi();
  initGrowthController();
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// ─── Map Logic ───────────────────────────────────────
function initMap() {
  if (typeof L === 'undefined') {
    setTimeout(initMap, 500);
    return;
  }

  map = L.map('map', {
    center: AMRAVATI,
    zoom: 13,
    zoomControl: false
  });

  // Dark Theme Base Tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> © <a href="https://carto.com">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Initialize Layer groups
  scansLayer = L.featureGroup().addTo(map);
  socialLayer = L.featureGroup().addTo(map);
  nurseriesLayer = L.featureGroup().addTo(map);

  // Load Seed diagnostic scans
  SEED_PINS.forEach(p => {
    addDiagnosticPin(p.lat, p.lng, p.species, p.score, false);
  });

  // Map Double-click to set coordinate pins
  map.on('dblclick', (e) => {
    const { lat, lng } = e.latlng;
    postLatlng.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    
    if (window.pickerMarker) {
      window.pickerMarker.setLatLng(e.latlng);
    } else {
      window.pickerMarker = L.marker(e.latlng, {
        draggable: true,
        title: "Selected Post Location"
      }).addTo(map);
      
      window.pickerMarker.on('dragend', () => {
        const pos = window.pickerMarker.getLatLng();
        postLatlng.value = `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`;
      });
    }
    
    alert(`📍 Coordinates pinned: ${lat.toFixed(5)}, ${lng.toFixed(5)}. Click 'Post Growth Snap' to finish posting!`);
  });
}

function getPinColor(score) {
  if (score >= 71) return '#22c55e'; // green
  if (score >= 41) return '#f59e0b'; // orange
  return '#ef4444'; // red
}

function getPulsingClass(score) {
  if (score >= 71) return 'green-pulsing-pin';
  if (score >= 41) return 'orange-pulsing-pin';
  return 'red-pulsing-pin';
}

function addDiagnosticPin(lat, lng, species, score, isNew = false) {
  if (!map) return;

  const color = getPinColor(score);
  const healthLabel = score >= 71 ? 'Healthy' : score >= 41 ? 'Stressed' : 'Critical';
  const pulseClass = getPulsingClass(score);

  const marker = L.circleMarker([lat, lng], {
    radius: 9,
    fillColor: color,
    color: '#000000',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9,
    className: pulseClass
  }).addTo(scansLayer);

  marker.bindPopup(`
    <div style="min-width:145px; font-family:'Inter',sans-serif; color:#f1f5f9; background:#152315; padding: 2px;">
      <div style="font-size:12px; font-weight:900; margin-bottom:2px; color:#22c55e;">🔍 ${species} Diagnostic</div>
      <div style="font-size:10px; font-weight:600; margin-bottom:6px;">Score: <span style="color:${color};">${score}/100</span></div>
      <div style="font-size:9px; color:#94a3b8;">Status: ${healthLabel}</div>
    </div>
  `);

  if (isNew) {
    marker.openPopup();
    map.flyTo([lat, lng], 14, { animate: true, duration: 1.2 });
  }
}

// ─── Fetch API calls ──────────────────────────────────
async function loadInitialData() {
  try {
    // 1. Fetch scans
    const scansRes = await fetch('/api/scans');
    if (scansRes.ok) {
      localScans = await scansRes.json();
      localScans.forEach(s => {
        addDiagnosticPin(s.lat, s.lng, s.species, s.health_score, false);
      });
    }

    // 2. Fetch nurseries
    const nurseriesRes = await fetch('/api/nurseries');
    if (nurseriesRes.ok) {
      const nurseries = await nurseriesRes.json();
      nurseries.forEach(n => {
        const marker = L.circleMarker([n.lat, n.lng], {
          radius: 9,
          fillColor: '#3b82f6', // blue
          color: '#ffffff',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85,
          className: 'blue-pulsing-pin'
        }).addTo(nurseriesLayer);

        marker.bindPopup(`
          <div style="min-width:160px; font-family:'Inter',sans-serif; color:#f1f5f9; padding: 2px;">
            <div style="font-size:12px; font-weight:800; color:#3b82f6; margin-bottom:2px;">🏬 ${n.name}</div>
            <div style="font-size:9px; color:#cbd5e1; margin-bottom:4px;">📍 ${n.address}</div>
            <div style="font-size:9px; color:#94a3b8;">📞 Contact: ${n.contact}</div>
            <div style="font-size:9px; color:#fbbf24; font-weight:bold;">★ Rating: ${n.rating}/5.0</div>
          </div>
        `);
      });

      // Populate nurseries list
      const nurseriesList = document.getElementById('nurseries-list');
      if (nurseriesList) {
        nurseriesList.innerHTML = nurseries.map(n => `
          <div class="p-2.5 rounded-xl bg-forest-950/60 border border-green-900/20 space-y-1 text-xs">
            <div class="flex justify-between items-center">
              <span class="font-bold text-white">${n.name}</span>
              <span class="text-[10px] text-amber-400 font-bold">★ ${n.rating}</span>
            </div>
            <p class="text-[10px] text-gray-400">📍 ${n.address}</p>
            <p class="text-[9px] text-gray-500">📞 ${n.contact} · <span class="text-green-400 font-semibold">${n.speciality}</span></p>
          </div>
        `).join('');
      }
    }

    // 3. Fetch community snaps
    await loadCommunitySnaps();

    // 4. Fetch garden
    await loadMyGarden();

    // 5. Fetch leaderboard
    await loadLeaderboard();

    updateDashboardStats();
  } catch (err) {
    console.error("Error loading server data:", err);
    updateDashboardStats();
  }
}

async function loadCommunitySnaps() {
  try {
    const res = await fetch('/api/community/posts');
    if (res.ok) {
      const postsData = await res.json();
      socialLayer.clearLayers();
      
      postsData.forEach(p => {
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: 9,
          fillColor: '#a855f7', // purple
          color: '#ffffff',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85,
          className: 'purple-pulsing-pin'
        }).addTo(socialLayer);

        marker.bindPopup(`
          <div style="min-width:160px; font-family:'Inter',sans-serif; color:#f1f5f9; padding: 2px;">
            <div style="font-size:12px; font-weight:800; color:#c084fc; margin-bottom:2px;">📸 Snap: ${p.species}</div>
            <div style="font-size:9px; color:#cbd5e1; font-weight:bold; margin-bottom:6px;">Age: ${p.daysAlive} days • Score: ${p.health_score}</div>
            <img src="${p.image}" style="width:100%; height:80px; object-fit: cover; border-radius:8px; margin-bottom:4px;" />
            <div style="font-size:9px; color:#94a3b8; font-style:italic;">"${p.title.slice(0, 45)}..."</div>
          </div>
        `);
      });

      renderSocialFeedList(postsData);
      updateCommunityMapPins(postsData);
    }
  } catch (err) {
    console.error("Error loading posts:", err);
  }
}

async function loadMyGarden() {
  try {
    const res = await fetch('/api/my-plants');
    if (res.ok) {
      myPlants = await res.json();
      renderGardenSelectorList();
      
      if (myPlants.length > 0) {
        if (!activePlantId) activePlantId = myPlants[0].id;
        renderActivePlantDetails();
      }
    }
  } catch (err) {
    console.error("Error loading garden:", err);
  }
}

async function loadLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const list = await res.json();
      
      // 1. Populate top 3 podium
      const podiumRow = document.getElementById('podium-row');
      if (podiumRow && list.length >= 3) {
        const top3 = list.slice(0, 3);
        // Podium order: Silver (2nd) on left, Gold (1st) in center, Bronze (3rd) on right
        const displayOrder = [top3[1], top3[0], top3[2]];
        
        podiumRow.innerHTML = displayOrder.map(item => {
          const rankClass = item.rank === 1 ? 'rank-1' : item.rank === 2 ? 'rank-2' : 'rank-3';
          const medalIcon = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉';
          const score = item.plantsCount * item.avgHealth;
          return `
            <div class="podium-card ${rankClass}">
              <div class="podium-badge">${medalIcon}</div>
              <p class="podium-user">${item.user}</p>
              <p class="podium-score">${score} XP</p>
              <p class="podium-stats">${item.plantsCount} Plants · ${item.avgHealth}% Health</p>
              <p class="text-[9px] text-orange-400 font-extrabold">🔥 ${item.streak || 0}-Day Streak</p>
            </div>
          `;
        }).join('');
      }

      // 2. Populate main table
      const tbody = document.getElementById('leaderboard-list');
      tbody.innerHTML = list.map(item => {
        const isUser = item.user.includes("Aman") || item.user.includes("You");
        const userClass = isUser ? 'text-green-400 font-bold bg-green-950/20' : 'text-slate-200';
        
        let medal = item.rank;
        if (item.rank === 1) medal = '🥇';
        else if (item.rank === 2) medal = '🥈';
        else if (item.rank === 3) medal = '🥉';

        const score = item.plantsCount * item.avgHealth;

        return `
          <tr class="border-b border-green-950 hover:bg-forest-900/30 transition-colors ${userClass}">
            <td class="p-2.5 text-center font-bold">${medal}</td>
            <td class="p-2.5 flex items-center gap-1.5 font-medium">${item.user}</td>
            <td class="p-2.5 text-center font-bold">${item.plantsCount}</td>
            <td class="p-2.5 text-center font-bold text-green-400">${item.avgHealth}%</td>
            <td class="p-2.5 text-center font-bold text-orange-400">🔥 ${item.streak || 0}</td>
            <td class="p-2.5 text-center font-bold text-white">${score}</td>
          </tr>
        `;
      }).join('');
    }
  } catch (err) {
    console.error("Error loading leaderboard:", err);
  }
}

// ─── Event Listeners ──────────────────────────────────
function initListeners() {
  // Navigation tabs
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Diagnosing upload zone
  uploadZone.addEventListener('click', (e) => {
    if (localStream) return; // Prevent triggering file picker when camera is running
    if (e.target.closest('#camera-container')) return;
    fileInput.click();
  });
  fileInput.addEventListener('change', handleFileSelect);
  
  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearUploadState();
  });

  scanBtn.addEventListener('click', runDiagnosisScan);
  demoBtn.addEventListener('click', () => runDemoMode(false));
  if (cameraBtn) cameraBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startCamera();
  });
  if (btnCapture) btnCapture.addEventListener('click', (e) => {
    e.stopPropagation();
    capturePhoto();
  });
  if (btnCloseCamera) btnCloseCamera.addEventListener('click', (e) => {
    e.stopPropagation();
    stopCamera();
  });

  intelToggle.addEventListener('click', () => {
    intelBody.classList.toggle('collapsed');
    intelChevron.classList.toggle('collapsed');
  });

  // Daily task completions
  [taskWater, taskCheck, taskSnap].forEach(cb => {
    cb.addEventListener('change', async (e) => {
      const activePlant = myPlants.find(p => p.id === activePlantId);
      if (!activePlant) {
        alert("Please register and select a plant in 'Garden Hub' first to complete daily tasks!");
        cb.checked = !cb.checked;
        return;
      }
      
      let taskName = '';
      if (e.target.id === 'task-water') taskName = 'water';
      else if (e.target.id === 'task-check') taskName = 'check';
      else if (e.target.id === 'task-snap') taskName = 'snap';

      try {
        const res = await fetch(`/api/my-plants/${activePlant.id}/task`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskName })
        });
        if (res.ok) {
          const updated = await res.json();
          const idx = myPlants.findIndex(p => p.id === updated.id);
          if (idx !== -1) myPlants[idx] = updated;
          
          renderActivePlantDetails();
          loadLeaderboard();

          // Reward XP if task checked
          if (updated.dailyTasks[taskName]) {
            gainXP(15);
          }
        }
      } catch (err) {
        console.error("Task update error:", err);
      }
    });
  });

  // Garden Stage triggers (Timeline clicks)
  document.querySelectorAll('.stage-step').forEach(step => {
    step.addEventListener('click', async () => {
      const activePlant = myPlants.find(p => p.id === activePlantId);
      if (!activePlant) return;

      const nextStage = parseInt(step.getAttribute('data-stage'));
      try {
        const res = await fetch(`/api/my-plants/${activePlant.id}/stage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: nextStage })
        });

        if (res.ok) {
          const result = await res.json();
          const idx = myPlants.findIndex(p => p.id === result.plant.id);
          if (idx !== -1) myPlants[idx] = result.plant;

          renderActivePlantDetails();
          
          if (result.emailSent) {
            inboxEmailContent.innerHTML = result.emailSent.html || `<p>${result.emailSent.subject}</p>`;
            inboxModal.classList.remove('hidden');
          }

          fireConfetti();
          gainXP(50);
        }
      } catch (err) {
        console.error("Advance stage error:", err);
      }
    });
  });

  btnAdvanceStage.addEventListener('click', async () => {
    const activePlant = myPlants.find(p => p.id === activePlantId);
    if (!activePlant) return;

    const nextStage = activePlant.stage < 6 ? activePlant.stage + 1 : 1;
    
    try {
      const res = await fetch(`/api/my-plants/${activePlant.id}/stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: nextStage })
      });

      if (res.ok) {
        const result = await res.json();
        const idx = myPlants.findIndex(p => p.id === result.plant.id);
        if (idx !== -1) myPlants[idx] = result.plant;

        renderActivePlantDetails();
        
        if (result.emailSent) {
          inboxEmailContent.innerHTML = result.emailSent.html || `<p>${result.emailSent.subject}</p>`;
          inboxModal.classList.remove('hidden');
        }

        fireConfetti();
        gainXP(50);
      }
    } catch (err) {
      console.error("Advance stage error:", err);
    }
  });

  // Add Plant Submission
  addPlantForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = newPlantName.value.trim();
    const species = newPlantSpecies.value;
    const email = newPlantEmail.value.trim();

    try {
      const res = await fetch('/api/my-plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, species, email })
      });

      if (res.ok) {
        const added = await res.json();
        myPlants.push(added);
        activePlantId = added.id;
        
        newPlantName.value = '';
        newPlantEmail.value = '';
        
        renderGardenSelectorList();
        renderActivePlantDetails();
        loadLeaderboard();
        updateDashboardStats();
        
        const stageRes = await fetch(`/api/my-plants/${added.id}/stage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: 1 })
        });
        if (stageRes.ok) {
          const sRes = await stageRes.json();
          if (sRes.emailSent) {
            inboxEmailContent.innerHTML = sRes.emailSent.html;
            inboxModal.classList.remove('hidden');
          }
        }
        
        alert(`🎉 Seed planted! "${name}" added to your garden.`);
      }
    } catch (err) {
      console.error("Add plant error:", err);
    }
  });

  // Social Modal Submissions
  btnOpenPostModal.addEventListener('click', () => {
    postModal.classList.remove('hidden');
  });

  closePostModal.addEventListener('click', () => postModal.classList.add('hidden'));
  postLocateBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        postLatlng.value = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        alert("GPS location grabbed!");
      },
      (err) => alert("GPS unavailable. Double-click anywhere on the map to set post coordinates.")
    );
  });

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = postTitle.value.trim();
    const species = postSpecies.value;
    const daysAlive = parseInt(postDays.value) || 14;
    const [latStr, lngStr] = postLatlng.value.split(',');
    const lat = parseFloat(latStr.trim()) || AMRAVATI[0];
    const lng = parseFloat(lngStr.trim()) || AMRAVATI[1];
    
    const imgType = postImgSelect.value;
    let imageSVG = DEMO_PLANTS[0].svg;
    if (imgType === 'tomato') {
      imageSVG = DEMO_PLANTS[1].svg;
    } else if (imgType === 'basil') {
      imageSVG = DEMO_PLANTS[0].svg;
    } else if (imgType === 'dry_basil') {
      imageSVG = `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231f130b'/><text x='200' y='130' font-size='80' text-anchor='middle'>🍂</text><text x='200' y='195' font-size='22' text-anchor='middle' fill='%23ef4444' font-family='Arial' font-weight='bold'>Dry Leaf Basil</text></svg>`;
    } else if (imgType === 'tulsi') {
      imageSVG = `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f1a0f'/><text x='200' y='130' font-size='80' text-anchor='middle'>🌱</text><text x='200' y='195' font-size='22' text-anchor='middle' fill='%2322c55e' font-family='Arial' font-weight='bold'>Balcony Tulsi</text></svg>`;
    }

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          species,
          daysAlive,
          health_score: 82 + Math.round(Math.random() * 15),
          lat,
          lng,
          image: imageSVG
        })
      });

      if (res.ok) {
        postModal.classList.add('hidden');
        postTitle.value = '';
        
        if (window.pickerMarker) {
          map.removeLayer(window.pickerMarker);
          window.pickerMarker = null;
        }

        await loadCommunitySnaps();
        alert("🎉 Snap posted successfully! Geotagged marker added to map.");
        fireConfetti();
      }
    } catch (err) {
      console.error("Posting error:", err);
    }
  });

  // Layer filters
  filterScans.addEventListener('change', () => {
    if (filterScans.checked) map.addLayer(scansLayer);
    else map.removeLayer(scansLayer);
  });
  filterSocial.addEventListener('change', () => {
    if (filterSocial.checked) map.addLayer(socialLayer);
    else map.removeLayer(socialLayer);
  });
  filterNurseries.addEventListener('change', () => {
    if (filterNurseries.checked) map.addLayer(nurseriesLayer);
    else map.removeLayer(nurseriesLayer);
  });

  // Map scope toggle
  mapToggleScope.addEventListener('click', () => {
    if (activeScope === 'city') {
      activeScope = 'neighborhood';
      mapToggleScope.textContent = "🏡 Scope: Local Area";
      map.setZoom(16);
      
      const scansArr = scansLayer.getLayers();
      if (scansArr.length > 0) {
        map.panTo(scansArr[0].getLatLng());
      } else {
        map.panTo(AMRAVATI);
      }
    } else {
      activeScope = 'city';
      mapToggleScope.textContent = "🏙️ Scope: City Wide";
      map.setZoom(13);
      map.panTo(AMRAVATI);
    }
  });

  closeInboxModal.addEventListener('click', () => inboxModal.classList.add('hidden'));
  dismissInboxBtn.addEventListener('click', () => inboxModal.classList.add('hidden'));

  // Drag & drop file upload
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('border-green-500', 'bg-forest-700/30');
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('border-green-500', 'bg-forest-700/30');
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('border-green-500', 'bg-forest-700/30');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadFile(file);
    }
  });
}

// ─── Tab Switcher & Secondary Map ─────────────────────
let communityMap = null;
let communityMarkersGroup = null;

function initCommunityMap() {
  if (typeof L === 'undefined' || communityMap) return;

  communityMap = L.map('community-map', {
    center: AMRAVATI,
    zoom: 12,
    zoomControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(communityMap);

  communityMarkersGroup = L.featureGroup().addTo(communityMap);
  
  // Populate existing posts
  fetch('/api/community/posts')
    .then(res => { if (res.ok) return res.json(); })
    .then(posts => {
      if (posts) updateCommunityMapPins(posts);
    })
    .catch(err => console.error("Error loading community map pins:", err));
}

function updateCommunityMapPins(postsData) {
  if (!communityMap || !communityMarkersGroup) return;
  communityMarkersGroup.clearLayers();

  postsData.forEach(p => {
    const marker = L.circleMarker([p.lat, p.lng], {
      radius: 7,
      fillColor: '#a855f7', // purple
      color: '#ffffff',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.85
    }).addTo(communityMarkersGroup);

    marker.bindPopup(`
      <div style="min-width:140px; font-family:'Inter',sans-serif; color:#f1f5f9; padding: 2px;">
        <div style="font-size:11px; font-weight:800; color:#c084fc; margin-bottom:2px;">📸 ${p.species}</div>
        <div style="font-size:9px; color:#cbd5e1; font-weight:bold; margin-bottom:4px;">Score: ${p.health_score} • Age: ${p.daysAlive} days</div>
        <div style="font-size:9px; color:#94a3b8; font-style:italic;">"${p.title.slice(0, 30)}..."</div>
      </div>
    `);
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelectorAll('.tab-content').forEach(section => {
    if (section.id === `tab-content-${tabId}`) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  if (tabId === 'diagnosis') {
    setTimeout(() => { if (map) map.invalidateSize(); }, 200);
  } else if (tabId === 'lifecycle') {
    setTimeout(() => {
      const container = document.getElementById('three-container');
      if (renderer && container) {
        const w = container.clientWidth || 400;
        const h = container.clientHeight || 240;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    }, 200);
  } else if (tabId === 'community') {
    setTimeout(() => {
      if (!communityMap) {
        initCommunityMap();
      } else {
        communityMap.invalidateSize();
      }
    }, 200);
  }
}

// ─── Real Gemini Diagnosis Scan ──────────────────────
async function runDiagnosisScan() {
  if (!selectedFile) return;

  setScanLoading(true);
  hideError();
  resultCard.classList.add('hidden');
  fallbackBanner.classList.add('hidden');

  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    const res = await fetch('/api/scan', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Scan request failed with status: ${res.status}`);
    }

    const scanData = await res.json();
    setScanLoading(false);

    if (scanData.is_plant === false || scanData.is_plant === 'false') {
      showError("No plant detected. Please photograph a plant clearly.");
      return;
    }

    localScans.unshift(scanData);
    renderResult(scanData);
    addDiagnosticPin(scanData.lat, scanData.lng, scanData.species, scanData.health_score, true);
    updateDashboardStats();
    
    // Auto tick diagnostic checklist photo task
    taskSnap.checked = true;
    const activePlant = myPlants.find(p => p.id === activePlantId);
    if (activePlant) {
      await fetch(`/api/my-plants/${activePlant.id}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: 'snap' })
      });
      loadMyGarden();
    }

    if (scanData.health_score > 80) {
      fireConfetti();
    }

  } catch (error) {
    console.error("Gemini Scan Failed:", error);
    fallbackBanner.classList.remove('hidden');
    runDemoMode(true);
    setScanLoading(false);
  }
}

function runDemoMode(isFallback = false) {
  const d = DEMO_PLANTS[demoIndex];
  demoIndex = (demoIndex + 1) % DEMO_PLANTS.length;

  previewImg.src = d.svg;
  fileNameLabel.textContent = d.species.toLowerCase().replace(/\s+/g, '-') + '-demo.svg';
  uploadDefault.classList.add('hidden');
  uploadPreview.classList.remove('hidden');

  hideError();
  resultCard.classList.add('hidden');
  if (!isFallback) {
    fallbackBanner.classList.add('hidden');
  }

  setScanLoading(true);

  setTimeout(async () => {
    setScanLoading(false);

    const fakeScan = {
      id: Date.now(),
      species: d.species,
      scientific_name: d.scientific_name,
      health_score: d.health_score,
      status: d.status,
      diagnosis: d.diagnosis,
      prescription: d.prescription,
      is_plant: true,
      lat: AMRAVATI[0] + (Math.random() - 0.5) * 0.04,
      lng: AMRAVATI[1] + (Math.random() - 0.5) * 0.04,
      timestamp: new Date().toISOString()
    };

    localScans.unshift(fakeScan);
    renderResult(fakeScan);
    addDiagnosticPin(fakeScan.lat, fakeScan.lng, fakeScan.species, fakeScan.health_score, true);
    updateDashboardStats();

    taskSnap.checked = true;
    const activePlant = myPlants.find(p => p.id === activePlantId);
    if (activePlant) {
      const taskRes = await fetch(`/api/my-plants/${activePlant.id}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: 'snap' })
      });
      if (taskRes.ok) {
        const u = await taskRes.json();
        const idx = myPlants.findIndex(p => p.id === u.id);
        if (idx !== -1) myPlants[idx] = u;
        renderActivePlantDetails();
        loadLeaderboard();
      }
    }

    if (fakeScan.health_score > 80) {
      fireConfetti();
    }
  }, 1800);
}

// ─── Score ring animation ─────────────────────────────
function animateScore(target) {
  const circumference = 2 * Math.PI * 45;
  const start = performance.now();
  
  scoreRing.style.strokeDasharray = circumference;
  scoreRing.style.strokeDashoffset = circumference;
  
  function tick(now) {
    const t = Math.min((now - start) / 1000, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(eased * target);
    
    scoreDisplay.textContent = val;
    scoreRing.style.strokeDashoffset = circumference - (eased * circumference * target / 100);
    
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      scoreDisplay.textContent = target;
      scoreRing.style.strokeDashoffset = circumference - (circumference * target / 100);
    }
  }
  requestAnimationFrame(tick);
}

function renderResult(data) {
  const score = Math.max(0, Math.min(100, Math.round(Number(data.health_score) || 0)));
  const colors = getHealthClasses(score);

  resultCard.className = `rounded-2xl border p-5 slide-up bg-forest-800/40 ${colors.borderClass} ${colors.glowClass}`;
  resultCard.classList.remove('hidden');

  statusPill.textContent = colors.status;
  statusPill.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase mb-1.5 ${colors.pillBg} ${colors.textColor}`;

  speciesName.textContent = data.species;
  cardSubtitle.textContent = `Score: ${score}/100 • ${data.scientific_name || ''}`;
  diagnosisText.textContent = data.diagnosis;
  prescriptionText.textContent = data.prescription;
  
  scoreRing.setAttribute('stroke', colors.ringColor);
  animateScore(score);
}

function getHealthClasses(score) {
  if (score >= 71) {
    return {
      borderClass: 'border-green-700/50',
      glowClass: 'glow-green',
      pillBg: 'bg-green-950/60',
      textColor: 'text-green-400',
      status: 'Healthy',
      ringColor: '#22c55e'
    };
  }
  if (score >= 41) {
    return {
      borderClass: 'border-amber-700/50',
      glowClass: 'glow-amber',
      pillBg: 'bg-amber-950/60',
      textColor: 'text-amber-400',
      status: 'Stressed',
      ringColor: '#f59e0b'
    };
  }
  return {
    borderClass: 'border-red-700/50',
    glowClass: 'glow-red',
    pillBg: 'bg-red-950/60',
    textColor: 'text-red-400',
    status: 'Critical',
    ringColor: '#ef4444'
  };
}

// ─── Weather Guidance API Fetch ───────────────────────
async function fetchWeatherForecast() {
  try {
    const lat = AMRAVATI[0];
    const lng = AMRAVATI[1];
    
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=rain_sum&timezone=auto`);
    
    if (weatherRes.ok) {
      const data = await weatherRes.json();
      const current = data.current_weather;
      
      const tempVal = Math.round(current.temperature);
      document.getElementById('weather-temp').textContent = `Amravati: ${tempVal}°C`;
      
      let weatherText = "Warm & Dry Clear Sky";
      let weatherIcon = "☀️";
      let alertDesc = "Standard watering routine (every 24 hours) is recommended. Ensure afternoon shade.";
      
      if (current.weathercode >= 51 && current.weathercode <= 82) {
        weatherText = "Showers & Rainy Forecast";
        weatherIcon = "🌧️";
        alertDesc = "Protection Alert: Rainfall detected/expected. Move small pots under canopy. Halt manual watering to prevent waterlogging.";
      } else if (tempVal > 35) {
        weatherText = "Severe Hot Sunshine Alert";
        weatherIcon = "🔥";
        alertDesc = "Hydration Alert: Severe heat detected! Water twice daily (early morning & sunset). Shade delicate foliage.";
      } else if (tempVal < 18) {
        weatherText = "Cool Winter Breezes";
        weatherIcon = "❄️";
        alertDesc = "Climate Notice: Cold conditions. Succulents and tropicals require warmth and zero afternoon moisture.";
      }
      
      document.getElementById('weather-desc').textContent = weatherText;
      document.getElementById('weather-icon').textContent = weatherIcon;
      document.getElementById('weather-humidity').textContent = `Wind: ${current.windspeed} km/h • Code: ${current.weathercode}`;
      document.getElementById('weather-alert-text').textContent = alertDesc;
    }
  } catch (err) {
    console.error("Could not fetch weather forecast:", err);
  }
}

// ─── Three.js Procedural 3D Plant Visualizer ──────────
function initThreeVisualizer() {
  const container = document.getElementById('three-container');
  const canvas = document.getElementById('three-canvas');
  
  if (!container || !canvas) return;

  const w = container.clientWidth || 400;
  const h = container.clientHeight || 240;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a100a);

  // Camera
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 3.5, 6);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);

  // OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 + 0.15;
  controls.minDistance = 2.5;
  controls.maxDistance = 12;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  plantGroup = new THREE.Group();
  scene.add(plantGroup);

  document.getElementById('three-placeholder').classList.add('hidden');

  function animate() {
    requestAnimationFrame(animate);
    if (plantGroup) {
      plantGroup.rotation.y += 0.003;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();

  window.addEventListener('resize', () => {
    if (!container || !renderer) return;
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 240;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

function updateProcedural3DPlant(stage) {
  if (!plantGroup) return;

  while(plantGroup.children.length > 0){ 
    plantGroup.remove(plantGroup.children[0]); 
  }

  // Draw base pot
  const potGeo = new THREE.CylinderGeometry(1.2, 0.8, 1.2, 16);
  const potMat = new THREE.MeshStandardMaterial({ color: 0x1d321d, roughness: 0.8 });
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.y = -0.6;
  plantGroup.add(pot);

  // Dirt
  const dirtGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.1, 16);
  const dirtMat = new THREE.MeshStandardMaterial({ color: 0x241d17, roughness: 0.95 });
  const dirt = new THREE.Mesh(dirtGeo, dirtMat);
  dirt.position.y = -0.05;
  plantGroup.add(dirt);

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x5a8f3b, roughness: 0.8 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5, side: THREE.DoubleSide });

  if (stage === 1) {
    const seedGeo = new THREE.SphereGeometry(0.18, 12, 12);
    seedGeo.scale(1, 0.7, 1.4);
    const seedMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
    const seed = new THREE.Mesh(seedGeo, seedMat);
    seed.position.set(0, 0.05, 0);
    plantGroup.add(seed);

  } else if (stage === 2) {
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.5, 8);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 0.2, 0);
    stem.rotation.z = -0.15;
    plantGroup.add(stem);

    const leafGeo = new THREE.BoxGeometry(0.15, 0.02, 0.22);
    const leafL = new THREE.Mesh(leafGeo, leafMat);
    leafL.position.set(-0.08, 0.45, 0);
    leafL.rotation.z = 0.4;
    plantGroup.add(leafL);

    const leafR = new THREE.Mesh(leafGeo, leafMat);
    leafR.position.set(0.08, 0.45, 0);
    leafR.rotation.z = -0.4;
    plantGroup.add(leafR);

  } else if (stage === 3) {
    const stemGeo = new THREE.CylinderGeometry(0.05, 0.07, 1.2, 8);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 0.55, 0);
    plantGroup.add(stem);

    for (let i = 0; i < 6; i++) {
      const leafGeo = new THREE.ConeGeometry(0.18, 0.4, 4);
      leafGeo.rotateX(Math.PI / 2);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      
      const yPos = 0.2 + (i * 0.16);
      leaf.position.set(Math.sin(i * 2.3) * 0.15, yPos, Math.cos(i * 2.3) * 0.15);
      leaf.rotation.set(0.4, i * 2.3, 0.5);
      plantGroup.add(leaf);
    }

  } else if (stage === 4) {
    buildBushyPlant(stemMat, leafMat, false, false);

  } else if (stage === 5) {
    buildBushyPlant(stemMat, leafMat, true, false);

  } else if (stage === 6) {
    buildBushyPlant(stemMat, leafMat, true, true);
  }
}

function buildBushyPlant(stemMat, leafMat, addFlowers = false, addFruit = false) {
  const mainGeo = new THREE.CylinderGeometry(0.07, 0.1, 1.8, 8);
  const mainStem = new THREE.Mesh(mainGeo, stemMat);
  mainStem.position.y = 0.85;
  plantGroup.add(mainStem);

  const branches = [
    { len: 1.0, rotZ: 0.6, rotY: 0, height: 0.6 },
    { len: 0.9, rotZ: -0.6, rotY: Math.PI / 2, height: 0.9 },
    { len: 0.85, rotZ: 0.7, rotY: Math.PI, height: 1.15 },
    { len: 0.7, rotZ: -0.7, rotY: Math.PI * 1.5, height: 1.3 }
  ];

  branches.forEach((b, idx) => {
    const branchGeo = new THREE.CylinderGeometry(0.04, 0.06, b.len, 8);
    const branch = new THREE.Mesh(branchGeo, stemMat);
    branch.position.set(0, b.height, 0);
    branch.rotation.set(0, b.rotY, b.rotZ);
    branch.translateY(b.len / 2);
    plantGroup.add(branch);

    for (let i = 0; i < 4; i++) {
      const leafGeo = new THREE.ConeGeometry(0.18, 0.45, 4);
      leafGeo.rotateX(Math.PI / 2);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      
      const t = 0.3 + (i * 0.22);
      leaf.position.set(
        Math.sin(b.rotY) * Math.sin(b.rotZ) * b.len * t,
        b.height + Math.cos(b.rotZ) * b.len * t,
        Math.cos(b.rotY) * Math.sin(b.rotZ) * b.len * t
      );
      leaf.rotation.set(0.5, b.rotY + (i * 1.5), 0.6);
      plantGroup.add(leaf);
    }

    if (addFlowers && idx % 2 === 0) {
      const flowerGeo = new THREE.ConeGeometry(0.15, 0.18, 5);
      flowerGeo.rotateX(-Math.PI / 2);
      const flowerMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
      const flower = new THREE.Mesh(flowerGeo, flowerMat);
      
      flower.position.set(
        Math.sin(b.rotY) * Math.sin(b.rotZ) * b.len,
        b.height + Math.cos(b.rotZ) * b.len,
        Math.cos(b.rotY) * Math.sin(b.rotZ) * b.len
      );
      plantGroup.add(flower);
    }

    if (addFruit && idx % 2 !== 0) {
      const fruitGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const fruitMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const fruit = new THREE.Mesh(fruitGeo, fruitMat);
      
      fruit.position.set(
        Math.sin(b.rotY) * Math.sin(b.rotZ) * b.len * 0.8,
        (b.height + Math.cos(b.rotZ) * b.len * 0.8) - 0.18,
        Math.cos(b.rotY) * Math.sin(b.rotZ) * b.len * 0.8
      );
      plantGroup.add(fruit);
    }
  });
}

// ─── Active Plant Selector Layout rendering ──────────
function getSpeciesEmoji(species) {
  switch (species) {
    case 'Tomato': return '🍅';
    case 'Tulsi': return '🌿';
    case 'Sweet Basil': return '🌱';
    case 'Aloe Vera': return '🪴';
    case 'Mint': return '🍃';
    case 'Rose': return '🌹';
    case 'Neem': return '🌳';
    default: return '🌱';
  }
}

function renderGardenSelectorList() {
  const myPlantsGrid = document.getElementById('my-plants-grid');
  const lifecyclePlantSelector = document.getElementById('lifecycle-plant-selector');

  if (!myPlantsGrid || !lifecyclePlantSelector) return;

  // 1. Render pills in the Life Cycle tab
  if (myPlants.length === 0) {
    lifecyclePlantSelector.innerHTML = `<p class="empty-msg" id="lc-empty-msg">Add plants in the 'My Garden' tab to start tracking</p>`;
  } else {
    lifecyclePlantSelector.innerHTML = myPlants.map(p => {
      const isActive = p.id === activePlantId;
      const activeClass = isActive 
        ? 'bg-green-600 text-white border-green-500 shadow-md shadow-green-900/20' 
        : 'bg-forest-950/60 text-gray-400 hover:text-white border-green-900/30';
      return `
        <button onclick="setActivePlant(${p.id})" class="px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${activeClass}">
          🌱 ${p.name}
        </button>
      `;
    }).join('');
  }

  // 2. Render cards in the My Garden grid
  if (myPlants.length === 0) {
    myPlantsGrid.innerHTML = `
      <div class="card col-span-full text-center p-8 bg-forest-950/40 border border-green-950">
        <p class="text-gray-400">No plants in your garden yet. Plant a seed above to start!</p>
      </div>
    `;
  } else {
    myPlantsGrid.innerHTML = myPlants.map(p => {
      const isSelectedForLifecycle = p.id === activePlantId;
      const selectButtonText = isSelectedForLifecycle ? "Tracking Life Cycle ✓" : "Track Life Cycle ➔";
      const healthColor = getPinColor(p.healthScore || p.health_score || 75);
      const stageName = STAGES[(p.stage || 1) - 1] || 'Seed';
      
      return `
        <div class="card card-glow flex flex-col justify-between" style="border-left: 4px solid ${healthColor}; min-height: 190px;">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xl">${getSpeciesEmoji(p.species)}</span>
              <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-forest-950 text-green-400" style="color: ${healthColor}; border: 1px solid ${healthColor}40;">
                Health: ${p.healthScore || p.health_score || 75}%
              </span>
            </div>
            <h4 class="text-xs font-black text-white mb-0.5">${p.name}</h4>
            <p class="text-[9px] text-gray-400 mb-1.5">Species: ${p.species} • Age: ${p.daysOld || p.daysAlive || 0} days</p>
            <div class="flex flex-wrap gap-1 mb-2.5">
              <span class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-forest-950 text-gray-300 border border-green-900/30">${stageName}</span>
              <span class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-forest-950 text-orange-400 border border-orange-900/30">🔥 ${p.streak || 0}-Day Streak</span>
            </div>
          </div>
          <div class="space-y-1.5 mt-auto">
            <button onclick="setActivePlantAndSwitchTab(${p.id})" class="px-2.5 py-1.5 rounded-lg text-[9px] font-bold w-full text-center transition-all bg-green-950 border border-green-800 text-green-400 hover:bg-green-900">
              ${selectButtonText}
            </button>
            <button onclick="deletePlant(event, ${p.id})" class="px-2.5 py-1.5 rounded-lg text-[8px] font-bold w-full text-center text-red hover:bg-red-950/20 transition-all border border-red/20 bg-transparent cursor-pointer">
              Delete Plant
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

window.setActivePlant = function(plantId) {
  activePlantId = plantId;
  renderGardenSelectorList();
  renderActivePlantDetails();
};

window.setActivePlantAndSwitchTab = function(plantId) {
  setActivePlant(plantId);
  switchTab('lifecycle');
};

window.deletePlant = async function(event, plantId) {
  event.stopPropagation();
  if (!confirm("Are you sure you want to delete this plant?")) return;
  try {
    const res = await fetch(`/api/plants/${plantId}`, { method: 'DELETE' });
    if (res.ok) {
      myPlants = myPlants.filter(p => p.id !== plantId);
      if (activePlantId === plantId) {
        activePlantId = myPlants.length > 0 ? myPlants[0].id : null;
      }
      renderGardenSelectorList();
      if (activePlantId) {
        renderActivePlantDetails();
      } else {
        threeStageLabel.textContent = 'Seed';
        growthTimeBadge.textContent = 'Age: 0 days';
        careStreakBadge.textContent = '🔥 0-Day Streak';
        soilPh.textContent = '—';
        soilNpk.textContent = '—';
        soilMix.textContent = 'Select a plant to view soil preparation guide.';
        if (plantGroup) {
          while(plantGroup.children.length > 0){ plantGroup.remove(plantGroup.children[0]); }
        }
      }
      loadLeaderboard();
      updateDashboardStats();
    }
  } catch (err) {
    console.error("Delete plant error:", err);
  }
};

function renderActivePlantDetails() {
  const p = myPlants.find(x => x.id === activePlantId);
  if (!p) return;

  growthStageRange.value = p.stage;
  threeStageLabel.textContent = STAGES[p.stage - 1];
  growthTimeBadge.textContent = `Age: ${p.daysAlive} days`;
  careStreakBadge.textContent = `🔥 ${p.streak}-Day Streak`;

  updateProcedural3DPlant(p.stage);

  // Update timeline visual highlights
  document.querySelectorAll('.stage-step').forEach((step, idx) => {
    const dot = step.querySelector('.stage-dot');
    const stageNum = idx + 1;
    if (dot) {
      if (stageNum === p.stage) {
        dot.className = 'stage-dot active';
      } else if (stageNum < p.stage) {
        dot.className = 'stage-dot done';
      } else {
        dot.className = 'stage-dot';
      }
    }
  });

  document.querySelectorAll('.stage-line').forEach((line, idx) => {
    const lineNum = idx + 1;
    if (lineNum < p.stage) {
      line.className = 'stage-line done';
    } else {
      line.className = 'stage-line';
    }
  });

  taskWater.checked = p.dailyTasks.water;
  taskCheck.checked = p.dailyTasks.check;
  taskSnap.checked = p.dailyTasks.snap;

  const preset = SOIL_PRESETS[p.species] || { ph: "6.0 - 7.0", npk: "10-10-10", mix: "Standard potting mix." };
  soilPh.textContent = preset.ph;
  soilNpk.textContent = preset.npk;
  soilMix.textContent = preset.mix;

  const stageCareContent = document.getElementById('stage-care-content');
  if (stageCareContent) {
    const STAGE_GUIDES = [
      { emoji: "🌰", title: "Seed Stage (Days 0-2)", text: "Maintain high moisture. Keep warm and out of direct harsh sun. Ensure potting mix has fine cocopeat." },
      { emoji: "🌱", title: "Sprout Stage (Days 3-6)", text: "First leaves appear! Keep soil damp but not soaked. Introduce morning ambient sun." },
      { emoji: "🪴", title: "Seedling Stage (Days 7-13)", text: "Strong roots forming. Thin out weaker shoots. Ensure optimal nitrogen in soil mix." },
      { emoji: "🌿", title: "Vegetative Stage (Days 14-20)", text: "Massive foliage growth. Water regularly. Prune topmost tips to promote bushiness." },
      { emoji: "🌸", title: "Flowering Stage (Days 21-27)", text: "Buds blooming! Add phosphorus-rich nutrients (like bone meal/manure). Prune yellow leaves." },
      { emoji: "🍅", title: "Fruiting Stage (Day 28+)", text: "Fruits/seeds ripening! Ensure full sunlight (6+ hours). Keep soil moist but avoid overhead watering." }
    ];
    
    const currentGuide = STAGE_GUIDES[p.stage - 1] || STAGE_GUIDES[0];
    stageCareContent.innerHTML = `
      <div class="care-item">
        <span class="care-emoji">${currentGuide.emoji}</span>
        <div>
          <p class="care-title">${currentGuide.title}</p>
          <p class="care-detail">${currentGuide.text}</p>
        </div>
      </div>
      <div class="care-item mt-2">
        <span class="care-emoji">🪨</span>
        <div>
          <p class="care-title">Ideal Soil Profile</p>
          <p class="care-detail">pH Level: <strong>${preset.ph}</strong> · NPK: <strong>${preset.npk}</strong></p>
          <p class="care-detail" style="color:var(--text-secondary); margin-top:2px;">${preset.mix}</p>
        </div>
      </div>
    `;
  }

  if (p.streak >= 5) {
    document.getElementById('badge-streak').classList.remove('opacity-40');
    document.getElementById('badge-streak').querySelector('p:last-of-type').textContent = "Unlocked";
  } else {
    document.getElementById('badge-streak').classList.add('opacity-40');
    document.getElementById('badge-streak').querySelector('p:last-of-type').textContent = "Locked";
  }

  if (p.daysAlive >= 100) {
    badgeCanopy.classList.remove('opacity-40');
    badgeCanopy.querySelector('p:last-of-type').textContent = "Unlocked";
  } else {
    badgeCanopy.classList.add('opacity-40');
    badgeCanopy.querySelector('p:last-of-type').textContent = "Locked";
  }
}

// ─── Reddit-Style Community Forum List ───────────────
function renderSocialFeedList(postsData) {
  socialFeed.innerHTML = postsData.map(post => {
    const color = getPinColor(post.health_score);
    const scoreColorClass = post.health_score >= 71 ? 'text-green-400' : post.health_score >= 41 ? 'text-amber-400' : 'text-red-400';
    const commentsListMarkup = post.comments.map(c => `
      <div class="bg-forest-950/40 p-2 rounded-lg border border-green-950 mt-1">
        <span class="text-[10px] font-bold text-green-400">${c.user}:</span>
        <span class="text-xs text-gray-300 leading-normal">${c.text}</span>
      </div>
    `).join('');

    return `
      <div class="social-post-card p-4 space-y-3 text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-green-950 border border-green-800 flex items-center justify-center text-xs font-black text-green-400">
              ${post.user.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p class="text-xs text-white font-bold">${post.user}</p>
              <p class="text-[8px] text-gray-500 uppercase">${new Date(post.timestamp).toLocaleDateString()} at ${new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
          <div class="flex gap-1">
            <span class="post-header-tag px-2 py-0.5 rounded text-[9px] font-bold uppercase">${post.species}</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-forest-900 border border-green-900 text-gray-300">${post.daysAlive} Days Old</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-forest-900 border border-green-900 ${scoreColorClass}">Score: ${post.health_score}</span>
          </div>
        </div>

        <h4 class="text-xs font-semibold text-slate-100 leading-relaxed">${post.title}</h4>

        <div class="rounded-xl overflow-hidden bg-forest-950 border border-green-900/30 flex justify-center">
          <img src="${post.image}" alt="Community Snap" class="w-full object-cover max-h-52" />
        </div>

        <p class="text-[10px] text-gray-400 flex items-center gap-1">
          📍 Pin Location: <span class="text-green-400 font-bold">${post.lat.toFixed(4)}, ${post.lng.toFixed(4)}</span>
        </p>

        <div class="flex items-center justify-between border-t border-green-950 pt-2 text-xs">
          <div class="flex items-center gap-1.5 bg-forest-950/60 rounded-full px-2.5 py-1">
            <button onclick="upvotePost(${post.id}, 1)" class="text-gray-400 hover:text-green-400 font-black">▲</button>
            <span class="font-bold text-white">${post.upvotes}</span>
            <button onclick="upvotePost(${post.id}, -1)" class="text-gray-400 hover:text-red-400 font-black">▼</button>
          </div>
          <span class="text-[10px] text-gray-500 font-bold uppercase">${post.comments.length} Comments</span>
        </div>

        <div class="space-y-1 pt-1.5">
          ${commentsListMarkup}
          <form onsubmit="submitComment(event, ${post.id})" class="flex gap-1.5 mt-2">
            <input type="text" placeholder="Add botanical advice..." class="flex-1 px-3 py-1.5 rounded-lg bg-forest-950 border border-green-950 text-xs text-slate-200 focus:outline-none focus:border-green-800" required />
            <button type="submit" class="px-3 py-1.5 rounded-lg bg-green-950 border border-green-800 text-green-400 hover:bg-green-900 text-xs font-bold uppercase tracking-wider">
              Post
            </button>
          </form>
        </div>
      </div>
    `;
  }).join('');
}

window.upvotePost = async function(postId, direction) {
  try {
    const res = await fetch(`/api/community/posts/${postId}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction })
    });
    if (res.ok) {
      loadCommunitySnaps();
    }
  } catch (err) {
    console.error("Upvote error:", err);
  }
};

window.submitComment = async function(event, postId) {
  event.preventDefault();
  const form = event.target;
  const input = form.querySelector('input');
  const text = input.value.trim();

  try {
    const res = await fetch(`/api/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: "Aman", text })
    });
    if (res.ok) {
      input.value = '';
      loadCommunitySnaps();
    }
  } catch (err) {
    console.error("Comment submit error:", err);
  }
};

// ─── Update UI Stats & Counters ─────────────────────
function updateDashboardStats() {
  const allScans = [...localScans];
  const totalPinsCount = SEED_PINS.length + allScans.length;

  navScanCount.textContent = `${allScans.length} Scans`;
  ciTotal.textContent = totalPinsCount;

  const seedScores = SEED_PINS.map(p => p.score);
  const scanScores = allScans.map(s => s.health_score);
  const allScores = [...seedScores, ...scanScores];
  const avgHealth = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0;

  ciAvg.textContent = avgHealth > 0 ? avgHealth : '—';

  let trendWord = "stable 📊";
  if (avgHealth > 70) trendWord = "improving 📈";
  else if (avgHealth < 50) trendWord = "declining 📉";

  ciInsight.textContent = `Urban green cover in Amravati is ${trendWord} based on community scan data.`;

  const uniqueSpecies = new Set([
    ...SEED_PINS.map(p => p.species.toLowerCase().trim()),
    ...allScans.map(s => s.species.toLowerCase().trim())
  ]);
  uniqueCountEl.textContent = uniqueSpecies.size;

  if (allScans.length > 0) {
    historySection.classList.remove('hidden');
    renderHistoryList(allScans.slice(0, 4));
  } else {
    historySection.classList.add('hidden');
  }
}

function renderHistoryList(scansList) {
  historyList.innerHTML = scansList.map(s => {
    const color = getPinColor(s.health_score);
    const scoreColorClass = s.health_score >= 71 ? 'text-green-400' : s.health_score >= 41 ? 'text-amber-400' : 'text-red-400';
    const dateStr = new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `
      <div class="flex items-center gap-2 rounded-xl bg-forest-800/40 border border-white/5 px-3 py-2">
        <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${color}"></span>
        <span class="text-xs text-white font-semibold flex-1 truncate">${s.species}</span>
        <span class="text-xs font-bold ${scoreColorClass}">${s.health_score}</span>
        <span class="text-[9px] text-gray-500">${dateStr}</span>
      </div>
    `;
  }).join('');
}

// ─── Helpers & Utilities ──────────────────────────────
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    loadFile(file);
  }
}

function loadFile(file) {
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = (event) => {
    previewImg.src = event.target.result;
    fileNameLabel.textContent = file.name;
    uploadDefault.classList.add('hidden');
    uploadPreview.classList.remove('hidden');
    scanBtn.disabled = false;
    scanBtn.classList.remove('bg-gray-800');
    scanBtn.classList.add('bg-green-600');
    hideError();
  };
  reader.readAsDataURL(file);
}

function clearUploadState() {
  selectedFile = null;
  fileInput.value = '';
  uploadDefault.classList.remove('hidden');
  uploadPreview.classList.add('hidden');
  scanBtn.disabled = true;
  scanBtn.classList.add('bg-gray-800');
  scanBtn.classList.remove('bg-green-600');
  hideError();
}

function setScanLoading(loading) {
  scanBtn.disabled = loading;
  if (loading) {
    scanIcon.classList.add('hidden');
    scanSpinner.classList.remove('hidden');
    scanLabel.textContent = "AI is diagnosing your plant...";
  } else {
    scanIcon.classList.remove('hidden');
    scanSpinner.classList.add('hidden');
    scanLabel.textContent = "Scan Plant";
  }
}

function showError(msg) {
  errorText.textContent = msg;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}

function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// ─── Gamification & Auto Grow Simulation Helpers ───────
function gainXP(amount) {
  growerXp += amount;
  if (growerXp >= 100) {
    growerLvl += 1;
    growerXp = growerXp - 100;
    fireConfetti();
    alert(`🎉 LEVEL UP! You reached Grower Level ${growerLvl}! Keep growing!`);
  }
  updateXpUi();
}

function updateXpUi() {
  const badge = document.getElementById('grower-level-badge');
  const text = document.getElementById('xp-text');
  const fill = document.getElementById('xp-progress-fill');
  if (badge) badge.textContent = `Lvl ${growerLvl}`;
  if (text) text.textContent = `${growerXp} / 100 XP`;
  if (fill) fill.style.width = `${growerXp}%`;
  
  localStorage.setItem('growerLvl', growerLvl);
  localStorage.setItem('growerXp', growerXp);
}

function initGrowthController() {
  const btnToggle = document.getElementById('btn-toggle-growth');
  const btnSpeed = document.getElementById('btn-speed-growth');
  
  if (btnToggle) btnToggle.addEventListener('click', toggleAutoGrowth);
  if (btnSpeed) btnSpeed.addEventListener('click', speedAutoGrowth);
  
  updateCountdownUi();
}

function toggleAutoGrowth() {
  const btnToggle = document.getElementById('btn-toggle-growth');
  if (!activePlantId) {
    alert("Please select or add a plant in 'My Garden' to start the simulation journey!");
    return;
  }
  
  if (isAutoGrowing) {
    clearInterval(growthInterval);
    isAutoGrowing = false;
    if (btnToggle) {
      btnToggle.textContent = "▶ Resume Auto Grow";
      btnToggle.style.backgroundColor = "transparent";
    }
  } else {
    isAutoGrowing = true;
    if (btnToggle) {
      btnToggle.textContent = "⏸ Pause Auto Grow";
      btnToggle.style.backgroundColor = "rgba(34, 197, 94, 0.25)";
    }
    runAutoGrowthLoop();
  }
}

function speedAutoGrowth() {
  const btnSpeed = document.getElementById('btn-speed-growth');
  if (growthSpeed === 1) {
    growthSpeed = 5;
  } else if (growthSpeed === 5) {
    growthSpeed = 10;
  } else {
    growthSpeed = 1;
  }
  if (btnSpeed) btnSpeed.textContent = `⚡ Speed: ${growthSpeed}x`;
  
  if (isAutoGrowing) {
    clearInterval(growthInterval);
    runAutoGrowthLoop();
  }
}

function runAutoGrowthLoop() {
  const intervalTime = growthSpeed === 1 ? 5000 : growthSpeed === 5 ? 2000 : 500;
  growthInterval = setInterval(autoGrowthTick, intervalTime);
}

async function autoGrowthTick() {
  const activePlant = myPlants.find(p => p.id === activePlantId);
  if (!activePlant) {
    toggleAutoGrowth();
    return;
  }
  
  activePlant.daysAlive += 1;
  
  let newStage = 1;
  if (activePlant.daysAlive >= 28) newStage = 6;
  else if (activePlant.daysAlive >= 21) newStage = 5;
  else if (activePlant.daysAlive >= 14) newStage = 4;
  else if (activePlant.daysAlive >= 7) newStage = 3;
  else if (activePlant.daysAlive >= 3) newStage = 2;
  
  const stageChanged = newStage !== activePlant.stage;
  
  if (stageChanged) {
    activePlant.stage = newStage;
    try {
      const res = await fetch(`/api/my-plants/${activePlant.id}/stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });
      if (res.ok) {
        const data = await res.json();
        const idx = myPlants.findIndex(p => p.id === data.plant.id);
        if (idx !== -1) myPlants[idx] = data.plant;
        
        gainXP(50);
        
        if (data.emailSent) {
          inboxEmailContent.innerHTML = data.emailSent.html;
          inboxModal.classList.remove('hidden');
        }
      }
    } catch (e) {
      console.error("Auto growth stage advance error:", e);
    }
  }
  
  renderActivePlantDetails();
  renderGardenSelectorList();
  updateCountdownUi();
}

function updateCountdownUi() {
  const activePlant = myPlants.find(p => p.id === activePlantId);
  const valSpan = document.getElementById('stage-countdown-val');
  if (!valSpan) return;
  
  if (!activePlant) {
    valSpan.textContent = "--";
    return;
  }
  
  const age = activePlant.daysAlive;
  let nextTarget = 0;
  
  if (age < 3) nextTarget = 3;
  else if (age < 7) nextTarget = 7;
  else if (age < 14) nextTarget = 14;
  else if (age < 21) nextTarget = 21;
  else if (age < 28) nextTarget = 28;
  
  if (nextTarget === 0) {
    valSpan.textContent = "Fully Grown! 🍅";
  } else {
    const diff = nextTarget - age;
    valSpan.textContent = `${diff} day${diff > 1 ? 's' : ''}`;
  }
}

// ─── Camera Scan Operations ────────────────────────────
async function startCamera() {
  hideError();
  clearUploadState();
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const constraints = {
        video: { facingMode: 'environment' }
      };
      localStream = await navigator.mediaDevices.getUserMedia(constraints);
      cameraStream.srcObject = localStream;
      
      uploadDefault.classList.add('hidden');
      uploadPreview.classList.add('hidden');
      cameraContainer.classList.remove('hidden');
    } catch (err) {
      console.error("Camera access failed:", err);
      showError("Could not access camera. Please select a photo file or check device permissions.");
    }
  } else {
    showError("Camera functionality is not supported by your browser or protocol.");
  }
}

function stopCamera() {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  if (cameraStream) {
    cameraStream.srcObject = null;
  }
  cameraContainer.classList.add('hidden');
}

function capturePhoto() {
  if (!localStream) return;
  
  const width = cameraStream.videoWidth || 640;
  const height = cameraStream.videoHeight || 480;
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(cameraStream, 0, 0, width, height);
  
  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      loadFile(file);
      stopCamera();
    }
  }, 'image/jpeg', 0.95);
}
