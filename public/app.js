// RootMap Frontend Application Logic

// ─── Constants & Configurations ──────────────────────
const AMRAVATI = [20.9374, 77.7796];

const SEED_PINS = [
  { lat: 20.9374, lng: 77.7796, species: 'Neem',           score: 88, daysAlive: 312 },
  { lat: 20.9412, lng: 77.7834, species: 'Tulsi',          score: 92, daysAlive: 204 },
  { lat: 20.9290, lng: 77.7720, species: 'Mango',          score: 45, daysAlive: 1102},
  { lat: 20.9501, lng: 77.7910, species: 'Banana',         score: 31, daysAlive: 87  },
  { lat: 20.9338, lng: 77.7650, species: 'Peepal',         score: 76, daysAlive: 2840},
  { lat: 20.9455, lng: 77.7780, species: 'Gulmohar',       score: 85, daysAlive: 430 },
  { lat: 20.9210, lng: 77.7860, species: 'Hibiscus',       score: 23, daysAlive: 61  },
  { lat: 20.9540, lng: 77.7700, species: 'Amla',           score: 67, daysAlive: 780 },
  { lat: 20.9360, lng: 77.7950, species: 'Curry Leaf',     score: 79, daysAlive: 365 },
  { lat: 20.9470, lng: 77.7830, species: 'Rose',           score: 55, daysAlive: 120 },
  { lat: 20.9280, lng: 77.7760, species: 'Papaya',         score: 18, daysAlive: 42  },
  { lat: 20.9390, lng: 77.7680, species: 'Ashwagandha',    score: 91, daysAlive: 270 },
  { lat: 20.9520, lng: 77.7845, species: 'Bamboo',         score: 83, daysAlive: 560 },
  { lat: 20.9315, lng: 77.7900, species: 'Aloe Vera',      score: 96, daysAlive: 480 },
  { lat: 20.9445, lng: 77.7730, species: 'Drumstick',      score: 72, daysAlive: 920 },
  { lat: 20.9250, lng: 77.7810, species: 'Cotton',         score: 39, daysAlive: 55  },
  { lat: 20.9490, lng: 77.7960, species: 'Bougainvillea',  score: 88, daysAlive: 340 },
  { lat: 20.9330, lng: 77.7740, species: 'Custard Apple',  score: 61, daysAlive: 210 },
  { lat: 20.9560, lng: 77.7870, species: 'Jasmine',        score: 77, daysAlive: 188 },
  { lat: 20.9200, lng: 77.7700, species: 'Tamarind',       score: 84, daysAlive: 4200},
];

const DEMO_PLANTS = [
  {
    species: 'Sweet Basil',
    scientific_name: 'Ocimum basilicum',
    health_score: 91,
    status: 'Healthy',
    diagnosis: 'Thriving with dense foliage.',
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
    species: 'Money Plant',
    scientific_name: 'Epipremnum aureum',
    health_score: 45,
    status: 'Stressed',
    diagnosis: 'Root-bound, needs repotting.',
    prescription: 'Repot into a 2-inch larger container with fresh potting soil.',
    is_plant: true,
    svg: `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f1a0f'/><text x='200' y='130' font-size='80' text-anchor='middle'>🌱</text><text x='200' y='195' font-size='22' text-anchor='middle' fill='%23f59e0b' font-family='Arial' font-weight='bold'>Money Plant</text><text x='200' y='225' font-size='13' text-anchor='middle' fill='%236b7280' font-family='Arial'>Demo Mode — Epipremnum aureum</text></svg>`
  },
  {
    species: 'Aloe Vera',
    scientific_name: 'Aloe barbadensis miller',
    health_score: 82,
    status: 'Healthy',
    diagnosis: 'Strong succulent, reduce watering frequency.',
    prescription: 'Allow the soil to dry out completely between waterings.',
    is_plant: true,
    svg: `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f1a0f'/><text x='200' y='130' font-size='80' text-anchor='middle'>🪴</text><text x='200' y='195' font-size='22' text-anchor='middle' fill='%2322c55e' font-family='Arial' font-weight='bold'>Aloe Vera</text><text x='200' y='225' font-size='13' text-anchor='middle' fill='%236b7280' font-family='Arial'>Demo Mode — Aloe barbadensis miller</text></svg>`
  }
];

// ─── Application State ──────────────────────────────
let map = null;
let tileLayer = null;
let localScans = [];
let demoIndex = 0;
let selectedFile = null;

// ─── DOM References ──────────────────────────────────
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
const scanTime       = document.getElementById('scan-time');
const fallbackBanner = document.getElementById('fallback-banner');

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

// ─── Initialization ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initListeners();
  loadInitialData();
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

  // CartoDB Dark Matter tiles
  tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> © <a href="https://carto.com">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Render 20 static seed pins
  SEED_PINS.forEach(p => {
    addPinToMap(p.lat, p.lng, p.species, p.score, false);
  });
}

function getPinColor(score) {
  if (score >= 71) return '#22c55e'; // green
  if (score >= 41) return '#f59e0b'; // orange
  return '#ef4444'; // red
}

function addPinToMap(lat, lng, species, score, isNew = false) {
  if (!map) return;

  const color = getPinColor(score);
  const healthLabel = score >= 71 ? 'Healthy' : score >= 41 ? 'Stressed' : 'Critical';

  const marker = L.circleMarker([lat, lng], {
    radius: 8,
    fillColor: color,
    color: '#000000',
    weight: 1.5,
    opacity: 1,
    fillOpacity: 0.85
  }).addTo(map);

  marker.bindPopup(`
    <div style="min-width:145px; font-family:'Inter',sans-serif; color:#f1f5f9; background:#152315; padding: 2px;">
      <div style="font-size:14px; font-weight:800; margin-bottom:2px; color:#22c55e;">${species}</div>
      <div style="font-size:11px; font-weight:600; margin-bottom:6px;">Score: <span style="color:${color};">${score}/100</span></div>
      <div style="font-size:10px; color:#94a3b8;">Status: ${healthLabel}</div>
    </div>
  `);

  if (isNew) {
    marker.openPopup();
    map.flyTo([lat, lng], 14, { animate: true, duration: 1.4 });
  }
}

// ─── Fetch API calls ──────────────────────────────────
async function loadInitialData() {
  try {
    const scansRes = await fetch('/api/scans');
    if (scansRes.ok) {
      localScans = await scansRes.json();
      
      // Render existing scan pins from the server
      localScans.forEach(s => {
        addPinToMap(s.lat, s.lng, s.species, s.health_score, false);
      });
    }

    updateDashboardStats();
  } catch (err) {
    console.error("Error loading server data:", err);
    updateDashboardStats();
  }
}

// ─── Event Listeners ──────────────────────────────────
function initListeners() {
  uploadZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);
  
  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearUploadState();
  });

  scanBtn.addEventListener('click', runDiagnosisScan);
  demoBtn.addEventListener('click', () => runDemoMode(false));

  intelToggle.addEventListener('click', () => {
    intelBody.classList.toggle('collapsed');
    intelChevron.classList.toggle('collapsed');
  });

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
    scanBtn.classList.remove('opacity-50');
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
  scanBtn.classList.add('opacity-50');
  hideError();
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

    // Success scan actions
    localScans.unshift(scanData);
    renderResult(scanData);
    addPinToMap(scanData.lat, scanData.lng, scanData.species, scanData.health_score, true);
    updateDashboardStats();
    
    if (scanData.health_score > 80) {
      fireConfetti();
    }

  } catch (error) {
    console.error("Gemini Scan Failed:", error);
    fallbackBanner.classList.remove('hidden');
    
    // Automatically trigger Demo mode client-side on failure
    runDemoMode(true);
    setScanLoading(false);
  }
}

// ─── Client-side Demo Mode ────────────────────────────
function runDemoMode(isFallback = false) {
  const d = DEMO_PLANTS[demoIndex];
  demoIndex = (demoIndex + 1) % DEMO_PLANTS.length;

  // Show SVG preview representation
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

  // Simulate server scan thinking timing
  setTimeout(() => {
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
    addPinToMap(fakeScan.lat, fakeScan.lng, fakeScan.species, fakeScan.health_score, true);
    updateDashboardStats();

    if (fakeScan.health_score > 80) {
      fireConfetti();
    }
  }, 1800);
}

// ─── Score ring animation (FIX 4 / Synchronized) ─────
function animateScore(target) {
  const circumference = 2 * Math.PI * 45;
  const start = performance.now();
  
  scoreRing.style.strokeDasharray = circumference;
  scoreRing.style.strokeDashoffset = circumference;
  
  function tick(now) {
    const t = Math.min((now - start) / 1000, 1);
    const eased = 1 - Math.pow(1 - t, 3); // Cubic Ease Out
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

// ─── Render Results Card ─────────────────────────────
function renderResult(data) {
  const score = Math.max(0, Math.min(100, Math.round(Number(data.health_score) || 0)));
  const colors = getHealthClasses(score);

  // Border & Glow styling
  resultCard.className = `rounded-2xl border p-5 slide-up bg-forest-800/40 ${colors.borderClass} ${colors.glowClass}`;
  resultCard.classList.remove('hidden');

  // Status Badge
  statusPill.textContent = colors.status;
  statusPill.className = `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1.5 ${colors.pillBg} ${colors.textColor}`;

  // Card Content
  speciesName.textContent = data.species;
  cardSubtitle.textContent = `Health Score: ${score}/100 • ${data.scientific_name}`;
  diagnosisText.textContent = data.diagnosis;
  prescriptionText.textContent = data.prescription;
  
  const dateStr = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  scanTime.textContent = `Scanned today at ${dateStr}`;

  // Ring Stroke Color
  scoreRing.setAttribute('stroke', colors.ringColor);

  // Animate Sync Progress
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

// ─── Update UI Stats & Counters ─────────────────────
function updateDashboardStats() {
  const allScans = [...localScans];
  const totalPinsCount = SEED_PINS.length + allScans.length;

  // Header Counter
  navScanCount.textContent = `${allScans.length} Scans`;

  // Stats Grid
  ciTotal.textContent = totalPinsCount;

  // Calculations
  const seedScores = SEED_PINS.map(p => p.score);
  const scanScores = allScans.map(s => s.health_score);
  const allScores = [...seedScores, ...scanScores];
  const avgHealth = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0;

  ciAvg.textContent = avgHealth > 0 ? avgHealth : '—';

  // Trend AI Insights
  let trendWord = "stable 📊";
  if (avgHealth > 70) trendWord = "improving 📈";
  else if (avgHealth < 50) trendWord = "declining 📉";

  ciInsight.textContent = `Urban green cover in Amravati is ${trendWord} based on community scan data.`;

  // Unique Species Biodiversity Score
  const uniqueSpecies = new Set([
    ...SEED_PINS.map(p => p.species.toLowerCase().trim()),
    ...allScans.map(s => s.species.toLowerCase().trim())
  ]);
  uniqueCountEl.textContent = uniqueSpecies.size;

  // Update History Section
  if (allScans.length > 0) {
    historySection.classList.remove('hidden');
    renderHistoryList(allScans.slice(0, 5));
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
      <div class="flex items-center gap-2.5 rounded-xl bg-forest-800/40 border border-white/5 px-3 py-2">
        <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${color}"></span>
        <span class="text-xs text-white font-semibold flex-1 truncate">${s.species}</span>
        <span class="text-xs font-bold ${scoreColorClass}">${s.health_score}</span>
        <span class="text-[9px] text-gray-500">${dateStr}</span>
      </div>
    `;
  }).join('');
}

// ─── Helpers & Utilities ──────────────────────────────
function setScanLoading(loading) {
  scanBtn.disabled = loading;
  if (loading) {
    scanIcon.classList.add('hidden');
    scanSpinner.classList.remove('hidden');
    scanLabel.textContent = "AI is diagnosing your plant...";
    scanBtn.classList.add('opacity-70');
  } else {
    scanIcon.classList.remove('hidden');
    scanSpinner.classList.add('hidden');
    scanLabel.textContent = "Scan Plant";
    scanBtn.classList.remove('opacity-70');
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
