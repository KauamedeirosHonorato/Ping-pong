// =============================================================================
// CORRIDA DO OLHO DE GATO (CAT'S EYE RACING 2D) - Retro Drift Arcade Engine
// =============================================================================

const RACE_CANVAS_WIDTH = 800;
const RACE_CANVAS_HEIGHT = 600;

const RACING_TRACKS = [
  {
    id: 'neon_circuit',
    name: 'CIRCUITO NEON CYBER',
    desc: 'Pista clássica noturna iluminada com neon cyan e magenta. Ótima para drifts!',
    themeColor: '#00f0ff',
    laps: 3,
    waypoints: [
      { x: 120, y: 480 },
      { x: 680, y: 480 },
      { x: 700, y: 380 },
      { x: 680, y: 150 },
      { x: 500, y: 120 },
      { x: 420, y: 260 },
      { x: 340, y: 140 },
      { x: 140, y: 140 },
      { x: 100, y: 300 }
    ],
    trackWidth: 100,
    checkpoints: [
      { x: 120, y: 480, w: 120, h: 20, isFinish: true },
      { x: 680, y: 480, w: 20, h: 120 },
      { x: 680, y: 150, w: 120, h: 20 },
      { x: 420, y: 260, w: 20, h: 120 },
      { x: 140, y: 140, w: 120, h: 20 }
    ],
    itemBoxes: [
      { x: 400, y: 480, r: 16, respawn: 0 },
      { x: 680, y: 280, r: 16, respawn: 0 },
      { x: 240, y: 140, r: 16, respawn: 0 },
      { x: 100, y: 390, r: 16, respawn: 0 }
    ]
  },
  {
    id: 'volcano_sunset',
    name: 'VULCÃO RETRO SUNSET',
    desc: 'Curvas fechadas perigosas, poças de óleo e bordas em chamas!',
    themeColor: '#ff5500',
    laps: 3,
    waypoints: [
      { x: 150, y: 500 },
      { x: 400, y: 520 },
      { x: 650, y: 420 },
      { x: 680, y: 220 },
      { x: 520, y: 150 },
      { x: 300, y: 280 },
      { x: 180, y: 180 },
      { x: 100, y: 340 }
    ],
    trackWidth: 95,
    checkpoints: [
      { x: 150, y: 500, w: 120, h: 20, isFinish: true },
      { x: 650, y: 420, w: 120, h: 20 },
      { x: 520, y: 150, w: 20, h: 120 },
      { x: 180, y: 180, w: 120, h: 20 }
    ],
    itemBoxes: [
      { x: 300, y: 510, r: 16, respawn: 0 },
      { x: 680, y: 300, r: 16, respawn: 0 },
      { x: 400, y: 220, r: 16, respawn: 0 },
      { x: 140, y: 260, r: 16, respawn: 0 }
    ]
  },
  {
    id: 'cosmic_speedway',
    name: 'AUTÓDROMO CÓSMICO HIPERESPAÇO',
    desc: 'Pista no vácuo estelar com pads de turbo e velocidade ultra elevada!',
    themeColor: '#b026ff',
    laps: 3,
    waypoints: [
      { x: 150, y: 450 },
      { x: 400, y: 460 },
      { x: 670, y: 450 },
      { x: 670, y: 150 },
      { x: 400, y: 140 },
      { x: 150, y: 150 }
    ],
    trackWidth: 110,
    checkpoints: [
      { x: 150, y: 450, w: 120, h: 20, isFinish: true },
      { x: 670, y: 450, w: 20, h: 120 },
      { x: 400, y: 140, w: 120, h: 20 },
      { x: 150, y: 150, w: 20, h: 120 }
    ],
    itemBoxes: [
      { x: 300, y: 455, r: 16, respawn: 0 },
      { x: 500, y: 455, r: 16, respawn: 0 },
      { x: 670, y: 300, r: 16, respawn: 0 },
      { x: 500, y: 145, r: 16, respawn: 0 },
      { x: 300, y: 145, r: 16, respawn: 0 }
    ]
  }
];

const CAT_RACERS = [
  { id: 'cat_neon', name: 'Gato Neon (Olho de Gato)', icon: '🐱', color: '#00f0ff', speed: 5.4, accel: 0.18, handling: 0.065, driftPower: 1.2 },
  { id: 'tiger_nitro', name: 'Tigre Turbo', icon: '🐯', color: '#ffea00', speed: 5.8, accel: 0.15, handling: 0.055, driftPower: 1.4 },
  { id: 'panther_cyber', name: 'Pantera Cyber', icon: '🐆', color: '#ff007f', speed: 5.2, accel: 0.22, handling: 0.075, driftPower: 1.1 },
  { id: 'cat_tank', name: 'Gato Blindado', icon: '🐈', color: '#39ff14', speed: 5.0, accel: 0.16, handling: 0.060, weight: 1.5, driftPower: 1.3 }
];

class CatsEyeRacing {
  constructor() {
    this.canvas = document.getElementById('raceCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.state = 'menu'; // 'menu', 'countdown', 'racing', 'finished'
    this.gameMode = '1p'; // '1p', '2p_local', 'gp'
    this.currentTrackIndex = 0;
    this.track = RACING_TRACKS[0];

    this.karts = [];
    this.projectiles = [];
    this.traps = []; // Cascas de peixe / óleo
    this.particles = [];
    this.shockwaves = [];
    this.floatTexts = [];

    this.countdown = 3;
    this.countdownTimer = 0;
    this.raceStartTime = 0;
    this.screenShake = 0;

    this.keys = {};
    this.initControls();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
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

  startRace(mode = '1p', trackIndex = 0, selectedRacerIndex = 0) {
    this.gameMode = mode;
    this.currentTrackIndex = trackIndex % RACING_TRACKS.length;
    this.track = RACING_TRACKS[this.currentTrackIndex];
    this.state = 'countdown';
    this.countdown = 3;
    this.countdownTimer = Date.now();

    this.projectiles = [];
    this.traps = [];
    this.particles = [];
    this.shockwaves = [];
    this.floatTexts = [];
    this.screenShake = 0;

    // Reset item boxes
    this.track.itemBoxes.forEach(b => { b.respawn = 0; });

    const startWp = this.track.waypoints[0];
    const nextWp = this.track.waypoints[1];
    const startAngle = Math.atan2(nextWp.y - startWp.y, nextWp.x - startWp.x);

    this.karts = [];

    // Kart 1 (Player 1)
    this.karts.push(this.createKart({
      id: 'p1',
      name: 'VOCÊ (GATO NEON)',
      isHuman: true,
      playerNum: 1,
      racer: CAT_RACERS[selectedRacerIndex % CAT_RACERS.length],
      x: startWp.x - 20,
      y: startWp.y - 15,
      angle: startAngle
    }));

    if (mode === '2p_local') {
      // Kart 2 (Player 2)
      this.karts.push(this.createKart({
        id: 'p2',
        name: 'PLAYER 2',
        isHuman: true,
        playerNum: 2,
        racer: CAT_RACERS[(selectedRacerIndex + 1) % CAT_RACERS.length],
        x: startWp.x - 50,
        y: startWp.y + 15,
        angle: startAngle
      }));
      // 2 Bots
      this.karts.push(this.createKart({
        id: 'bot1',
        name: 'TIGRE NITRO (IA)',
        isHuman: false,
        racer: CAT_RACERS[1],
        x: startWp.x - 80,
        y: startWp.y - 15,
        angle: startAngle
      }));
      this.karts.push(this.createKart({
        id: 'bot2',
        name: 'PANTERA (IA)',
        isHuman: false,
        racer: CAT_RACERS[2],
        x: startWp.x - 110,
        y: startWp.y + 15,
        angle: startAngle
      }));
    } else {
      // 3 Bots
      for (let i = 1; i <= 3; i++) {
        const racer = CAT_RACERS[i % CAT_RACERS.length];
        this.karts.push(this.createKart({
          id: `bot${i}`,
          name: `${racer.name.split(' ')[0]} (IA)`,
          isHuman: false,
          racer,
          x: startWp.x - (i * 35),
          y: startWp.y + (i % 2 === 0 ? 16 : -16),
          angle: startAngle
        }));
      }
    }

    const menu = document.getElementById('racing-menu');
    const screen = document.getElementById('racing-screen');
    if (menu) menu.classList.remove('active');
    if (screen) screen.classList.add('active');

    window.retroAudio.playCountdown(false);
  }

  createKart(config) {
    return {
      id: config.id,
      name: config.name,
      isHuman: config.isHuman,
      playerNum: config.playerNum || 0,
      racer: config.racer,
      x: config.x,
      y: config.y,
      vx: 0,
      vy: 0,
      angle: config.angle,
      speed: 0,
      maxSpeed: config.racer.speed,
      accel: config.racer.accel,
      handling: config.racer.handling,
      driftPower: config.racer.driftPower || 1.2,
      isDrifting: false,
      driftDir: 0,
      driftCharge: 0,
      nitroTimer: 0,
      spinTimer: 0,
      shieldTimer: 0,
      currentLap: 1,
      nextCheckpoint: 0,
      currentWaypoint: 1,
      finished: false,
      finishTime: 0,
      rank: 1,
      item: null, // 'missile', 'trap', 'nitro', 'shield', 'bomb'
      trail: []
    };
  }

  loop() {
    try {
      this.update();
      this.render();
    } catch (err) {
      console.warn('Racing loop error:', err);
    }
    requestAnimationFrame(this.loop);
  }

  update() {
    if (this.screenShake > 0) this.screenShake -= 0.5;

    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.025;
      if (ft.alpha <= 0) this.floatTexts.splice(i, 1);
    }

    if (this.state === 'countdown') {
      const now = Date.now();
      if (now - this.countdownTimer >= 800) {
        this.countdown--;
        this.countdownTimer = now;
        if (this.countdown > 0) {
          window.retroAudio.playCountdown(false);
        } else if (this.countdown === 0) {
          window.retroAudio.playCountdown(true);
        } else {
          this.state = 'racing';
          this.raceStartTime = Date.now();
        }
      }
      return;
    }

    if (this.state !== 'racing' && this.state !== 'finished') return;

    // Atualiza Item Boxes
    this.track.itemBoxes.forEach(b => {
      if (b.respawn > 0) b.respawn--;
    });

    // Atualiza Karts
    this.karts.forEach(kart => {
      this.updateKart(kart);
    });

    // Colisão entre Karts (Bater no amigo / física de impacto)
    for (let i = 0; i < this.karts.length; i++) {
      for (let j = i + 1; j < this.karts.length; j++) {
        this.handleKartCollision(this.karts[i], this.karts[j]);
      }
    }

    // Atualiza Projéteis (Mísseis / Bombas)
    this.updateProjectiles();

    // Atualiza Armadilhas (Casca de peixe / óleo)
    this.updateTraps();

    // Atualiza Partículas
    this.updateParticles();

    // Atualiza Shockwaves
    this.updateShockwaves();

    // Atualiza Posições / Ranking da Corrida
    this.updateRankings();
  }

  updateKart(kart) {
    if (kart.spinTimer > 0) {
      kart.spinTimer--;
      kart.angle += 0.25;
      kart.speed *= 0.94;
      kart.x += Math.cos(kart.angle) * kart.speed;
      kart.y += Math.sin(kart.angle) * kart.speed;
      return;
    }

    if (kart.nitroTimer > 0) {
      kart.nitroTimer--;
      kart.speed = kart.maxSpeed * 1.55;
      if (Math.random() < 0.4) {
        this.particles.push({
          x: kart.x - Math.cos(kart.angle) * 14,
          y: kart.y - Math.sin(kart.angle) * 14,
          vx: -Math.cos(kart.angle) * 3 + (Math.random() - 0.5),
          vy: -Math.sin(kart.angle) * 3 + (Math.random() - 0.5),
          life: 0.4,
          color: Math.random() > 0.5 ? '#ffea00' : '#ff007f',
          size: Math.random() * 5 + 3
        });
      }
    }

    if (kart.shieldTimer > 0) kart.shieldTimer--;

    let accelerating = false;
    let braking = false;
    let turnLeft = false;
    let turnRight = false;
    let driftKey = false;
    let useItemKey = false;

    if (kart.isHuman) {
      if (kart.playerNum === 1) {
        accelerating = this.keys['KeyW'] || this.keys['w'] || this.keys['ArrowUp'];
        braking = this.keys['KeyS'] || this.keys['s'] || this.keys['ArrowDown'];
        turnLeft = this.keys['KeyA'] || this.keys['a'] || this.keys['ArrowLeft'];
        turnRight = this.keys['KeyD'] || this.keys['d'] || this.keys['ArrowRight'];
        driftKey = this.keys['ShiftLeft'] || this.keys['Space'] || this.keys['KeyE'];
        useItemKey = this.keys['KeyQ'] || this.keys['KeyF'] || this.keys['Enter'];
      } else if (kart.playerNum === 2) {
        accelerating = this.keys['KeyI'] || this.keys['i'] || this.keys['Numpad8'];
        braking = this.keys['KeyK'] || this.keys['k'] || this.keys['Numpad2'];
        turnLeft = this.keys['KeyJ'] || this.keys['j'] || this.keys['Numpad4'];
        turnRight = this.keys['KeyL'] || this.keys['l'] || this.keys['Numpad6'];
        driftKey = this.keys['Numpad0'] || this.keys['KeyU'];
        useItemKey = this.keys['NumpadEnter'] || this.keys['KeyO'];
      }
    } else {
      // IA Competitiva e Inteligente
      const aiCmd = this.getAICommand(kart);
      accelerating = aiCmd.accelerating;
      braking = aiCmd.braking;
      turnLeft = aiCmd.turnLeft;
      turnRight = aiCmd.turnRight;
      driftKey = aiCmd.driftKey;
      useItemKey = aiCmd.useItemKey;
    }

    // Disparar Poder / Item
    if (useItemKey && kart.item) {
      this.useKartItem(kart);
    }

    // Aceleração e Freio
    if (accelerating) {
      kart.speed = Math.min(kart.nitroTimer > 0 ? kart.maxSpeed * 1.55 : kart.maxSpeed, kart.speed + kart.accel);
    } else if (braking) {
      kart.speed = Math.max(-kart.maxSpeed * 0.4, kart.speed - kart.accel * 1.5);
    } else {
      kart.speed *= 0.98; // Desaceleração suave por atrito
    }

    // Direção & Drift
    if (driftKey && Math.abs(kart.speed) > 2.0 && (turnLeft || turnRight)) {
      if (!kart.isDrifting) {
        kart.isDrifting = true;
        kart.driftDir = turnLeft ? -1 : 1;
        kart.driftCharge = 0;
      }
      kart.driftCharge += 1.5;
      kart.angle += kart.driftDir * kart.handling * 1.35;

      // Faíscas de Drift
      if (Math.random() < 0.6) {
        const sparkColor = kart.driftCharge > 80 ? '#ffea00' : (kart.driftCharge > 40 ? '#00f0ff' : '#ffffff');
        this.particles.push({
          x: kart.x - Math.cos(kart.angle) * 12,
          y: kart.y - Math.sin(kart.angle) * 12,
          vx: -Math.cos(kart.angle) * 2 + (Math.random() - 0.5) * 2,
          vy: -Math.sin(kart.angle) * 2 + (Math.random() - 0.5) * 2,
          life: 0.3,
          color: sparkColor,
          size: Math.random() * 4 + 2
        });
      }
    } else {
      // Soltou o drift: Mini-Turbo!
      if (kart.isDrifting) {
        if (kart.driftCharge > 80) {
          kart.nitroTimer = 45;
          window.retroAudio.playPaddleHit(true);
          this.addFloatText(kart.x, kart.y - 20, '⚡ MEGA TURBO!', '#ffea00');
          this.addShockwave(kart.x, kart.y, '#ffea00', 35);
        } else if (kart.driftCharge > 40) {
          kart.nitroTimer = 25;
          window.retroAudio.playPaddleHit(false);
          this.addFloatText(kart.x, kart.y - 20, '⚡ MINI TURBO!', '#00f0ff');
          this.addShockwave(kart.x, kart.y, '#00f0ff', 25);
        }
        kart.isDrifting = false;
        kart.driftCharge = 0;
      }

      if (turnLeft) kart.angle -= kart.handling * (kart.speed / kart.maxSpeed);
      if (turnRight) kart.angle += kart.handling * (kart.speed / kart.maxSpeed);
    }

    // Movimentação
    kart.x += Math.cos(kart.angle) * kart.speed;
    kart.y += Math.sin(kart.angle) * kart.speed;

    // Rastro
    kart.trail.push({ x: kart.x, y: kart.y, angle: kart.angle, isDrifting: kart.isDrifting });
    if (kart.trail.length > 10) kart.trail.shift();

    // Paredes e Bordas do Circuito
    kart.x = Math.max(25, Math.min(RACE_CANVAS_WIDTH - 25, kart.x));
    kart.y = Math.max(25, Math.min(RACE_CANVAS_HEIGHT - 25, kart.y));

    // Coleta de Caixas de Itens
    this.track.itemBoxes.forEach(box => {
      if (box.respawn <= 0 && !kart.item) {
        const dist = Math.hypot(kart.x - box.x, kart.y - box.y);
        if (dist < box.r + 14) {
          box.respawn = 180; // 3 segundos
          const items = ['missile', 'trap', 'nitro', 'shield', 'bomb'];
          kart.item = items[Math.floor(Math.random() * items.length)];
          window.retroAudio.playPortal();
          this.createHitParticles(box.x, box.y, '#ffea00', 16);
          this.addShockwave(box.x, box.y, '#00f0ff', 30);
          this.addFloatText(kart.x, kart.y - 20, `🎁 ${this.getItemName(kart.item)}!`, '#ffea00');
        }
      }
    });

    // Checkpoints e Voltas
    const curCp = this.track.checkpoints[kart.nextCheckpoint];
    if (curCp) {
      if (
        kart.x >= curCp.x - curCp.w / 2 &&
        kart.x <= curCp.x + curCp.w / 2 &&
        kart.y >= curCp.y - curCp.h / 2 &&
        kart.y <= curCp.y + curCp.h / 2
      ) {
        kart.nextCheckpoint = (kart.nextCheckpoint + 1) % this.track.checkpoints.length;
        if (curCp.isFinish) {
          kart.currentLap++;
          if (kart.isHuman) {
            window.retroAudio.playScore(true);
            this.addFloatText(kart.x, kart.y - 25, `VOLTA ${kart.currentLap}/${this.track.laps}!`, '#00f0ff');
          }
          if (kart.currentLap > this.track.laps && !kart.finished) {
            kart.finished = true;
            kart.finishTime = Date.now() - this.raceStartTime;
            if (kart.isHuman) {
              this.state = 'finished';
              window.retroAudio.playScore(true);
              this.spawnConfetti();
              this.showGameOver(kart.rank);
            }
          }
        }
      }
    }
  }

  getItemName(item) {
    switch (item) {
      case 'missile': return 'MÍSSIL';
      case 'trap': return 'PEIXE-ÓLEO';
      case 'nitro': return 'SUPER NITRO';
      case 'shield': return 'ESCUDO';
      case 'bomb': return 'BOMBA EMP';
      default: return 'ITEM';
    }
  }

  useKartItem(kart) {
    const item = kart.item;
    kart.item = null;

    if (item === 'nitro') {
      kart.nitroTimer = 80;
      window.retroAudio.playPaddleHit(true);
      this.addFloatText(kart.x, kart.y - 20, '⚡ NITRO MÁXIMO!', '#ffea00');
      this.addShockwave(kart.x, kart.y, '#ffea00', 45);
    } else if (item === 'shield') {
      kart.shieldTimer = 300; // 5 segundos
      window.retroAudio.playPortal();
      this.addFloatText(kart.x, kart.y - 20, '🛡️ ESCUDO ATIVO!', '#00f0ff');
    } else if (item === 'trap') {
      this.traps.push({
        x: kart.x - Math.cos(kart.angle) * 24,
        y: kart.y - Math.sin(kart.angle) * 24,
        r: 12,
        life: 600
      });
      window.retroAudio.playWallBounce();
      this.addFloatText(kart.x, kart.y - 20, '🐟 ARMADILHA!', '#ffaa00');
    } else if (item === 'missile') {
      this.projectiles.push({
        type: 'missile',
        owner: kart.id,
        x: kart.x + Math.cos(kart.angle) * 20,
        y: kart.y + Math.sin(kart.angle) * 20,
        angle: kart.angle,
        speed: 9.5,
        target: this.findAheadKart(kart),
        life: 180
      });
      window.retroAudio.playBlasterHit();
      this.addFloatText(kart.x, kart.y - 20, '🚀 MÍSSIL LANÇADO!', '#ff0055');
    } else if (item === 'bomb') {
      this.projectiles.push({
        type: 'bomb',
        owner: kart.id,
        x: kart.x + Math.cos(kart.angle) * 25,
        y: kart.y + Math.sin(kart.angle) * 25,
        angle: kart.angle,
        speed: 6.5,
        timer: 60
      });
      window.retroAudio.playPaddleHit(false);
      this.addFloatText(kart.x, kart.y - 20, '💣 BOMBA EMP!', '#ff00ff');
    }
  }

  findAheadKart(sourceKart) {
    let target = null;
    let minDist = Infinity;
    this.karts.forEach(k => {
      if (k.id !== sourceKart.id) {
        const dx = k.x - sourceKart.x;
        const dy = k.y - sourceKart.y;
        const forwardDot = Math.cos(sourceKart.angle) * dx + Math.sin(sourceKart.angle) * dy;
        if (forwardDot > 0) {
          const dist = Math.hypot(dx, dy);
          if (dist < minDist) {
            minDist = dist;
            target = k;
          }
        }
      }
    });
    return target;
  }

  handleKartCollision(k1, k2) {
    const dx = k2.x - k1.x;
    const dy = k2.y - k1.y;
    const dist = Math.hypot(dx, dy);
    const minDist = 24;

    if (dist < minDist) {
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);

      k1.x -= nx * (minDist - dist) * 0.5;
      k1.y -= ny * (minDist - dist) * 0.5;
      k2.x += nx * (minDist - dist) * 0.5;
      k2.y += ny * (minDist - dist) * 0.5;

      const tempSpeed = k1.speed;
      k1.speed = k2.speed * 0.85;
      k2.speed = tempSpeed * 0.85;

      this.screenShake = 3;
      window.retroAudio.playPaddleHit(false);
      this.createHitParticles((k1.x + k2.x) / 2, (k1.y + k2.y) / 2, '#ffea00', 8);
    }
  }

  updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life--;

      if (p.type === 'missile') {
        if (p.target && p.target.x) {
          const targetAngle = Math.atan2(p.target.y - p.y, p.target.x - p.x);
          let diff = targetAngle - p.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          p.angle += diff * 0.08;
        }
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        // Fumaça
        if (Math.random() < 0.5) {
          this.particles.push({
            x: p.x, y: p.y,
            vx: (Math.random() - 0.5), vy: (Math.random() - 0.5),
            life: 0.3, color: '#ff5500', size: 3
          });
        }

        // Colisão com Karts
        this.karts.forEach(k => {
          if (k.id !== p.owner && Math.hypot(k.x - p.x, k.y - p.y) < 22) {
            if (k.shieldTimer <= 0) {
              k.spinTimer = 45;
              this.screenShake = 7;
              window.retroAudio.playBlasterHit();
              this.createHitParticles(k.x, k.y, '#ff0055', 25);
              this.addShockwave(k.x, k.y, '#ff0055', 45);
              this.addFloatText(k.x, k.y - 20, '💥 ACERTOU!', '#ff0055');
            }
            p.life = 0;
          }
        });
      }

      if (p.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  updateTraps() {
    for (let i = this.traps.length - 1; i >= 0; i--) {
      const t = this.traps[i];
      t.life--;

      this.karts.forEach(k => {
        if (Math.hypot(k.x - t.x, k.y - t.y) < t.r + 12) {
          if (k.shieldTimer <= 0) {
            k.spinTimer = 40;
            window.retroAudio.playWallBounce();
            this.createHitParticles(t.x, t.y, '#ffaa00', 16);
            this.addFloatText(k.x, k.y - 20, '🌀 ESCORREGOU!', '#ffaa00');
          }
          t.life = 0;
        }
      });

      if (t.life <= 0) this.traps.splice(i, 1);
    }
  }

  getAICommand(kart) {
    const targetWp = this.track.waypoints[kart.currentWaypoint % this.track.waypoints.length];
    const distToWp = Math.hypot(targetWp.x - kart.x, targetWp.y - kart.y);

    if (distToWp < 55) {
      kart.currentWaypoint = (kart.currentWaypoint + 1) % this.track.waypoints.length;
    }

    const targetAngle = Math.atan2(targetWp.y - kart.y, targetWp.x - kart.x);
    let diff = targetAngle - kart.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    const turnLeft = diff < -0.15;
    const turnRight = diff > 0.15;
    const isSharpTurn = Math.abs(diff) > 0.85;
    const driftKey = isSharpTurn && Math.random() < 0.6;
    const useItemKey = kart.item && Math.random() < 0.05;

    return {
      accelerating: !isSharpTurn || kart.speed < 3.5,
      braking: isSharpTurn && kart.speed > 4.5,
      turnLeft,
      turnRight,
      driftKey,
      useItemKey
    };
  }

  updateRankings() {
    this.karts.sort((a, b) => {
      if (a.currentLap !== b.currentLap) return b.currentLap - a.currentLap;
      if (a.nextCheckpoint !== b.nextCheckpoint) return b.nextCheckpoint - a.nextCheckpoint;
      const cp = this.track.checkpoints[a.nextCheckpoint] || { x: 0, y: 0 };
      return Math.hypot(a.x - cp.x, a.y - cp.y) - Math.hypot(b.x - cp.x, b.y - cp.y);
    });

    this.karts.forEach((k, idx) => {
      k.rank = idx + 1;
    });

    const p1 = this.karts.find(k => k.id === 'p1');
    if (p1) {
      const posEl = document.getElementById('race-hud-pos');
      const lapEl = document.getElementById('race-hud-lap');
      const itemEl = document.getElementById('race-hud-item');
      if (posEl) posEl.innerText = `${p1.rank}º / ${this.karts.length}`;
      if (lapEl) lapEl.innerText = `${Math.min(this.track.laps, p1.currentLap)}/${this.track.laps}`;
      if (itemEl) itemEl.innerText = p1.item ? `🎁 ${this.getItemName(p1.item)}` : 'NENHUM';
    }
  }

  render() {
    this.ctx.save();

    if (this.screenShake > 0) {
      this.ctx.translate((Math.random() - 0.5) * this.screenShake, (Math.random() - 0.5) * this.screenShake);
    }

    // Fundo do Autódromo
    this.renderTrackBackground();

    // Pista e Zebras
    this.renderTrackWay();

    // Checkpoints / Linha de Chegada
    this.renderCheckpoints();

    // Caixas de Itens
    this.renderItemBoxes();

    // Armadilhas na Pista
    this.renderTraps();

    // Karts e Rastros
    this.karts.forEach(k => this.renderKart(k));

    // Projéteis
    this.renderProjectiles();

    // Efeitos Visuais
    this.renderParticles();
    this.renderShockwaves();
    this.renderFloatTexts();

    // Countdown Overlay
    if (this.state === 'countdown') {
      this.ctx.fillStyle = '#ffea00';
      this.ctx.font = '54px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = '#ffea00';
      this.ctx.shadowBlur = 20;
      const txt = this.countdown > 0 ? this.countdown.toString() : 'LARGADA!';
      this.ctx.fillText(txt, RACE_CANVAS_WIDTH / 2, RACE_CANVAS_HEIGHT / 2 + 18);
    }

    this.ctx.restore();
  }

  renderTrackBackground() {
    this.ctx.fillStyle = '#060620';
    this.ctx.fillRect(0, 0, RACE_CANVAS_WIDTH, RACE_CANVAS_HEIGHT);

    // Grid Cyber
    this.ctx.strokeStyle = 'rgba(60, 60, 140, 0.15)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < RACE_CANVAS_WIDTH; x += 35) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, RACE_CANVAS_HEIGHT);
      this.ctx.stroke();
    }
    for (let y = 0; y < RACE_CANVAS_HEIGHT; y += 35) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(RACE_CANVAS_WIDTH, y);
      this.ctx.stroke();
    }
  }

  renderTrackWay() {
    const wps = this.track.waypoints;
    const tw = this.track.trackWidth;

    // Asfalto
    this.ctx.strokeStyle = '#15153a';
    this.ctx.lineWidth = tw;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(wps[0].x, wps[0].y);
    for (let i = 1; i < wps.length; i++) {
      this.ctx.lineTo(wps[i].x, wps[i].y);
    }
    this.ctx.closePath();
    this.ctx.stroke();

    // Zebras Neon
    this.ctx.strokeStyle = this.track.themeColor;
    this.ctx.lineWidth = 4;
    this.ctx.shadowColor = this.track.themeColor;
    this.ctx.shadowBlur = 12;
    this.ctx.setLineDash([16, 16]);
    this.ctx.beginPath();
    this.ctx.moveTo(wps[0].x, wps[0].y);
    for (let i = 1; i < wps.length; i++) {
      this.ctx.lineTo(wps[i].x, wps[i].y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    this.ctx.shadowBlur = 0;
  }

  renderCheckpoints() {
    const finish = this.track.checkpoints[0];
    if (finish) {
      this.ctx.save();
      this.ctx.translate(finish.x, finish.y);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(-finish.w / 2, -finish.h / 2, finish.w, finish.h);
      this.ctx.fillStyle = '#000000';
      for (let x = -finish.w / 2; x < finish.w / 2; x += 12) {
        this.ctx.fillRect(x, -finish.h / 2, 6, finish.h);
      }
      this.ctx.restore();
    }
  }

  renderItemBoxes() {
    this.track.itemBoxes.forEach(b => {
      if (b.respawn <= 0) {
        this.ctx.save();
        this.ctx.translate(b.x, b.y);
        const rot = Date.now() * 0.004;
        this.ctx.rotate(rot);

        this.ctx.shadowColor = '#ffea00';
        this.ctx.shadowBlur = 18;
        this.ctx.fillStyle = 'rgba(255, 234, 0, 0.45)';
        this.ctx.fillRect(-b.r, -b.r, b.r * 2, b.r * 2);
        this.ctx.strokeStyle = '#ffea00';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(-b.r, -b.r, b.r * 2, b.r * 2);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('?', 0, 5);

        this.ctx.restore();
      }
    });
  }

  renderTraps() {
    this.traps.forEach(t => {
      this.ctx.save();
      this.ctx.translate(t.x, t.y);
      this.ctx.font = '16px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🐟', 0, 6);
      this.ctx.restore();
    });
  }

  renderKart(k) {
    this.ctx.save();
    this.ctx.translate(k.x, k.y);
    this.ctx.rotate(k.angle);

    // Escudo Ativo
    if (k.shieldTimer > 0) {
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 18;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Chassi do Kart
    this.ctx.fillStyle = '#111122';
    this.ctx.fillRect(-12, -8, 24, 16);

    // Rodas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(-11, -11, 7, 3);
    this.ctx.fillRect(4, -11, 7, 3);
    this.ctx.fillRect(-11, 8, 7, 3);
    this.ctx.fillRect(4, 8, 7, 3);

    // Corpo Colorido
    this.ctx.fillStyle = k.racer.color;
    this.ctx.shadowColor = k.racer.color;
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(-8, -6, 16, 12);

    // Piloto (Gato)
    this.ctx.font = '12px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(k.racer.icon, 0, 4);

    this.ctx.restore();
  }

  renderProjectiles() {
    this.projectiles.forEach(p => {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.font = '14px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(p.type === 'missile' ? '🚀' : '💣', 0, 5);
      this.ctx.restore();
    });
  }

  createHitParticles(x, y, color = '#ffffff', count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color,
        size: Math.random() * 4 + 2
      });
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  addShockwave(x, y, color, maxRadius) {
    this.shockwaves.push({ x, y, color, r: 4, maxR: maxRadius, alpha: 1.0 });
  }

  updateShockwaves() {
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += (sw.maxR - sw.r) * 0.2 + 1;
      sw.alpha -= 0.05;
      if (sw.alpha <= 0 || sw.r >= sw.maxR) this.shockwaves.splice(i, 1);
    }
  }

  addFloatText(x, y, text, color = '#ffea00') {
    this.floatTexts.push({ x, y, text, color, alpha: 1.0, vy: -1.2 });
  }

  renderFloatTexts() {
    this.floatTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.font = '11px "Press Start 2P"';
      this.ctx.fillStyle = ft.color;
      this.ctx.shadowColor = ft.color;
      this.ctx.shadowBlur = 10;
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });
  }

  renderParticles() {
    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    this.ctx.globalAlpha = 1.0;
  }

  renderShockwaves() {
    this.shockwaves.forEach(sw => {
      this.ctx.save();
      this.ctx.strokeStyle = sw.color;
      this.ctx.lineWidth = 3;
      this.ctx.globalAlpha = sw.alpha;
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  spawnConfetti() {
    // Confetes de vitória
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * RACE_CANVAS_WIDTH,
        y: 0,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        life: 2.0,
        color: ['#00f0ff', '#ff007f', '#ffea00', '#39ff14'][Math.floor(Math.random() * 4)],
        size: 5
      });
    }
  }

  showGameOver(rank) {
    const modal = document.getElementById('race-game-over-screen');
    const title = document.getElementById('race-winner-msg');
    if (title) title.innerText = rank === 1 ? '🏆 1º LUGAR! CAMPEÃO!' : `🏁 VOCÊ TERMINOU EM ${rank}º LUGAR!`;
    if (modal) modal.classList.add('active');
  }

  returnToMenu() {
    this.state = 'menu';
    const menu = document.getElementById('racing-menu');
    const screen = document.getElementById('racing-screen');
    const over = document.getElementById('race-game-over-screen');
    if (screen) screen.classList.remove('active');
    if (over) over.classList.remove('active');
    if (menu) menu.classList.add('active');
  }
}

window.catsEyeRacing = new CatsEyeRacing();
