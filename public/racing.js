// =============================================================================
// CORRIDA DO OLHO DE GATO – Rewrite v3 (fixed physics, tracks & AI)
// =============================================================================
'use strict';

const VIEW_W = 800;
const VIEW_H = 600;
const ROAD_W = 140; // half-width of road (total = 280px)

// ---------------------------------------------------------------------------
// Tracks – defined as closed cubic-spline control points.
// The engine tessellates them into small segments at startup.
// ---------------------------------------------------------------------------
const TRACK_DEFS = [
  {
    id: 'neon_city',
    name: 'METRÓPOLE NEON',
    type: 'circuit',
    theme: '#00f0ff',
    laps: 3,
    roadWidth: 140,
    // Control points (closed loop, counter-clockwise)
    ctrl: [
      { x: 600,  y: 1700 },
      { x: 1400, y: 1750 },
      { x: 2100, y: 1600 },
      { x: 2350, y: 1100 },
      { x: 2200, y: 500  },
      { x: 1700, y: 300  },
      { x: 1200, y: 650  },
      { x: 800,  y: 300  },
      { x: 350,  y: 500  },
      { x: 200,  y: 1100 },
      { x: 350,  y: 1500 }
    ],
    itemSpots: [0.08, 0.22, 0.38, 0.54, 0.70, 0.85]
  },
  {
    id: 'volcano',
    name: 'VULCÃO SUNSET',
    type: 'circuit',
    theme: '#ff5500',
    laps: 3,
    roadWidth: 130,
    ctrl: [
      { x: 500,  y: 1650 },
      { x: 1300, y: 1800 },
      { x: 2100, y: 1600 },
      { x: 2400, y: 1050 },
      { x: 2150, y: 450  },
      { x: 1550, y: 280  },
      { x: 900,  y: 480  },
      { x: 400,  y: 900  }
    ],
    itemSpots: [0.1, 0.3, 0.5, 0.7, 0.9]
  },
  {
    id: 'arena',
    name: 'ARENA COLISEU',
    type: 'arena',
    theme: '#ff007f',
    laps: 1,
    roadWidth: 900,
    // Arena – single big oval
    ctrl: [
      { x: 1100, y: 600  },
      { x: 1600, y: 700  },
      { x: 1900, y: 1100 },
      { x: 1600, y: 1500 },
      { x: 1100, y: 1600 },
      { x: 600,  y: 1500 },
      { x: 300,  y: 1100 },
      { x: 600,  y: 700  }
    ],
    itemSpots: [0.05, 0.15, 0.30, 0.45, 0.60, 0.75, 0.90]
  }
];

const RACERS = [
  { id: 0, name: 'Gato Neon',    icon: '🐱', color: '#00f0ff', maxSpd: 6.0,  accel: 0.22, brake: 0.38, drag: 0.972, turnRate: 0.065, driftBoost: 1.4, hp: 100 },
  { id: 1, name: 'Tigre Turbo',  icon: '🐯', color: '#ffea00', maxSpd: 6.8,  accel: 0.18, brake: 0.30, drag: 0.978, turnRate: 0.050, driftBoost: 1.6, hp: 90  },
  { id: 2, name: 'Pantera Cyber',icon: '🐆', color: '#ff007f', maxSpd: 5.8,  accel: 0.28, brake: 0.45, drag: 0.965, turnRate: 0.080, driftBoost: 1.3, hp: 110 },
  { id: 3, name: 'Gato Blindado',icon: '🐈', color: '#39ff14', maxSpd: 5.5,  accel: 0.20, brake: 0.35, drag: 0.970, turnRate: 0.058, driftBoost: 1.5, hp: 150 }
];

// ---------------------------------------------------------------------------
// Catmull-Rom spline utilities
// ---------------------------------------------------------------------------
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return {
    x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3)
  };
}

function buildTrackPath(ctrl, steps = 18) {
  const pts = [];
  const n = ctrl.length;
  for (let i = 0; i < n; i++) {
    const p0 = ctrl[(i - 1 + n) % n];
    const p1 = ctrl[i];
    const p2 = ctrl[(i + 1) % n];
    const p3 = ctrl[(i + 2) % n];
    for (let s = 0; s < steps; s++) {
      pts.push(catmullRom(p0, p1, p2, p3, s / steps));
    }
  }
  return pts;
}

/** Cumulative arc-length array for t in [0,1] lookups */
function buildArcTable(pts) {
  const arc = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i-1].x;
    const dy = pts[i].y - pts[i-1].y;
    arc.push(arc[i-1] + Math.hypot(dx, dy));
  }
  return arc;
}

/** Closest point on path to (x,y) – returns { index, t01, dist, nx, ny } */
function closestOnPath(pts, arcTable, x, y) {
  let best = Infinity, bestIdx = 0;
  for (let i = 0; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - x, pts[i].y - y);
    if (d < best) { best = d; bestIdx = i; }
  }
  const total = arcTable[arcTable.length - 1];
  const t01 = arcTable[bestIdx] / total;
  // tangent normal (perpendicular to path)
  const next = pts[(bestIdx + 1) % pts.length];
  const prev = pts[(bestIdx - 1 + pts.length) % pts.length];
  const tx = next.x - prev.x, ty = next.y - prev.y;
  const len = Math.hypot(tx, ty) || 1;
  const nx = -ty / len, ny = tx / len;
  const side = (x - pts[bestIdx].x) * nx + (y - pts[bestIdx].y) * ny;
  return { index: bestIdx, t01, dist: best, nx, ny, side };
}

/** Find a point along the path at fraction t01 */
function ptAtT(pts, arcTable, t01) {
  const total = arcTable[arcTable.length - 1];
  const target = ((t01 % 1) + 1) % 1 * total;
  let lo = 0, hi = arcTable.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (arcTable[mid] < target) lo = mid; else hi = mid;
  }
  const frac = (target - arcTable[lo]) / (arcTable[hi] - arcTable[lo] + 1e-9);
  return {
    x: pts[lo].x + (pts[hi].x - pts[lo].x) * frac,
    y: pts[lo].y + (pts[hi].y - pts[lo].y) * frac
  };
}

// Build world bounds from the path
function getWorldBounds(pts, margin = 300) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX: minX - margin, minY: minY - margin, maxX: maxX + margin, maxY: maxY + margin };
}

// ---------------------------------------------------------------------------
// Main racing engine
// ---------------------------------------------------------------------------
class CatsEyeRacing {
  constructor() {
    this.canvas = document.getElementById('raceCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.state = 'idle'; // idle | countdown | racing | finished
    this.mode = '1p';
    this.karts = [];
    this.projectiles = [];
    this.traps = [];
    this.particles = [];
    this.shockwaves = [];
    this.floatTexts = [];

    this.trackDef = null;
    this.trackPts = [];
    this.arcTable = [];
    this.worldBounds = {};
    this.itemBoxes = [];

    this.camera = { x: 0, y: 0 };
    this.countdown = 3;
    this.countdownStart = 0;
    this.screenShake = 0;

    this.keys = {};
    this._lastRaceSyncTs = 0;

    // Build key state from global active keys (shared with arcade panel)
    window.addEventListener('keydown', e => { this.keys[e.code] = true; this.keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup',   e => { this.keys[e.code] = false; this.keys[e.key.toLowerCase()] = false; });

    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
    this._initNetwork();
  }

  _initNetwork() {
    const net = window.networkManager;
    if (!net) return;
    net.onRaceSync = (state) => {
      if (this.mode !== 'online') return;
      (state.karts || []).forEach(rk => {
        const lk = this.karts.find(k => k.id === rk.id && !k.isHuman);
        if (!lk) return;
        lk.x     += (rk.x - lk.x) * 0.35;
        lk.y     += (rk.y - lk.y) * 0.35;
        lk.angle  = rk.angle;
        lk.speed  = rk.speed;
        lk.hp     = rk.hp;
        lk.item   = rk.item;
      });
    };
    net.onRaceDamage = (d) => {
      const k = this.karts.find(k => k.id === d.targetId);
      if (k) this._damageKart(k, d.damage, d.attackerId);
    };
  }

  // ── Public: called from HTML ───────────────────────────────────────────────
  startRace(mode = '1p', trackIdx = 0, racerIdx = 0) {
    if (!this.canvas) {
      this.canvas = document.getElementById('raceCanvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    }

    this.mode = mode;
    this.trackDef = TRACK_DEFS[trackIdx % TRACK_DEFS.length];

    // Build spline
    this.trackPts = buildTrackPath(this.trackDef.ctrl, 22);
    this.arcTable  = buildArcTable(this.trackPts);
    this.worldBounds = getWorldBounds(this.trackPts, 350);

    // Resize canvas to full container
    if (this.canvas) {
      this.canvas.width  = this.canvas.clientWidth  || VIEW_W;
      this.canvas.height = this.canvas.clientHeight || VIEW_H;
    }

    // Reset state
    this.karts       = [];
    this.projectiles = [];
    this.traps       = [];
    this.particles   = [];
    this.shockwaves  = [];
    this.floatTexts  = [];
    this.screenShake = 0;

    // Build item boxes from spot fractions
    this.itemBoxes = this.trackDef.itemSpots.map(t => {
      const pt = ptAtT(this.trackPts, this.arcTable, t);
      return { x: pt.x, y: pt.y, r: 22, respawn: 0, t01: t };
    });

    // Spawn karts
    this._spawnKarts(mode, racerIdx);

    const p1 = this.karts[0];
    this.camera.x = p1.x;
    this.camera.y = p1.y;

    // UI switch
    const menu   = document.getElementById('main-menu');
    const screen = document.getElementById('racing-screen');
    const over   = document.getElementById('race-game-over-screen');
    if (menu)   menu.classList.remove('active');
    if (over)   over.classList.remove('active');
    if (screen) screen.classList.add('active');

    this.countdown = 3;
    this.countdownStart = Date.now();
    this.state = 'countdown';
    if (window.retroAudio) window.retroAudio.playCountdown(false);
  }

  returnToMenu() {
    this.state = 'idle';
    const menu   = document.getElementById('main-menu');
    const screen = document.getElementById('racing-screen');
    const over   = document.getElementById('race-game-over-screen');
    if (screen) screen.classList.remove('active');
    if (over)   over.classList.remove('active');
    if (menu)   menu.classList.add('active');
  }

  // ── Kart spawning ──────────────────────────────────────────────────────────
  _spawnKarts(mode, racerIdx) {
    const isArena  = this.trackDef.type === 'arena';
    const totalPts = this.trackPts.length;

    if (isArena) {
      const n = 8;
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2;
        // spawn around center along a ring inside the arena
        const cx = (this.worldBounds.minX + this.worldBounds.maxX) / 2;
        const cy = (this.worldBounds.minY + this.worldBounds.maxY) / 2;
        const r  = this.trackDef.roadWidth * 0.45;
        const x  = cx + Math.cos(angle) * r;
        const y  = cy + Math.sin(angle) * r;
        const isP1 = i === 0;
        const isP2 = mode === '2p_local' && i === 1;
        const rid  = isP1 ? racerIdx : (i % RACERS.length);
        this.karts.push(this._makeKart({
          id: isP1 ? 'p1' : (isP2 ? 'p2' : `bot${i}`),
          name: isP1 ? `${RACERS[rid].name} (VOCÊ)` : (isP2 ? `${RACERS[rid].name} (P2)` : `${RACERS[rid].name} (IA)`),
          isHuman: isP1 || isP2,
          playerNum: isP1 ? 1 : (isP2 ? 2 : 0),
          rid,
          x, y,
          angle: angle + Math.PI
        }));
      }
    } else {
      // Grid on the path at t=0 (finish/start line)
      const cols = 2;
      const gap  = 80;
      const p0   = ptAtT(this.trackPts, this.arcTable, 0);
      const p1   = ptAtT(this.trackPts, this.arcTable, 0.02);
      const tangAngle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
      const perpAngle = tangAngle + Math.PI / 2;
      const n = mode === '2p_local' ? 7 : 6;  // +1 player

      let k = 0;
      for (let i = 0; i <= n; i++) {
        const col  = i % cols;
        const row  = Math.floor(i / cols);
        const side = col === 0 ? -1 : 1;
        const x    = p0.x + Math.cos(perpAngle) * side * 40 - Math.cos(tangAngle) * row * gap;
        const y    = p0.y + Math.sin(perpAngle) * side * 40 - Math.sin(tangAngle) * row * gap;
        const isP1 = i === 0;
        const isP2 = mode === '2p_local' && i === 1;
        const rid  = isP1 ? racerIdx : (isP2 ? (racerIdx + 1) % RACERS.length : k % RACERS.length);
        if (!isP1 && !isP2) k++;
        this.karts.push(this._makeKart({
          id: isP1 ? 'p1' : (isP2 ? 'p2' : `bot${i}`),
          name: isP1 ? `${RACERS[rid].name} (VOCÊ)` : (isP2 ? `${RACERS[rid].name} (P2)` : `${RACERS[rid].name} (IA)`),
          isHuman: isP1 || isP2,
          playerNum: isP1 ? 1 : (isP2 ? 2 : 0),
          rid,
          x, y,
          angle: tangAngle
        }));
      }
    }
  }

  _makeKart(cfg) {
    const r = RACERS[cfg.rid];
    return {
      id: cfg.id,
      name: cfg.name,
      isHuman: cfg.isHuman,
      playerNum: cfg.playerNum,
      racer: r,
      x: cfg.x,
      y: cfg.y,
      vx: 0,
      vy: 0,
      angle: cfg.angle,
      speed: 0,
      isDrifting: false,
      driftDir: 0,
      driftCharge: 0,
      nitroTimer: 0,
      spinTimer: 0,
      shieldTimer: 0,
      hp: r.hp,
      maxHp: r.hp,
      item: null,
      kills: 0,
      // race progress
      lapProgress: 0,  // t01 on path
      laps: 0,
      nextLapCross: false,
      rank: 1,
      finished: false,
      eliminated: false,
      // AI
      aiTarget: 0,
      // render
      trail: []
    };
  }

  // ── Main loop ──────────────────────────────────────────────────────────────
  _loop(ts) {
    try {
      this._update(ts);
      this._render();
    } catch(e) {
      console.error('[Racing] loop error', e);
    }
    requestAnimationFrame(this._loop);
  }

  _update() {
    // Countdown
    if (this.state === 'countdown') {
      const elapsed = Date.now() - this.countdownStart;
      const newCount = 3 - Math.floor(elapsed / 900);
      if (newCount !== this.countdown) {
        this.countdown = newCount;
        if (this.countdown > 0 && window.retroAudio) window.retroAudio.playCountdown(false);
        else if (this.countdown <= 0) {
          if (window.retroAudio) window.retroAudio.playCountdown(true);
          this.state = 'racing';
        }
      }
      return;
    }
    if (this.state !== 'racing' && this.state !== 'finished') return;

    if (this.screenShake > 0) this.screenShake = Math.max(0, this.screenShake - 0.4);

    // Item boxes respawn
    this.itemBoxes.forEach(b => { if (b.respawn > 0) b.respawn--; });

    // Karts
    this.karts.forEach(k => {
      if (!k.eliminated) this._updateKart(k);
    });

    // Kart–kart collisions
    for (let i = 0; i < this.karts.length; i++) {
      for (let j = i+1; j < this.karts.length; j++) {
        this._kartCollide(this.karts[i], this.karts[j]);
      }
    }

    // Pillars (arena)
    if (this.trackDef.pillars) {
      this.karts.forEach(k => {
        (this.trackDef.pillars || []).forEach(pil => {
          const dx = k.x - pil.x, dy = k.y - pil.y;
          const d  = Math.hypot(dx, dy);
          const minD = pil.r + 18;
          if (d < minD && d > 0) {
            k.x += (dx/d) * (minD - d);
            k.y += (dy/d) * (minD - d);
            k.speed *= 0.5;
            this.screenShake = Math.max(this.screenShake, 4);
          }
        });
      });
    }

    // Projectiles & traps
    this._updateProjectiles();
    this._updateTraps();

    // Particles / FX
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.035;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += (sw.maxR - sw.r) * 0.18 + 1.5;
      sw.alpha -= 0.04;
      if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
    }
    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y -= 1.2; ft.alpha -= 0.02;
      if (ft.alpha <= 0) this.floatTexts.splice(i, 1);
    }

    // Rankings
    this._updateRankings();

    // Camera – follow P1 with smooth lerp
    const p1 = this.karts.find(k => k.id === 'p1');
    if (p1) {
      this.camera.x += (p1.x - this.camera.x) * 0.11;
      this.camera.y += (p1.y - this.camera.y) * 0.11;
    }

    // Network sync (host → guests, 20 Hz)
    const now = Date.now();
    if (this.mode === 'online' && window.networkManager?.role === 'host' && now - this._lastRaceSyncTs > 50) {
      this._lastRaceSyncTs = now;
      window.networkManager.sendRaceSync({
        karts: this.karts.map(k => ({ id: k.id, x: Math.round(k.x), y: Math.round(k.y), angle: +k.angle.toFixed(3), speed: +k.speed.toFixed(2), hp: k.hp, item: k.item }))
      });
    }
  }

  // ── Single kart update ─────────────────────────────────────────────────────
  _updateKart(k) {
    // Timers
    if (k.spinTimer  > 0) k.spinTimer--;
    if (k.nitroTimer > 0) k.nitroTimer--;
    if (k.shieldTimer> 0) k.shieldTimer--;

    // Spin effect
    if (k.spinTimer > 0) {
      k.angle += 0.25;
      k.speed *= 0.92;
      k.x += Math.cos(k.angle) * k.speed;
      k.y += Math.sin(k.angle) * k.speed;
      this._constrainToTrack(k);
      return;
    }

    // Controls (Intuitivos e Padronizados)
    let gas = false, brake = false, left = false, right = false, drift = false, useItem = false;
    if (k.isHuman) {
      if (k.playerNum === 1) {
        // P1: WASD ou Setas para pilotar
        gas     = !!(this.keys['KeyW'] || this.keys['ArrowUp'] || this.keys['w']);
        brake   = !!(this.keys['KeyS'] || this.keys['ArrowDown'] || this.keys['s']);
        left    = !!(this.keys['KeyA'] || this.keys['ArrowLeft'] || this.keys['a']);
        right   = !!(this.keys['KeyD'] || this.keys['ArrowRight'] || this.keys['d']);
        
        // P1 Ações: ESPAÇO ou ENTER = USAR PODER / ATIRAR (Muito mais intuitivo!)
        useItem = !!(this.keys['Space'] || this.keys['Enter'] || this.keys['KeyE'] || this.keys['e'] || this.keys['KeyF'] || this.keys['f']);
        
        // P1 Drift: SHIFT, CTRL ou Q
        drift   = !!(this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.keys['ControlLeft'] || this.keys['KeyQ'] || this.keys['q']);
      } else {
        // P2: IJKL ou Numpad 8,4,5,6
        gas     = !!(this.keys['KeyI'] || this.keys['i'] || this.keys['Numpad8']);
        brake   = !!(this.keys['KeyK'] || this.keys['k'] || this.keys['Numpad5'] || this.keys['Numpad2']);
        left    = !!(this.keys['KeyJ'] || this.keys['j'] || this.keys['Numpad4']);
        right   = !!(this.keys['KeyL'] || this.keys['l'] || this.keys['Numpad6']);
        
        // P2 Ações: NumpadEnter, O ou P
        useItem = !!(this.keys['NumpadEnter'] || this.keys['KeyO'] || this.keys['o']);
        drift   = !!(this.keys['Numpad0'] || this.keys['KeyU'] || this.keys['u'] || this.keys['KeyP'] || this.keys['p']);
      }
    } else {
      const ai = this._aiCmd(k);
      gas = ai.gas; brake = ai.brake; left = ai.left; right = ai.right; drift = ai.drift; useItem = ai.useItem;
    }

    if (useItem && k.item) this._useItem(k);

    // Acceleration / brake
    const topSpd = k.nitroTimer > 0 ? k.racer.maxSpd * 1.55 : k.racer.maxSpd;
    if (gas)   k.speed = Math.min(topSpd, k.speed + k.racer.accel);
    else if (brake) k.speed = Math.max(-topSpd * 0.4, k.speed - k.racer.brake);
    else       k.speed *= k.racer.drag;

    // Drift
    if (drift && Math.abs(k.speed) > 2.2 && (left || right)) {
      if (!k.isDrifting) {
        k.isDrifting = true;
        k.driftDir   = left ? -1 : 1;
        k.driftCharge = 0;
      }
      k.angle     += k.driftDir * k.racer.turnRate * 1.4;
      k.driftCharge += 2.2;
      if (Math.random() < 0.5) this._sparkParticle(k);
    } else {
      if (k.isDrifting) {
        if (k.driftCharge > 90) {
          k.nitroTimer = 60;
          if (window.retroAudio) window.retroAudio.playPaddleHit(true);
          this._floatText(k.x, k.y - 25, '⚡ MEGA TURBO!', '#ffea00');
          this._shockwave(k.x, k.y, '#ffea00', 50);
        } else if (k.driftCharge > 45) {
          k.nitroTimer = 30;
          if (window.retroAudio) window.retroAudio.playPaddleHit(false);
          this._floatText(k.x, k.y - 25, '⚡ MINI TURBO!', '#00f0ff');
          this._shockwave(k.x, k.y, '#00f0ff', 35);
        }
        k.isDrifting = false;
        k.driftCharge = 0;
      }
      if (left)  k.angle -= k.racer.turnRate * Math.max(0.3, Math.abs(k.speed) / k.racer.maxSpd);
      if (right) k.angle += k.racer.turnRate * Math.max(0.3, Math.abs(k.speed) / k.racer.maxSpd);
    }

    // Nitro spark
    if (k.nitroTimer > 0 && Math.random() < 0.4) {
      this.particles.push({
        x: k.x - Math.cos(k.angle)*18, y: k.y - Math.sin(k.angle)*18,
        vx: -Math.cos(k.angle)*3 + (Math.random()-.5)*2,
        vy: -Math.sin(k.angle)*3 + (Math.random()-.5)*2,
        life: 0.6, color: Math.random()>.5 ? '#ffea00' : '#ff007f', size: 5
      });
    }

    // Move
    k.x += Math.cos(k.angle) * k.speed;
    k.y += Math.sin(k.angle) * k.speed;

    // Trail
    k.trail.push({ x: k.x, y: k.y, drift: k.isDrifting });
    if (k.trail.length > 16) k.trail.shift();

    // Constrain to track / world
    this._constrainToTrack(k);

    // Item box pickup
    this.itemBoxes.forEach(b => {
      if (b.respawn > 0 || k.item) return;
      if (Math.hypot(k.x - b.x, k.y - b.y) < b.r + 16) {
        b.respawn = 200;
        const items = ['missile', 'trap', 'nitro', 'shield', 'bomb'];
        k.item = items[Math.floor(Math.random() * items.length)];
        if (window.retroAudio) window.retroAudio.playPortal();
        this._hitParticles(b.x, b.y, '#ffea00', 14);
        this._shockwave(b.x, b.y, '#00f0ff', 32);
        this._floatText(k.x, k.y - 28, `🎁 ${this._itemName(k.item)}!`, '#ffea00');
      }
    });

    // Lap / progress tracking (circuit only)
    if (this.trackDef.type === 'circuit') {
      const info = closestOnPath(this.trackPts, this.arcTable, k.x, k.y);
      const t = info.t01;

      // Detect crossing finish line (t wraps from ~0.98→0.02)
      const old = k.lapProgress;
      if (old > 0.88 && t < 0.12) {
        k.laps++;
        if (k.isHuman) {
          if (window.retroAudio) window.retroAudio.playScore(true);
          this._floatText(k.x, k.y - 35, `🏁 VOLTA ${k.laps}/${this.trackDef.laps}!`, '#00f0ff');
        }
        if (k.laps >= this.trackDef.laps && !k.finished) {
          k.finished = true;
          if (k.isHuman) {
            this.state = 'finished';
            this._spawnConfetti();
            this._showGameOver(k.rank);
          }
        }
      } else if (old < 0.12 && t > 0.88) {
        // Went backwards – don't count
      }
      k.lapProgress = t;
    }
  }

  // Push kart back onto track if it wanders too far off road
  _constrainToTrack(k) {
    if (this.trackDef.type === 'arena') {
      // Keep inside arena bounds (generous oval)
      const cx = (this.worldBounds.minX + this.worldBounds.maxX) / 2;
      const cy = (this.worldBounds.minY + this.worldBounds.maxY) / 2;
      const rx = (this.worldBounds.maxX - this.worldBounds.minX) / 2 - 60;
      const ry = (this.worldBounds.maxY - this.worldBounds.minY) / 2 - 60;
      const ex = (k.x - cx) / rx;
      const ey = (k.y - cy) / ry;
      const d  = Math.hypot(ex, ey);
      if (d > 1) {
        k.x = cx + (ex / d) * rx;
        k.y = cy + (ey / d) * ry;
        k.speed *= 0.6;
      }
    } else {
      const info = closestOnPath(this.trackPts, this.arcTable, k.x, k.y);
      const halfW = this.trackDef.roadWidth;
      if (Math.abs(info.side) > halfW) {
        const overshoot = Math.abs(info.side) - halfW;
        const sign = info.side > 0 ? -1 : 1;
        k.x += info.nx * sign * overshoot;
        k.y += info.ny * sign * overshoot;
        // Slow down on grass
        k.speed *= 0.82;
        if (k.isHuman) {
          if (!k._onGrass) { k._onGrass = true; }
        } else {
          // Steer back to track
          const correctAngle = Math.atan2(info.ny * sign, info.nx * sign);
          let diff = correctAngle - k.angle;
          while (diff >  Math.PI) diff -= Math.PI*2;
          while (diff < -Math.PI) diff += Math.PI*2;
          k.angle += diff * 0.18;
        }
      } else {
        k._onGrass = false;
      }
    }

    // Hard world bounds
    const b = this.worldBounds;
    k.x = Math.max(b.minX + 20, Math.min(b.maxX - 20, k.x));
    k.y = Math.max(b.minY + 20, Math.min(b.maxY - 20, k.y));
  }

  // ── AI ─────────────────────────────────────────────────────────────────────
  _aiCmd(k) {
    let targetX, targetY;

    if (this.trackDef.type === 'arena') {
      // Chase nearest non-bot or grab item box
      let nearDist = Infinity;
      this.karts.forEach(other => {
        if (other.id === k.id || other.eliminated) return;
        const d = Math.hypot(other.x - k.x, other.y - k.y);
        if (d < nearDist) { nearDist = d; targetX = other.x; targetY = other.y; }
      });
      if (!k.item) {
        this.itemBoxes.forEach(b => {
          if (b.respawn > 0) return;
          const d = Math.hypot(b.x - k.x, b.y - k.y);
          if (d < nearDist) { nearDist = d; targetX = b.x; targetY = b.y; }
        });
      }
      if (targetX === undefined) { targetX = (this.worldBounds.minX + this.worldBounds.maxX)/2; targetY = (this.worldBounds.minY + this.worldBounds.maxY)/2; }
    } else {
      // Follow track: aim at a look-ahead point
      const lookAhead = 0.035 + k.speed * 0.002;
      const aheadT = (k.lapProgress + lookAhead) % 1;
      const pt = ptAtT(this.trackPts, this.arcTable, aheadT);
      targetX = pt.x;
      targetY = pt.y;
    }

    const targetAngle = Math.atan2(targetY - k.y, targetX - k.x);
    let diff = targetAngle - k.angle;
    while (diff >  Math.PI) diff -= Math.PI*2;
    while (diff < -Math.PI) diff += Math.PI*2;

    const sharpTurn = Math.abs(diff) > 0.65;
    const gas   = !sharpTurn || k.speed < 2.5;
    const brake = sharpTurn && k.speed > 4.5;
    const left  = diff < -0.08;
    const right = diff >  0.08;
    const drift = sharpTurn && k.speed > 3.5 && Math.random() < 0.5;
    const useItem = !!k.item && Math.random() < 0.04;
    return { gas, brake, left, right, drift, useItem };
  }

  // ── Items ──────────────────────────────────────────────────────────────────
  _useItem(k) {
    const item = k.item;
    k.item = null;
    if (item === 'nitro') {
      k.nitroTimer = 90;
      if (window.retroAudio) window.retroAudio.playPaddleHit(true);
      this._floatText(k.x, k.y-28, '⚡ NITRO MAX!', '#ffea00');
      this._shockwave(k.x, k.y, '#ffea00', 55);
    } else if (item === 'shield') {
      k.shieldTimer = 380;
      if (window.retroAudio) window.retroAudio.playPortal();
      this._floatText(k.x, k.y-28, '🛡️ ESCUDO!', '#00f0ff');
    } else if (item === 'trap') {
      this.traps.push({ x: k.x - Math.cos(k.angle)*34, y: k.y - Math.sin(k.angle)*34, r: 18, life: 900 });
      if (window.retroAudio) window.retroAudio.playWallBounce();
      this._floatText(k.x, k.y-28, '🐟 ARMADILHA!', '#ffaa00');
    } else if (item === 'missile') {
      const target = this._nearestEnemy(k);
      this.projectiles.push({ type: 'missile', owner: k.id, x: k.x + Math.cos(k.angle)*28, y: k.y + Math.sin(k.angle)*28, angle: k.angle, speed: 11, target, life: 240 });
      if (window.retroAudio) window.retroAudio.playBlasterHit();
      this._floatText(k.x, k.y-28, '🚀 MÍSSIL!', '#ff0055');
    } else if (item === 'bomb') {
      this.projectiles.push({ type: 'bomb', owner: k.id, x: k.x + Math.cos(k.angle)*32, y: k.y + Math.sin(k.angle)*32, angle: k.angle, speed: 7, timer: 80 });
      if (window.retroAudio) window.retroAudio.playPaddleHit(false);
      this._floatText(k.x, k.y-28, '💣 BOMBA EMP!', '#ff00ff');
    }
  }

  _nearestEnemy(src) {
    let best = null, bestD = Infinity;
    this.karts.forEach(k => {
      if (k.id === src.id || k.eliminated) return;
      const d = Math.hypot(k.x - src.x, k.y - src.y);
      if (d < bestD) { bestD = d; best = k; }
    });
    return best;
  }

  _itemName(item) {
    return { missile:'MÍSSIL', trap:'PEIXE-ÓLEO', nitro:'SUPER NITRO', shield:'ESCUDO', bomb:'BOMBA EMP' }[item] || 'ITEM';
  }

  // ── Collisions ─────────────────────────────────────────────────────────────
  _kartCollide(a, b) {
    if (a.eliminated || b.eliminated) return;
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    const minD = 32;
    if (dist < minD && dist > 0) {
      const nx = dx/dist, ny = dy/dist;
      const push = (minD - dist) * 0.55;
      a.x -= nx * push; a.y -= ny * push;
      b.x += nx * push; b.y += ny * push;

      // Speed exchange
      const relSpd = Math.abs(a.speed - b.speed);
      const wA = a.racer.maxSpd, wB = b.racer.maxSpd;
      const newA = (a.speed * (wA - wB) + 2 * wB * b.speed) / (wA + wB);
      const newB = (b.speed * (wB - wA) + 2 * wA * a.speed) / (wA + wB);
      a.speed = newA * 0.9; b.speed = newB * 0.9;

      this.screenShake = Math.max(this.screenShake, 5);
      if (window.retroAudio) window.retroAudio.playPaddleHit(false);
      this._hitParticles((a.x+b.x)/2, (a.y+b.y)/2, '#ffea00', 10);

      // Arena damage from high-speed ram
      if (this.trackDef.type === 'arena' && relSpd > 3) {
        const dmg = Math.round(relSpd * 6);
        if (a.shieldTimer <= 0) this._damageKart(a, dmg, b.id);
        if (b.shieldTimer <= 0) this._damageKart(b, dmg, a.id);
      }
    }
  }

  _damageKart(k, dmg, attackerId) {
    if (k.shieldTimer > 0 || k.eliminated) return;
    k.hp = Math.max(0, k.hp - dmg);
    k.spinTimer = Math.max(k.spinTimer, 30);
    this._hitParticles(k.x, k.y, '#ff0055', 16);
    this._floatText(k.x, k.y-22, `💥 -${dmg}HP`, '#ff0055');
    this.screenShake = Math.max(this.screenShake, 8);
    if (window.networkManager?.role === 'host') {
      window.networkManager.sendRaceDamage(k.id, dmg, attackerId);
    }
    if (k.hp <= 0) this._eliminateKart(k, attackerId);
  }

  _eliminateKart(k, attackerId) {
    k.eliminated = true;
    if (attackerId) {
      const atk = this.karts.find(a => a.id === attackerId);
      if (atk) atk.kills++;
    }
    this.screenShake = 14;
    this._hitParticles(k.x, k.y, '#ff0055', 40);
    this._shockwave(k.x, k.y, '#ff0055', 75);
    if (window.retroAudio) window.retroAudio.playBlasterHit();
    this._floatText(k.x, k.y-35, `☠️ ${k.name} K.O.!`, '#ff0033');

    if (k.id === 'p1') {
      this.state = 'finished';
      const alive = this.karts.filter(x => !x.eliminated).length;
      this._showGameOver(alive + 1);
    } else {
      const alive = this.karts.filter(x => !x.eliminated && x.isHuman);
      if (alive.length === 1 && alive[0].id === 'p1') {
        this.state = 'finished';
        this._spawnConfetti();
        this._showGameOver(1);
      }
    }
  }

  // ── Projectiles & traps ────────────────────────────────────────────────────
  _updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life--;

      if (p.type === 'missile') {
        if (p.target && !p.target.eliminated) {
          let d = Math.atan2(p.target.y - p.y, p.target.x - p.x) - p.angle;
          while (d >  Math.PI) d -= Math.PI*2;
          while (d < -Math.PI) d += Math.PI*2;
          p.angle += d * 0.09;
        }
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        if (Math.random() < 0.5) this.particles.push({ x:p.x, y:p.y, vx:(Math.random()-.5)*2, vy:(Math.random()-.5)*2, life:0.4, color:'#ff5500', size:4 });

        this.karts.forEach(k => {
          if (k.id === p.owner || k.eliminated || k.shieldTimer > 0) return;
          if (Math.hypot(k.x - p.x, k.y - p.y) < 30) {
            this._damageKart(k, 38, p.owner);
            p.life = 0;
            this.screenShake = Math.max(this.screenShake, 10);
          }
        });
      }

      if (p.type === 'bomb') {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.timer--;
        if (p.timer <= 0) {
          p.life = 0;
          this._shockwave(p.x, p.y, '#ff00ff', 80);
          this._hitParticles(p.x, p.y, '#ff00ff', 28);
          this.screenShake = Math.max(this.screenShake, 12);
          this.karts.forEach(k => {
            if (k.id === p.owner || k.eliminated || k.shieldTimer > 0) return;
            if (Math.hypot(k.x - p.x, k.y - p.y) < 90) {
              this._damageKart(k, 25, p.owner);
              k.spinTimer = Math.max(k.spinTimer, 55);
            }
          });
        }
      }

      if (p.life <= 0) this.projectiles.splice(i, 1);
    }
  }

  _updateTraps() {
    for (let i = this.traps.length - 1; i >= 0; i--) {
      const t = this.traps[i];
      t.life--;
      this.karts.forEach(k => {
        if (k.eliminated || k.shieldTimer > 0) return;
        if (Math.hypot(k.x - t.x, k.y - t.y) < t.r + 16) {
          k.spinTimer = Math.max(k.spinTimer, 48);
          k.hp = Math.max(0, k.hp - 18);
          if (window.retroAudio) window.retroAudio.playWallBounce();
          this._hitParticles(t.x, t.y, '#ffaa00', 16);
          this._floatText(k.x, k.y-25, '🌀 ESCORREGOU!', '#ffaa00');
          if (k.hp <= 0) this._eliminateKart(k, null);
          t.life = 0;
        }
      });
      if (t.life <= 0) this.traps.splice(i, 1);
    }
  }

  // ── Rankings ───────────────────────────────────────────────────────────────
  _updateRankings() {
    if (this.trackDef.type === 'arena') {
      const alive = this.karts.filter(k => !k.eliminated).length;
      const p1 = this.karts.find(k => k.id === 'p1');
      if (p1) {
        const posEl  = document.getElementById('race-hud-pos');
        const lapEl  = document.getElementById('race-hud-lap');
        const itemEl = document.getElementById('race-hud-item');
        if (posEl)  posEl.innerText  = `❤️ ${p1.hp}/${p1.maxHp}`;
        if (lapEl)  lapEl.innerText  = `VIVOS: ${alive}/${this.karts.length}`;
        if (itemEl) itemEl.innerText = p1.item ? `🎁 ${this._itemName(p1.item)}` : 'NENHUM';
      }
    } else {
      // Rank by laps then track progress
      const ranked = [...this.karts].sort((a, b) => {
        if (a.finished !== b.finished) return a.finished ? -1 : 1;
        if (a.laps !== b.laps) return b.laps - a.laps;
        // Same lap: further along path
        let at = a.lapProgress, bt = b.lapProgress;
        // Normalise so 0 = start/finish
        return bt - at;
      });
      ranked.forEach((k, i) => { k.rank = i + 1; });

      const p1 = this.karts.find(k => k.id === 'p1');
      if (p1) {
        const posEl  = document.getElementById('race-hud-pos');
        const lapEl  = document.getElementById('race-hud-lap');
        const itemEl = document.getElementById('race-hud-item');
        if (posEl)  posEl.innerText  = `${p1.rank}º / ${this.karts.length}`;
        if (lapEl)  lapEl.innerText  = `${Math.min(p1.laps + 1, this.trackDef.laps)}/${this.trackDef.laps}`;
        if (itemEl) itemEl.innerText = p1.item ? `🎁 ${this._itemName(p1.item)}` : 'NENHUM';
      }
    }
  }

  // ── Rendering ──────────────────────────────────────────────────────────────
  _render() {
    if (!this.ctx) return;
    const cw = this.canvas.width  = this.canvas.clientWidth  || VIEW_W;
    const ch = this.canvas.height = this.canvas.clientHeight || VIEW_H;

    this.ctx.clearRect(0, 0, cw, ch);
    this.ctx.fillStyle = '#05051a';
    this.ctx.fillRect(0, 0, cw, ch);

    if (this.state === 'idle') return;

    // Camera transform
    const offX = -this.camera.x + cw / 2 + (Math.random()-.5) * this.screenShake;
    const offY = -this.camera.y + ch / 2 + (Math.random()-.5) * this.screenShake;

    this.ctx.save();
    this.ctx.translate(offX, offY);

    this._renderWorld();
    this._renderTrack();
    this._renderItemBoxes();
    this._renderTraps();

    // Trails
    this.karts.forEach(k => { if (!k.eliminated) this._renderTrail(k); });
    // Karts
    this.karts.forEach(k => { if (!k.eliminated) this._renderKart(k); });

    this._renderProjectiles();

    // Particles
    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    });
    this.ctx.globalAlpha = 1;

    // Shockwaves
    this.shockwaves.forEach(sw => {
      this.ctx.save();
      this.ctx.strokeStyle = sw.color;
      this.ctx.lineWidth = 3;
      this.ctx.globalAlpha = sw.alpha;
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI*2);
      this.ctx.stroke();
      this.ctx.restore();
    });

    // Float texts
    this.floatTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.font = '11px "Press Start 2P"';
      this.ctx.fillStyle = ft.color;
      this.ctx.shadowColor = ft.color;
      this.ctx.shadowBlur = 10;
      this.ctx.globalAlpha = ft.alpha;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });

    this.ctx.restore(); // end camera

    // Mini-map
    this._renderMiniMap(cw, ch);

    // Countdown overlay
    if (this.state === 'countdown' && this.countdown > 0) {
      this.ctx.fillStyle = '#ffea00';
      this.ctx.font = '52px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = '#ffea00';
      this.ctx.shadowBlur = 25;
      this.ctx.fillText(this.countdown, cw/2, ch/2 + 20);
      this.ctx.shadowBlur = 0;
    } else if (this.state === 'countdown' && this.countdown <= 0) {
      this.ctx.fillStyle = '#39ff14';
      this.ctx.font = '38px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('LARGADA!', cw/2, ch/2 + 15);
    }
  }

  _renderWorld() {
    // Background grid
    const b = this.worldBounds;
    this.ctx.strokeStyle = 'rgba(40,40,100,0.18)';
    this.ctx.lineWidth = 1.5;
    for (let x = Math.floor(b.minX/100)*100; x < b.maxX; x += 100) {
      this.ctx.beginPath(); this.ctx.moveTo(x, b.minY); this.ctx.lineTo(x, b.maxY); this.ctx.stroke();
    }
    for (let y = Math.floor(b.minY/100)*100; y < b.maxY; y += 100) {
      this.ctx.beginPath(); this.ctx.moveTo(b.minX, y); this.ctx.lineTo(b.maxX, y); this.ctx.stroke();
    }
    // World border
    this.ctx.strokeStyle = this.trackDef.theme;
    this.ctx.lineWidth = 8;
    this.ctx.shadowColor = this.trackDef.theme;
    this.ctx.shadowBlur = 18;
    this.ctx.strokeRect(b.minX+4, b.minY+4, b.maxX-b.minX-8, b.maxY-b.minY-8);
    this.ctx.shadowBlur = 0;
  }

  _renderTrack() {
    const pts = this.trackPts;
    const rw  = this.trackDef.roadWidth;
    if (!pts.length) return;

    // Draw road (thick dark path)
    this.ctx.strokeStyle = '#18182e';
    this.ctx.lineWidth = rw * 2;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap  = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) this.ctx.lineTo(pts[i].x, pts[i].y);
    this.ctx.closePath();
    this.ctx.stroke();

    // Kerb (outer road border) – alternating coloured stripes
    const step = 5;
    for (let i = 0; i < pts.length; i += step) {
      const a = pts[i];
      const b2 = pts[(i + step) % pts.length];
      const seg = Math.floor(i / step);
      this.ctx.strokeStyle = seg % 2 === 0 ? '#cc0000' : '#ffffff';
      this.ctx.lineWidth = rw * 2 + 14;
      this.ctx.beginPath();
      this.ctx.moveTo(a.x, a.y);
      this.ctx.lineTo(b2.x, b2.y);
      this.ctx.stroke();

      // Redraw road on top of kerb
      this.ctx.strokeStyle = '#18182e';
      this.ctx.lineWidth = rw * 2;
      this.ctx.beginPath();
      this.ctx.moveTo(a.x, a.y);
      this.ctx.lineTo(b2.x, b2.y);
      this.ctx.stroke();
    }

    // Neon centre dashes
    this.ctx.setLineDash([28, 28]);
    this.ctx.strokeStyle = this.trackDef.theme;
    this.ctx.lineWidth = 4;
    this.ctx.shadowColor = this.trackDef.theme;
    this.ctx.shadowBlur = 12;
    this.ctx.beginPath();
    this.ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) this.ctx.lineTo(pts[i].x, pts[i].y);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    this.ctx.shadowBlur = 0;

    // Start/Finish line at index 0
    const p0 = pts[0];
    const p1 = pts[1 % pts.length];
    const tang = Math.atan2(p1.y - p0.y, p1.x - p0.x);
    const perp = tang + Math.PI/2;
    this.ctx.save();
    this.ctx.translate(p0.x, p0.y);
    this.ctx.rotate(perp);
    const bw = 20, bh = rw * 2;
    for (let i = -Math.ceil(bh/(bw*2)); i < Math.ceil(bh/(bw*2)); i++) {
      this.ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000';
      this.ctx.fillRect(-bw/2, i*bw, bw, bw);
    }
    this.ctx.restore();

    // Pillars (arena)
    if (this.trackDef.pillars) {
      this.trackDef.pillars.forEach(pil => {
        this.ctx.beginPath();
        this.ctx.arc(pil.x, pil.y, pil.r, 0, Math.PI*2);
        this.ctx.fillStyle = '#cc0033';
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffea00';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
      });
    }
  }

  _renderItemBoxes() {
    this.itemBoxes.forEach(b => {
      if (b.respawn > 0) return;
      const rot = Date.now() * 0.003;
      this.ctx.save();
      this.ctx.translate(b.x, b.y);
      this.ctx.rotate(rot);
      this.ctx.shadowColor = '#ffea00';
      this.ctx.shadowBlur = 18;
      this.ctx.fillStyle = 'rgba(255,234,0,0.45)';
      this.ctx.fillRect(-b.r, -b.r, b.r*2, b.r*2);
      this.ctx.strokeStyle = '#ffea00';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(-b.r, -b.r, b.r*2, b.r*2);
      this.ctx.shadowBlur = 0;
      this.ctx.font = '13px "Press Start 2P"';
      this.ctx.fillStyle = '#fff';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('?', 0, 5);
      this.ctx.restore();
    });
  }

  _renderTraps() {
    this.traps.forEach(t => {
      this.ctx.save();
      this.ctx.translate(t.x, t.y);
      this.ctx.font = '18px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🐟', 0, 7);
      this.ctx.restore();
    });
  }

  _renderTrail(k) {
    if (k.trail.length < 2) return;
    for (let i = 1; i < k.trail.length; i++) {
      const alpha = i / k.trail.length * 0.35;
      this.ctx.strokeStyle = k.trail[i].drift ? `rgba(255,234,0,${alpha})` : `rgba(100,100,200,${alpha})`;
      this.ctx.lineWidth = k.trail[i].drift ? 5 : 3;
      this.ctx.beginPath();
      this.ctx.moveTo(k.trail[i-1].x, k.trail[i-1].y);
      this.ctx.lineTo(k.trail[i].x, k.trail[i].y);
      this.ctx.stroke();
    }
  }

  _renderKart(k) {
    this.ctx.save();
    this.ctx.translate(k.x, k.y);
    this.ctx.rotate(k.angle);

    // Shield ring
    if (k.shieldTimer > 0) {
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur  = 18;
      this.ctx.lineWidth   = 4;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 24, 0, Math.PI*2);
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }

    // HP bar (arena mode)
    if (this.trackDef.type === 'arena') {
      this.ctx.rotate(-k.angle);
      this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
      this.ctx.fillRect(-20, -28, 40, 5);
      const pct = k.hp / k.maxHp;
      this.ctx.fillStyle = pct > 0.5 ? '#39ff14' : pct > 0.25 ? '#ffea00' : '#ff0033';
      this.ctx.fillRect(-20, -28, 40 * pct, 5);
      this.ctx.rotate(k.angle);
    }

    // Body
    this.ctx.fillStyle = '#101025';
    this.ctx.fillRect(-16, -10, 32, 20);
    // Wheels
    this.ctx.fillStyle = '#000';
    [[-14,-12],[ 6,-12],[-14, 9],[ 6, 9]].forEach(([wx,wy]) => this.ctx.fillRect(wx, wy, 8, 4));
    // Colour body
    this.ctx.fillStyle = k.racer.color;
    this.ctx.shadowColor = k.racer.color;
    this.ctx.shadowBlur  = k.isDrifting ? 20 : 10;
    this.ctx.fillRect(-10, -8, 20, 16);
    // Icon
    this.ctx.shadowBlur = 0;
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(k.racer.icon, 0, 5);

    // Name tag (only for humans)
    if (k.isHuman) {
      this.ctx.rotate(-k.angle);
      this.ctx.font = '8px "Press Start 2P"';
      this.ctx.fillStyle = '#fff';
      this.ctx.shadowColor = k.racer.color;
      this.ctx.shadowBlur = 8;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(k.name.split(' ')[0], 0, -32);
      this.ctx.shadowBlur = 0;
    }

    this.ctx.restore();
  }

  _renderProjectiles() {
    this.projectiles.forEach(p => {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.font = '16px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(p.type === 'missile' ? '🚀' : '💣', 0, 6);
      this.ctx.restore();
    });
  }

  _renderMiniMap(cw, ch) {
    const mw = 150, mh = 110;
    const mx = cw - mw - 12, my = ch - mh - 12;
    const b  = this.worldBounds;
    const wx = b.maxX - b.minX, wy = b.maxY - b.minY;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(8,8,30,0.88)';
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(mx, my, mw, mh);
    this.ctx.strokeRect(mx, my, mw, mh);

    // Track on minimap
    const pts = this.trackPts;
    if (pts.length > 1) {
      this.ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      this.ctx.lineWidth = Math.max(1, this.trackDef.roadWidth * 2 * mw / wx);
      this.ctx.beginPath();
      pts.forEach((p, i) => {
        const px = mx + (p.x - b.minX) / wx * mw;
        const py = my + (p.y - b.minY) / wy * mh;
        i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
      });
      this.ctx.closePath();
      this.ctx.stroke();
    }

    // Kart dots
    this.karts.forEach(k => {
      if (k.eliminated) return;
      const px = mx + (k.x - b.minX) / wx * mw;
      const py = my + (k.y - b.minY) / wy * mh;
      this.ctx.fillStyle = k.id === 'p1' ? '#ffea00' : k.racer.color;
      this.ctx.beginPath();
      this.ctx.arc(px, py, k.id === 'p1' ? 4 : 3, 0, Math.PI*2);
      this.ctx.fill();
    });

    this.ctx.restore();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  _hitParticles(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI*2;
      const s = Math.random() * 5 + 1;
      this.particles.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, life: 1.0, color, size: Math.random()*5+2 });
    }
  }

  _shockwave(x, y, color, maxR) {
    this.shockwaves.push({ x, y, color, r: 4, maxR, alpha: 1.0 });
  }

  _floatText(x, y, text, color) {
    this.floatTexts.push({ x, y, text, color, alpha: 1.0 });
  }

  _sparkParticle(k) {
    const c = k.driftCharge > 80 ? '#ffea00' : k.driftCharge > 40 ? '#00f0ff' : '#fff';
    this.particles.push({
      x: k.x - Math.cos(k.angle)*15, y: k.y - Math.sin(k.angle)*15,
      vx: -Math.cos(k.angle)*2.5 + (Math.random()-.5)*2,
      vy: -Math.sin(k.angle)*2.5 + (Math.random()-.5)*2,
      life: 0.5, color: c, size: Math.random()*4+2
    });
  }

  _spawnConfetti() {
    for (let i = 0; i < 55; i++) {
      const a = Math.random() * Math.PI*2, s = Math.random()*5+2;
      this.particles.push({
        x: this.camera.x + (Math.random()-.5)*400,
        y: this.camera.y - 200,
        vx: Math.cos(a)*s, vy: Math.abs(Math.sin(a)*s) + 2,
        life: 2.5,
        color: ['#00f0ff','#ff007f','#ffea00','#39ff14'][Math.floor(Math.random()*4)],
        size: 7
      });
    }
  }

  _showGameOver(rank) {
    const modal = document.getElementById('race-game-over-screen');
    const title = document.getElementById('race-winner-msg');
    if (title) {
      if (this.trackDef.type === 'arena') {
        title.innerText = rank === 1 ? '👑 SOBREVIVENTE DA ARENA! VITÓRIA!' : `☠️ VOCÊ FOI ELIMINADO (${rank}º LUGAR)`;
      } else {
        title.innerText = rank === 1 ? '🏆 1º LUGAR! CAMPEÃO!' : `🏁 ${rank}º LUGAR!`;
      }
    }
    if (modal) modal.classList.add('active');
  }
}

// Instantiate once
window.catsEyeRacing = new CatsEyeRacing();
