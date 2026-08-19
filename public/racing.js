// =============================================================================
// CORRIDA DO OLHO DE GATO (SUPER CAT KART 2D/3D - INSPIRADO EM MARIO KART)
// Motor Gráfico Híbrido: Perspectiva Pseudo-3D Mode 7 + Sprite Scaling + Drift Físico
// =============================================================================
'use strict';

const RACER_PROFILES = [
  { id: 0, name: 'Gato Neon',    icon: '🐱', color: '#00f0ff', topSpeed: 14.5, accel: 0.18, handling: 0.045, driftPower: 1.45, weight: 1.0, maxHp: 100 },
  { id: 1, name: 'Tigre Nitro',  icon: '🐯', color: '#ffea00', topSpeed: 16.2, accel: 0.14, handling: 0.038, driftPower: 1.70, weight: 1.3, maxHp: 95  },
  { id: 2, name: 'Pantera Cyber',icon: '🐆', color: '#ff007f', topSpeed: 13.8, accel: 0.22, handling: 0.052, driftPower: 1.35, weight: 0.9, maxHp: 110 },
  { id: 3, name: 'Gato Blindado',icon: '🐈', color: '#39ff14', topSpeed: 13.2, accel: 0.16, handling: 0.040, driftPower: 1.50, weight: 1.6, maxHp: 150 }
];

const TRACK_CONFIGS = [
  {
    id: 'neon_metropolis',
    name: 'METRÓPOLE NEON 3D',
    type: 'circuit',
    themeColor: '#00f0ff',
    skyGradient: ['#030318', '#080838', '#141460'],
    groundColor1: '#0a0a24',
    groundColor2: '#060618',
    roadColor1: '#181830',
    roadColor2: '#121226',
    rumbleColor1: '#ff007f',
    rumbleColor2: '#ffffff',
    laneColor: '#00f0ff',
    roadWidth: 2000,
    segmentLength: 200,
    segmentsCount: 650,
    laps: 3,
    scenery: 'city'
  },
  {
    id: 'volcano_sunset',
    name: 'VULCÃO SUNSET 3D',
    type: 'circuit',
    themeColor: '#ff5500',
    skyGradient: ['#1a0400', '#551100', '#aa3300'],
    groundColor1: '#260a04',
    groundColor2: '#180502',
    roadColor1: '#221111',
    roadColor2: '#1a0b0b',
    rumbleColor1: '#ffaa00',
    rumbleColor2: '#ff3300',
    laneColor: '#ffea00',
    roadWidth: 2200,
    segmentLength: 200,
    segmentsCount: 750,
    laps: 3,
    scenery: 'volcano'
  },
  {
    id: 'battle_colosseum',
    name: 'ARENA COLISEU 3D',
    type: 'arena',
    themeColor: '#ff007f',
    skyGradient: ['#100018', '#380045', '#750080'],
    groundColor1: '#1a0026',
    groundColor2: '#100018',
    roadColor1: '#260830',
    roadColor2: '#1e0526',
    rumbleColor1: '#39ff14',
    rumbleColor2: '#ff007f',
    laneColor: '#ffea00',
    roadWidth: 3200,
    segmentLength: 200,
    segmentsCount: 500,
    laps: 1,
    scenery: 'colosseum'
  }
];

class SuperCatKartEngine {
  constructor() {
    this.canvas = document.getElementById('raceCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.state = 'idle'; // idle | countdown | racing | finished
    this.gameMode = '1p'; // 1p | 2p_local | arena | online
    this.trackIndex = 0;
    this.trackConfig = TRACK_CONFIGS[0];

    // Câmera 3D
    this.cameraHeight = 1000;
    this.cameraDepth = 0.84; // FOV
    this.drawDistance = 180; // Quantos segmentos desenhar à frente

    this.segments = [];
    this.karts = [];
    this.projectiles = [];
    this.traps = [];
    this.particles = [];
    this.shockwaves = [];
    this.floatTexts = [];
    this.sprites = {};

    this.countdown = 3;
    this.countdownTimer = 0;
    this.screenShake = 0;
    this.keys = {};

    this.initControls();
    this.initNetwork();
    this.generatePrebakedSprites();

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  // Geração procedural de sprites e texturas de karts e itens
  generatePrebakedSprites() {
    this.sprites.itemBox = this.createItemBoxCanvas();
    this.sprites.banana = this.createTrapCanvas();
    this.sprites.missile = this.createMissileCanvas();
    this.sprites.bomb = this.createBombCanvas();
  }

  createItemBoxCanvas() {
    const c = document.createElement('canvas');
    c.width = 48; c.height = 48;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(255, 234, 0, 0.85)';
    ctx.shadowColor = '#ffea00';
    ctx.shadowBlur = 12;
    ctx.fillRect(4, 4, 40, 40);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 40, 40);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px "Press Start 2P", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 24, 25);
    return c;
  }

  createTrapCanvas() {
    const c = document.createElement('canvas');
    c.width = 36; c.height = 36;
    const ctx = c.getContext('2d');
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍌', 18, 18);
    return c;
  }

  createMissileCanvas() {
    const c = document.createElement('canvas');
    c.width = 36; c.height = 36;
    const ctx = c.getContext('2d');
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚀', 18, 18);
    return c;
  }

  createBombCanvas() {
    const c = document.createElement('canvas');
    c.width = 36; c.height = 36;
    const ctx = c.getContext('2d');
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💣', 18, 18);
    return c;
  }

  initControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      this.keys[e.key] = true;
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.keys[e.key] = false;
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  initNetwork() {
    const net = window.networkManager;
    if (!net) return;
    net.onRaceSync = (state) => {
      if (this.gameMode !== 'online') return;
      (state.karts || []).forEach(rk => {
        const lk = this.karts.find(k => k.id === rk.id && !k.isHuman);
        if (!lk) return;
        lk.trackPos += (rk.trackPos - lk.trackPos) * 0.35;
        lk.lateralX += (rk.lateralX - lk.lateralX) * 0.35;
        lk.speed     = rk.speed;
        lk.hp        = rk.hp;
        lk.item      = rk.item;
      });
    };
    net.onRaceDamage = (d) => {
      const k = this.karts.find(k => k.id === d.targetId);
      if (k) this.applyDamage(k, d.damage, d.attackerId);
    };
  }

  buildTrack(config) {
    this.segments = [];
    const total = config.segmentsCount;
    const isArena = config.type === 'arena';

    for (let i = 0; i < total; i++) {
      let curve = 0;
      let hill = 0;

      if (isArena) {
        // Arena: Circuito oval contínuo
        curve = Math.sin(i / 30) * 1.5;
        hill = 0;
      } else if (config.id === 'volcano_sunset') {
        // Vulcão: Curvas sinuosas e subidas/descidas dramáticas
        if (i > 50 && i < 150) curve = 2.4;
        if (i > 180 && i < 260) { curve = -3.0; hill = Math.sin((i - 180) / 80 * Math.PI) * 1200; }
        if (i > 300 && i < 420) { curve = 1.8; hill = -Math.sin((i - 300) / 120 * Math.PI) * 800; }
        if (i > 480 && i < 580) curve = -2.6;
        if (i > 620 && i < 700) curve = 3.2;
      } else {
        // Metrópole Neon: Retas velozes, chicanes e curvas de 90 graus
        if (i > 40 && i < 110) curve = 2.0;
        if (i > 140 && i < 190) curve = -2.8;
        if (i > 220 && i < 310) { curve = 1.5; hill = Math.sin((i - 220) / 90 * Math.PI) * 700; }
        if (i > 350 && i < 410) curve = -2.2;
        if (i > 460 && i < 540) curve = 3.0;
        if (i > 570 && i < 620) curve = -1.5;
      }

      const p1WorldZ = i * config.segmentLength;
      const p2WorldZ = (i + 1) * config.segmentLength;

      const segment = {
        index: i,
        p1: { world: { x: 0, y: hill, z: p1WorldZ }, camera: {}, screen: {} },
        p2: { world: { x: 0, y: 0, z: p2WorldZ }, camera: {}, screen: {} },
        curve,
        color: {
          road: (Math.floor(i / 3) % 2 === 0) ? config.roadColor1 : config.roadColor2,
          rumble: (Math.floor(i / 3) % 2 === 0) ? config.rumbleColor1 : config.rumbleColor2,
          ground: (Math.floor(i / 6) % 2 === 0) ? config.groundColor1 : config.groundColor2,
          lane: (Math.floor(i / 3) % 2 === 0) ? config.laneColor : 'transparent'
        },
        sprites: [],
        items: []
      };

      // Item boxes distribuídos pela pista
      if (i % 60 === 0 && i > 30) {
        segment.items.push({ type: 'itemBox', x: -0.4, collected: false, respawnTimer: 0 });
        segment.items.push({ type: 'itemBox', x: 0.4, collected: false, respawnTimer: 0 });
      }

      this.segments.push(segment);
    }
    this.trackLength = this.segments.length * config.segmentLength;
  }

  startRace(mode = '1p', trackIdx = 0, racerIdx = 0) {
    if (!this.canvas) {
      this.canvas = document.getElementById('raceCanvas');
      if (this.canvas) this.ctx = this.canvas.getContext('2d');
    }

    this.gameMode = mode;
    this.trackIndex = trackIdx % TRACK_CONFIGS.length;
    this.trackConfig = TRACK_CONFIGS[this.trackIndex];

    this.buildTrack(this.trackConfig);

    this.karts = [];
    this.projectiles = [];
    this.traps = [];
    this.particles = [];
    this.shockwaves = [];
    this.floatTexts = [];
    this.screenShake = 0;

    // Criar Karts
    const totalRacers = mode === '2p_local' ? 6 : 8;
    for (let i = 0; i < totalRacers; i++) {
      const isP1 = i === 0;
      const isP2 = mode === '2p_local' && i === 1;
      const rId = isP1 ? racerIdx : (isP2 ? (racerIdx + 1) % RACER_PROFILES.length : (i % RACER_PROFILES.length));
      const profile = RACER_PROFILES[rId];

      const lateralX = (i % 2 === 0 ? -0.45 : 0.45);
      const gridZ = (Math.floor(i / 2) * -380);

      this.karts.push({
        id: isP1 ? 'p1' : (isP2 ? 'p2' : `bot_${i}`),
        name: isP1 ? `${profile.name} (VOCÊ)` : (isP2 ? `${profile.name} (P2)` : `${profile.name} (IA)`),
        isHuman: isP1 || isP2,
        playerNum: isP1 ? 1 : (isP2 ? 2 : 0),
        profile,
        // Posição no mundo 3D
        trackPos: gridZ < 0 ? this.trackLength + gridZ : gridZ,
        lateralX,
        speed: 0,
        steerAngle: 0,
        // Física e drift
        isDrifting: false,
        driftDir: 0,
        driftCharge: 0,
        boostTimer: 0,
        spinTimer: 0,
        shieldTimer: 0,
        hp: profile.maxHp,
        maxHp: profile.maxHp,
        item: null,
        lap: 1,
        finished: false,
        eliminated: false,
        rank: 1
      });
    }

    const menu   = document.getElementById('main-menu');
    const screen = document.getElementById('racing-screen');
    const over   = document.getElementById('race-game-over-screen');
    if (menu)   menu.classList.remove('active');
    if (over)   over.classList.remove('active');
    if (screen) screen.classList.add('active');

    this.countdown = 3;
    this.countdownTimer = Date.now();
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

  loop() {
    try {
      this.update();
      this.render();
    } catch (e) {
      console.warn('Racing 3D safe catch:', e);
    }
    requestAnimationFrame(this.loop);
  }

  update() {
    // Contagem Regressiva
    if (this.state === 'countdown') {
      const elapsed = Date.now() - this.countdownTimer;
      const count = 3 - Math.floor(elapsed / 900);
      if (count !== this.countdown) {
        this.countdown = count;
        if (this.countdown > 0 && window.retroAudio) window.retroAudio.playCountdown(false);
        else if (this.countdown <= 0) {
          if (window.retroAudio) window.retroAudio.playCountdown(true);
          this.state = 'racing';
        }
      }
      return;
    }
    if (this.state !== 'racing' && this.state !== 'finished') return;

    if (this.screenShake > 0) this.screenShake = Math.max(0, this.screenShake - 0.5);

    // Atualiza Karts
    this.karts.forEach(k => {
      if (!k.eliminated) this.updateKart(k);
    });

    // Atualiza Projéteis e Armadilhas
    this.updateProjectiles();
    this.updateTraps();

    // Atualiza Partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y -= 1.4; ft.alpha -= 0.025;
      if (ft.alpha <= 0) this.floatTexts.splice(i, 1);
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += 2.5; sw.alpha -= 0.04;
      if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
    }

    this.updateRankings();
  }

  updateKart(k) {
    if (k.spinTimer > 0) k.spinTimer--;
    if (k.boostTimer > 0) k.boostTimer--;
    if (k.shieldTimer > 0) k.shieldTimer--;

    // Controles
    let accel = false, brake = false, left = false, right = false, drift = false, useItem = false;

    if (k.isHuman) {
      if (k.playerNum === 1) {
        accel   = !!(this.keys['KeyW'] || this.keys['ArrowUp'] || this.keys['w']);
        brake   = !!(this.keys['KeyS'] || this.keys['ArrowDown'] || this.keys['s']);
        left    = !!(this.keys['KeyA'] || this.keys['ArrowLeft'] || this.keys['a']);
        right   = !!(this.keys['KeyD'] || this.keys['ArrowRight'] || this.keys['d']);
        useItem = !!(this.keys['Space'] || this.keys['Enter'] || this.keys['KeyE'] || this.keys['e']);
        drift   = !!(this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.keys['ControlLeft'] || this.keys['KeyQ'] || this.keys['q']);
      } else {
        accel   = !!(this.keys['KeyI'] || this.keys['i'] || this.keys['Numpad8']);
        brake   = !!(this.keys['KeyK'] || this.keys['k'] || this.keys['Numpad5'] || this.keys['Numpad2']);
        left    = !!(this.keys['KeyJ'] || this.keys['j'] || this.keys['Numpad4']);
        right   = !!(this.keys['KeyL'] || this.keys['l'] || this.keys['Numpad6']);
        useItem = !!(this.keys['NumpadEnter'] || this.keys['KeyO'] || this.keys['o']);
        drift   = !!(this.keys['Numpad0'] || this.keys['KeyU'] || this.keys['u'] || this.keys['KeyP'] || this.keys['p']);
      }
    } else {
      const ai = this.getAIControls(k);
      accel = ai.accel; brake = ai.brake; left = ai.left; right = ai.right; drift = ai.drift; useItem = ai.useItem;
    }

    if (useItem && k.item) this.useItem(k);

    // Aceleração & Freio
    const maxSpd = (k.boostTimer > 0 ? k.profile.topSpeed * 1.55 : k.profile.topSpeed);
    if (accel) k.speed = Math.min(maxSpd, k.speed + k.profile.accel);
    else if (brake) k.speed = Math.max(-maxSpd * 0.4, k.speed - 0.4);
    else k.speed *= 0.985; // Atrito natural

    // Drift & Curva (Direção Lateral)
    const turnSpd = k.profile.handling * (k.isDrifting ? 1.35 : 1.0);
    if (drift && (left || right) && k.speed > 4.0) {
      if (!k.isDrifting) {
        k.isDrifting = true;
        k.driftDir = left ? -1 : 1;
        k.driftCharge = 0;
      }
      k.driftCharge += 2.2;
      k.lateralX += k.driftDir * turnSpd * 1.4;
      if (Math.random() < 0.4) this.createSparks(k);
    } else {
      if (k.isDrifting) {
        // Boost de mini-turbo na saída do drift
        if (k.driftCharge > 80) {
          k.boostTimer = 75;
          if (window.retroAudio) window.retroAudio.playPaddleHit(true);
          this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 40, '⚡ MEGA TURBO!', '#ffea00');
        } else if (k.driftCharge > 40) {
          k.boostTimer = 40;
          if (window.retroAudio) window.retroAudio.playPaddleHit(false);
          this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 40, '⚡ MINI TURBO!', '#00f0ff');
        }
        k.isDrifting = false;
        k.driftCharge = 0;
      }
      if (left)  k.lateralX -= turnSpd;
      if (right) k.lateralX += turnSpd;
    }

    // Penalidade se sair da pista (grama/lava)
    if (Math.abs(k.lateralX) > 1.05) {
      k.speed *= 0.92; // Redução de velocidade fora da pista
    }

    // Avanço na Pista (3D Track Position)
    k.trackPos += k.speed * 20;
    if (k.trackPos >= this.trackLength) {
      k.trackPos -= this.trackLength;
      k.lap++;
      if (k.isHuman) {
        if (window.retroAudio) window.retroAudio.playScore(true);
        this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 60, `🏁 VOLTA ${k.lap}/${this.trackConfig.laps}!`, '#00f0ff');
      }
      if (k.lap > this.trackConfig.laps && !k.finished) {
        k.finished = true;
        if (k.isHuman) {
          this.state = 'finished';
          this.showGameOver(k.rank);
        }
      }
    }

    // Coleta de Itens
    const segIdx = Math.floor(k.trackPos / this.trackConfig.segmentLength) % this.segments.length;
    const seg = this.segments[segIdx];
    if (seg && seg.items) {
      seg.items.forEach(item => {
        if (!item.collected && Math.abs(k.lateralX - item.x) < 0.35 && !k.item) {
          item.collected = true;
          item.respawnTimer = 250;
          const list = ['missile', 'banana', 'nitro', 'shield', 'bomb'];
          k.item = list[Math.floor(Math.random() * list.length)];
          if (window.retroAudio) window.retroAudio.playPortal();
          this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 30, `🎁 ${k.item.toUpperCase()}!`, '#ffea00');
        }
      });
    }
  }

  getAIControls(k) {
    const segIdx = Math.floor(k.trackPos / this.trackConfig.segmentLength) % this.segments.length;
    const seg = this.segments[segIdx];
    const curve = seg ? seg.curve : 0;

    // IA Olha 5 segmentos à frente para antecipar curvas
    const futureSegIdx = (segIdx + 5) % this.segments.length;
    const futureSeg = this.segments[futureSegIdx];
    const futureCurve = futureSeg ? futureSeg.curve : 0;

    // Evitar armadilhas e cascas de banana à frente
    let dodgeX = 0;
    for (let t of this.traps) {
      let relZ = t.trackPos - k.trackPos;
      if (relZ < 0) relZ += this.trackLength;
      if (relZ > 0 && relZ < 600 && Math.abs(t.lateralX - k.lateralX) < 0.4) {
        dodgeX = t.lateralX > 0 ? -0.45 : 0.45;
        break;
      }
    }

    // Alinhar para pegar caixas de itens se estiverem por perto
    let seekItemX = 0;
    if (!k.item && seg && seg.items) {
      for (let it of seg.items) {
        if (!it.collected) {
          seekItemX = it.x;
          break;
        }
      }
    }

    const idealX = dodgeX !== 0 ? dodgeX : (seekItemX !== 0 ? seekItemX : 0);
    const left = (futureCurve < -0.3) || (k.lateralX > idealX + 0.15);
    const right = (futureCurve > 0.3) || (k.lateralX < idealX - 0.15);

    // Rubber banding sutil: IA acelera ligeiramente se estiver muito atrás
    const player = this.karts.find(p => p.id === 'p1');
    let targetSpeed = k.profile.topSpeed;
    if (player && !k.isHuman) {
      const distToPlayer = k.trackPos - player.trackPos;
      if (distToPlayer < -2000) targetSpeed *= 1.15; // Catch-up
      else if (distToPlayer > 2500) targetSpeed *= 0.92; // Don't run away too far
    }

    const accel = k.speed < targetSpeed;
    const brake = Math.abs(futureCurve) > 2.5 && k.speed > 12.0;
    const drift = Math.abs(curve) > 1.5 && k.speed > 7.5;
    const useItem = !!k.item && (Math.random() < 0.08 || (player && Math.abs(k.trackPos - player.trackPos) < 800));

    return { accel, brake, left, right, drift, useItem };
  }

  useItem(k) {
    const item = k.item;
    k.item = null;

    if (item === 'nitro') {
      k.boostTimer = 120;
      if (window.retroAudio) window.retroAudio.playPaddleHit(true);
      this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 40, '⚡ NITRO MÁXIMO!', '#ffea00');
    } else if (item === 'shield') {
      k.shieldTimer = 350;
      if (window.retroAudio) window.retroAudio.playPortal();
      this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 40, '🛡️ ESCUDO KART!', '#00f0ff');
    } else if (item === 'banana') {
      this.traps.push({ trackPos: (k.trackPos - 200 + this.trackLength) % this.trackLength, lateralX: k.lateralX, life: 800 });
      if (window.retroAudio) window.retroAudio.playWallBounce();
      this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 40, '🍌 CASCA DE BANANA!', '#ffea00');
    } else if (item === 'missile') {
      this.projectiles.push({ type: 'missile', trackPos: k.trackPos + 200, lateralX: k.lateralX, speed: 28, owner: k.id, life: 180 });
      if (window.retroAudio) window.retroAudio.playBlaster();
      this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 40, '🚀 MÍSSIL TELEGUIDADO!', '#ff0055');
    } else if (item === 'bomb') {
      this.projectiles.push({ type: 'bomb', trackPos: k.trackPos + 400, lateralX: k.lateralX, speed: 18, owner: k.id, life: 75 });
      if (window.retroAudio) window.retroAudio.playPaddleHit(false);
      this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 40, '💣 BOMBA EXPLOSIVA!', '#ff00ff');
    }
  }

  updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.trackPos += p.speed * 20;
      p.life--;

      this.karts.forEach(k => {
        if (k.id === p.owner || k.eliminated || k.shieldTimer > 0) return;
        let relZ = Math.abs(k.trackPos - p.trackPos);
        if (relZ > this.trackLength / 2) relZ = this.trackLength - relZ;
        if (relZ < 250 && Math.abs(k.lateralX - p.lateralX) < 0.45) {
          this.applyDamage(k, 35, p.owner);
          p.life = 0;
          this.screenShake = 10;
        }
      });

      if (p.life <= 0) this.projectiles.splice(i, 1);
    }
  }

  updateTraps() {
    for (let i = this.traps.length - 1; i >= 0; i--) {
      const t = this.traps[i];
      t.life--;

      this.karts.forEach(k => {
        if (k.eliminated || k.shieldTimer > 0) return;
        let relZ = Math.abs(k.trackPos - t.trackPos);
        if (relZ > this.trackLength / 2) relZ = this.trackLength - relZ;
        if (relZ < 180 && Math.abs(k.lateralX - t.lateralX) < 0.35) {
          k.spinTimer = 45;
          k.speed *= 0.3;
          if (window.retroAudio) window.retroAudio.playWallBounce();
          this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 35, '🌀 ESCORREGOU!', '#ffea00');
          t.life = 0;
        }
      });

      if (t.life <= 0) this.traps.splice(i, 1);
    }
  }

  applyDamage(k, dmg, attackerId) {
    if (k.shieldTimer > 0 || k.eliminated) return;
    k.hp = Math.max(0, k.hp - dmg);
    k.spinTimer = 35;
    this.screenShake = 8;
    if (k.hp <= 0 && this.trackConfig.type === 'arena') {
      k.eliminated = true;
      this.addFloatText(VIEW_W / 2, VIEW_H / 2 - 40, `☠️ ${k.name} K.O.!`, '#ff0033');
    }
  }

  updateRankings() {
    const sorted = [...this.karts].sort((a, b) => {
      if (a.finished !== b.finished) return a.finished ? -1 : 1;
      if (a.lap !== b.lap) return b.lap - a.lap;
      return b.trackPos - a.trackPos;
    });

    sorted.forEach((k, idx) => { k.rank = idx + 1; });

    const p1 = this.karts.find(k => k.id === 'p1');
    if (p1) {
      const posEl = document.getElementById('race-hud-pos');
      const lapEl = document.getElementById('race-hud-lap');
      const itemEl = document.getElementById('race-hud-item');
      if (posEl) posEl.innerText = `${p1.rank}º / ${this.karts.length}`;
      if (lapEl) lapEl.innerText = `${Math.min(p1.lap, this.trackConfig.laps)}/${this.trackConfig.laps}`;
      if (itemEl) itemEl.innerText = p1.item ? `🎁 ${p1.item.toUpperCase()}` : 'NENHUM';
    }
  }

  // ---------------------------------------------------------------------------
  // MOTOR DE RENDERIZAÇÃO PSEUDO-3D MODE 7 (PROJEÇÃO DE PISTA & SPRITES)
  // ---------------------------------------------------------------------------
  render() {
    if (!this.ctx) return;
    const cw = this.canvas.width = this.canvas.clientWidth || VIEW_W;
    const ch = this.canvas.height = this.canvas.clientHeight || VIEW_H;

    this.ctx.clearRect(0, 0, cw, ch);

    const player = this.karts.find(k => k.id === 'p1') || this.karts[0];
    if (!player) return;

    const baseSegment = this.findSegment(player.trackPos);
    const basePercent = (player.trackPos % this.trackConfig.segmentLength) / this.trackConfig.segmentLength;

    // 1. Renderiza Céu Dinâmico e Horizonte
    this.renderSky(cw, ch);

    // 2. Projeção 3D dos Segmentos de Pista (De trás para frente)
    let maxY = ch;
    let x = 0;
    let dx = -(baseSegment.curve * basePercent);

    for (let n = 0; n < this.drawDistance; n++) {
      const segment = this.segments[(baseSegment.index + n) % this.segments.length];
      const loop = (baseSegment.index + n >= this.segments.length);

      this.project(
        segment.p1,
        (player.lateralX * this.trackConfig.roadWidth) - x,
        this.cameraHeight,
        player.trackPos - (loop ? this.trackLength : 0),
        this.cameraDepth,
        cw,
        ch,
        this.trackConfig.roadWidth
      );

      this.project(
        segment.p2,
        (player.lateralX * this.trackConfig.roadWidth) - x - dx,
        this.cameraHeight,
        player.trackPos - (loop ? this.trackLength : 0),
        this.cameraDepth,
        cw,
        ch,
        this.trackConfig.roadWidth
      );

      x += dx;
      dx += segment.curve;

      if (segment.p1.camera.z <= this.cameraDepth || segment.p2.screen.y >= maxY) continue;

      this.renderSegment(
        cw,
        segment.p1.screen.x, segment.p1.screen.y, segment.p1.screen.w,
        segment.p2.screen.x, segment.p2.screen.y, segment.p2.screen.w,
        segment.color
      );

      maxY = segment.p1.screen.y;
    }

    // 3. Renderiza Sprites 3D (Itens, Armadilhas e Outros Karts Ordenados por Profundidade)
    this.render3DSprites(cw, ch, player, baseSegment);

    // 4. Renderiza o Kart do Jogador (Primeiro Plano com Efeito 3D de Inclinação)
    this.renderPlayerKart(cw, ch, player);

    // 5. Partículas & Efeitos na Tela
    this.renderScreenFX(cw, ch);

    // 6. Mini-Mapa Radar
    this.renderRadar(cw, ch);
  }

  renderSky(cw, ch) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, ch * 0.55);
    const colors = this.trackConfig.skyGradient;
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.5, colors[1]);
    grad.addColorStop(1, colors[2]);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, cw, ch * 0.55);
  }

  project(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth / (p.camera.z || 1);
    p.screen.x = Math.round((width / 2) + (p.screen.scale * p.camera.x * width / 2));
    p.screen.y = Math.round((height / 2) - (p.screen.scale * p.camera.y * height / 2));
    p.screen.w = Math.round((p.screen.scale * roadWidth * width / 2));
  }

  renderSegment(cw, x1, y1, w1, x2, y2, w2, color) {
    const r1 = w1 / 5;
    const r2 = w2 / 5;
    const l1 = w1 / 20;
    const l2 = w2 / 20;

    // Grama / Terreno Exterior
    this.ctx.fillStyle = color.ground;
    this.ctx.fillRect(0, y2, cw, y1 - y2);

    // Guia / Zebrinha (Rumble Strip)
    this.drawPolygon(x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble);
    this.drawPolygon(x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.rumble);

    // Asfalto da Estrada
    this.drawPolygon(x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

    // Faixa Central Neon
    if (color.lane !== 'transparent') {
      this.drawPolygon(x1 - l1, y1, x1 + l1, y1, x2 + l2, y2, x2 - l2, y2, color.lane);
    }
  }

  drawPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.lineTo(x4, y4);
    this.ctx.closePath();
    this.ctx.fill();
  }

  render3DSprites(cw, ch, player, baseSegment) {
    const renderList = [];

    // Coleta outros karts visíveis
    this.karts.forEach(k => {
      if (k.id === player.id || k.eliminated) return;
      let relZ = k.trackPos - player.trackPos;
      if (relZ < -this.trackLength / 2) relZ += this.trackLength;
      if (relZ > this.trackLength / 2) relZ -= this.trackLength;

      if (relZ > 0 && relZ < this.drawDistance * this.trackConfig.segmentLength) {
        renderList.push({ type: 'kart', obj: k, relZ, lateralX: k.lateralX });
      }
    });

    // Coleta caixas de itens 3D visíveis
    for (let n = 0; n < this.drawDistance; n++) {
      const seg = this.segments[(baseSegment.index + n) % this.segments.length];
      if (seg && seg.items) {
        seg.items.forEach(it => {
          if (!it.collected) {
            let relZ = (n * this.trackConfig.segmentLength);
            if (relZ > 0 && relZ < this.drawDistance * this.trackConfig.segmentLength) {
              renderList.push({ type: 'itemBox', obj: it, relZ, lateralX: it.x });
            }
          }
        });
      }
    }

    // Coleta cascas de banana (traps)
    this.traps.forEach(t => {
      let relZ = t.trackPos - player.trackPos;
      if (relZ < -this.trackLength / 2) relZ += this.trackLength;
      if (relZ > this.trackLength / 2) relZ -= this.trackLength;
      if (relZ > 0 && relZ < this.drawDistance * this.trackConfig.segmentLength) {
        renderList.push({ type: 'trap', obj: t, relZ, lateralX: t.lateralX });
      }
    });

    // Coleta projéteis (mísseis e bombas)
    this.projectiles.forEach(p => {
      let relZ = p.trackPos - player.trackPos;
      if (relZ < -this.trackLength / 2) relZ += this.trackLength;
      if (relZ > this.trackLength / 2) relZ -= this.trackLength;
      if (relZ > 0 && relZ < this.drawDistance * this.trackConfig.segmentLength) {
        renderList.push({ type: p.type, obj: p, relZ, lateralX: p.lateralX });
      }
    });

    // Ordena de trás para frente (Painter's Algorithm)
    renderList.sort((a, b) => b.relZ - a.relZ);

    renderList.forEach(item => {
      const scale = this.cameraDepth / item.relZ;
      const screenX = (cw / 2) + (scale * (item.lateralX - player.lateralX) * this.trackConfig.roadWidth * cw / 2);
      const screenY = (ch / 2) + (scale * this.cameraHeight * ch / 2);
      const size = Math.min(140, Math.max(12, scale * 3200));

      if (item.type === 'kart') {
        this.drawKartSprite(screenX, screenY, size, item.obj);
      } else if (item.type === 'itemBox') {
        if (this.sprites.itemBox) {
          const isz = Math.min(48, Math.max(12, size * 0.5));
          this.ctx.drawImage(this.sprites.itemBox, screenX - isz / 2, screenY - isz, isz, isz);
        }
      } else if (item.type === 'trap') {
        if (this.sprites.banana) {
          const bsz = Math.min(36, Math.max(10, size * 0.4));
          this.ctx.drawImage(this.sprites.banana, screenX - bsz / 2, screenY - bsz / 2, bsz, bsz);
        }
      } else if (item.type === 'missile') {
        if (this.sprites.missile) {
          const msz = Math.min(38, Math.max(12, size * 0.45));
          this.ctx.drawImage(this.sprites.missile, screenX - msz / 2, screenY - msz, msz, msz);
        }
      } else if (item.type === 'bomb') {
        if (this.sprites.bomb) {
          const bmsz = Math.min(42, Math.max(14, size * 0.5));
          this.ctx.drawImage(this.sprites.bomb, screenX - bmsz / 2, screenY - bmsz, bmsz, bmsz);
        }
      }
    });
  }

  drawKartSprite(x, y, size, kart) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Sombra do Kart
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, size * 0.35, size * 0.45, size * 0.15, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Corpo do Kart
    this.ctx.fillStyle = kart.profile.color;
    this.ctx.shadowColor = kart.profile.color;
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(-size * 0.35, -size * 0.2, size * 0.7, size * 0.4);

    // Rodas
    this.ctx.fillStyle = '#05050a';
    this.ctx.fillRect(-size * 0.42, -size * 0.15, size * 0.14, size * 0.3);
    this.ctx.fillRect(size * 0.28, -size * 0.15, size * 0.14, size * 0.3);

    // Ícone do Personagem
    this.ctx.shadowBlur = 0;
    this.ctx.font = `${Math.max(10, Math.floor(size * 0.38))}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(kart.profile.icon, 0, -size * 0.05);

    // Nome
    this.ctx.font = `${Math.max(6, Math.floor(size * 0.16))}px "Press Start 2P"`;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(kart.name.split(' ')[0], 0, -size * 0.45);

    this.ctx.restore();
  }

  renderPlayerKart(cw, ch, player) {
    const kartX = cw / 2;
    const kartY = ch - 65;
    const size = 95;

    this.ctx.save();
    this.ctx.translate(kartX, kartY);

    // Inclinação 3D ao fazer curva
    const tilt = (this.keys['KeyA'] || this.keys['ArrowLeft'] ? -0.15 : (this.keys['KeyD'] || this.keys['ArrowRight'] ? 0.15 : 0));
    this.ctx.rotate(tilt);

    // Escudo Protetor 3D
    if (player.shieldTimer > 0) {
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 20;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(0, -10, size * 0.55, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Sombra do Kart do Jogador
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 25, size * 0.48, size * 0.18, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Rodas Traseiras Esportivas
    this.ctx.fillStyle = '#05050a';
    this.ctx.fillRect(-size * 0.48, 5, 20, 28);
    this.ctx.fillRect(size * 0.48 - 20, 5, 20, 28);

    // Chassi Neon do Kart
    this.ctx.fillStyle = '#121226';
    this.ctx.fillRect(-size * 0.35, -5, size * 0.7, 34);

    this.ctx.fillStyle = player.profile.color;
    this.ctx.shadowColor = player.profile.color;
    this.ctx.shadowBlur = player.isDrifting ? 25 : 12;
    this.ctx.fillRect(-size * 0.28, -2, size * 0.56, 26);

    // Volante & Piloto
    this.ctx.shadowBlur = 0;
    this.ctx.font = '36px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(player.profile.icon, 0, -12);

    this.ctx.restore();
  }

  renderScreenFX(cw, ch) {
    // Textos Flutuantes
    this.floatTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.font = '13px "Press Start 2P"';
      this.ctx.fillStyle = ft.color;
      this.ctx.shadowColor = ft.color;
      this.ctx.shadowBlur = 12;
      this.ctx.globalAlpha = ft.alpha;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });

    // Contagem Regressiva na Tela
    if (this.state === 'countdown') {
      this.ctx.save();
      this.ctx.font = '54px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = this.countdown > 0 ? '#ffea00' : '#39ff14';
      this.ctx.shadowColor = this.ctx.fillStyle;
      this.ctx.shadowBlur = 30;
      this.ctx.fillText(this.countdown > 0 ? this.countdown : 'LARGADA!', cw / 2, ch / 2 - 20);
      this.ctx.restore();
    }
  }

  renderRadar(cw, ch) {
    const rw = 120, rh = 80;
    const rx = cw - rw - 12, ry = ch - rh - 12;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(6, 6, 26, 0.85)';
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(rx, ry, rw, rh);
    this.ctx.strokeRect(rx, ry, rw, rh);

    this.karts.forEach(k => {
      if (k.eliminated) return;
      const progress = (k.trackPos % this.trackLength) / this.trackLength;
      const kx = rx + 10 + progress * (rw - 20);
      const ky = ry + (rh / 2) + (k.lateralX * 18);

      this.ctx.fillStyle = k.id === 'p1' ? '#ffea00' : k.profile.color;
      this.ctx.beginPath();
      this.ctx.arc(kx, ky, k.id === 'p1' ? 4 : 3, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.restore();
  }

  findSegment(z) {
    return this.segments[Math.floor(z / this.trackConfig.segmentLength) % this.segments.length];
  }

  createSparks(k) {
    this.particles.push({
      x: VIEW_W / 2 + (k.driftDir * 35),
      y: VIEW_H - 45,
      vx: (Math.random() - 0.5) * 4 + (k.driftDir * 2),
      vy: -Math.random() * 4 - 1,
      life: 0.5,
      color: k.driftCharge > 80 ? '#ffea00' : '#00f0ff'
    });
  }

  addFloatText(x, y, text, color = '#ffea00') {
    this.floatTexts.push({ x, y, text, color, alpha: 1.0 });
  }

  showGameOver(rank) {
    const modal = document.getElementById('race-game-over-screen');
    const title = document.getElementById('race-winner-msg');
    if (title) {
      title.innerText = rank === 1 ? '👑 1º LUGAR! CAMPEÃO DO GRAND PRIX!' : `🏁 ${rank}º LUGAR!`;
    }
    if (modal) modal.classList.add('active');
  }
}

// Instanciação Global Única
window.catsEyeRacing = new SuperCatKartEngine();
