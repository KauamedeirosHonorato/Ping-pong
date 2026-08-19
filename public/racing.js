// =============================================================================
// CORRIDA DO OLHO DE GATO (CAT'S EYE RACING 2D) - Massive World & Arena Engine
// =============================================================================

const RACE_VIEW_WIDTH = 800;
const RACE_VIEW_HEIGHT = 600;

// Pistas Gigantes & Arenas de Batalha
const RACING_TRACKS = [
  {
    id: 'neon_metropolis',
    name: 'METRÓPOLE NEON GIGANTE',
    type: 'circuit',
    desc: 'Circuito urbano gigante em alta velocidade com retas longas, túneis e curvas de drift!',
    themeColor: '#00f0ff',
    worldWidth: 2600,
    worldHeight: 2000,
    laps: 3,
    trackWidth: 150,
    waypoints: [
      { x: 300, y: 1700 },
      { x: 1200, y: 1700 },
      { x: 2200, y: 1700 },
      { x: 2350, y: 1300 },
      { x: 2200, y: 600 },
      { x: 1800, y: 350 },
      { x: 1400, y: 800 },
      { x: 1000, y: 350 },
      { x: 500, y: 350 },
      { x: 250, y: 800 },
      { x: 300, y: 1300 }
    ],
    checkpoints: [
      { x: 300, y: 1700, w: 200, h: 30, isFinish: true },
      { x: 1200, y: 1700, w: 30, h: 200 },
      { x: 2200, y: 1700, w: 30, h: 200 },
      { x: 2200, y: 600, w: 30, h: 200 },
      { x: 1400, y: 800, w: 200, h: 30 },
      { x: 500, y: 350, w: 30, h: 200 },
      { x: 300, y: 1300, w: 200, h: 30 }
    ],
    itemBoxes: [
      { x: 800, y: 1700, r: 20, respawn: 0 },
      { x: 1700, y: 1700, r: 20, respawn: 0 },
      { x: 2300, y: 1000, r: 20, respawn: 0 },
      { x: 1800, y: 450, r: 20, respawn: 0 },
      { x: 1400, y: 800, r: 20, respawn: 0 },
      { x: 800, y: 350, r: 20, respawn: 0 },
      { x: 250, y: 1000, r: 20, respawn: 0 }
    ]
  },
  {
    id: 'volcano_highway',
    name: 'RODOVIA DO VULCÃO SUNSET',
    type: 'circuit',
    desc: 'Pista vulcânica massiva com curvas perigosas, pontes sobre lava e poças de óleo!',
    themeColor: '#ff5500',
    worldWidth: 2600,
    worldHeight: 2000,
    laps: 3,
    trackWidth: 145,
    waypoints: [
      { x: 400, y: 1650 },
      { x: 1300, y: 1750 },
      { x: 2200, y: 1550 },
      { x: 2350, y: 900 },
      { x: 1800, y: 400 },
      { x: 1200, y: 750 },
      { x: 700, y: 450 },
      { x: 280, y: 950 }
    ],
    checkpoints: [
      { x: 400, y: 1650, w: 200, h: 30, isFinish: true },
      { x: 1300, y: 1750, w: 30, h: 200 },
      { x: 2350, y: 900, w: 200, h: 30 },
      { x: 1800, y: 400, w: 30, h: 200 },
      { x: 700, y: 450, w: 200, h: 30 }
    ],
    itemBoxes: [
      { x: 850, y: 1700, r: 20, respawn: 0 },
      { x: 1800, y: 1650, r: 20, respawn: 0 },
      { x: 2300, y: 1200, r: 20, respawn: 0 },
      { x: 1500, y: 550, r: 20, respawn: 0 },
      { x: 500, y: 650, r: 20, respawn: 0 }
    ]
  },
  {
    id: 'battle_colosseum',
    name: 'ARENA COLISEU DO OLHO DE GATO',
    type: 'arena',
    desc: 'Arena gigante de combate para 8 a 10 Karts! Destrua rivais e seja o último sobrevivente!',
    themeColor: '#ff007f',
    worldWidth: 2200,
    worldHeight: 2200,
    laps: 1,
    trackWidth: 2200,
    waypoints: [
      { x: 1100, y: 1100 }
    ],
    checkpoints: [],
    itemBoxes: [
      { x: 1100, y: 1100, r: 24, respawn: 0 },
      { x: 600, y: 600, r: 24, respawn: 0 },
      { x: 1600, y: 600, r: 24, respawn: 0 },
      { x: 600, y: 1600, r: 24, respawn: 0 },
      { x: 1600, y: 1600, r: 24, respawn: 0 },
      { x: 1100, y: 500, r: 24, respawn: 0 },
      { x: 1100, y: 1700, r: 24, respawn: 0 },
      { x: 500, y: 1100, r: 24, respawn: 0 },
      { x: 1700, y: 1100, r: 24, respawn: 0 }
    ],
    pillars: [
      { x: 800, y: 800, r: 50 },
      { x: 1400, y: 800, r: 50 },
      { x: 800, y: 1400, r: 50 },
      { x: 1400, y: 1400, r: 50 }
    ]
  }
];

const CAT_RACERS = [
  { id: 'cat_neon', name: 'Gato Neon (Olho de Gato)', icon: '🐱', color: '#00f0ff', speed: 6.2, accel: 0.22, handling: 0.068, driftPower: 1.25, maxHp: 100 },
  { id: 'tiger_nitro', name: 'Tigre Turbo', icon: '🐯', color: '#ffea00', speed: 6.8, accel: 0.18, handling: 0.055, driftPower: 1.45, maxHp: 95 },
  { id: 'panther_cyber', name: 'Pantera Cyber', icon: '🐆', color: '#ff007f', speed: 6.0, accel: 0.26, handling: 0.078, driftPower: 1.15, maxHp: 105 },
  { id: 'cat_tank', name: 'Gato Blindado', icon: '🐈', color: '#39ff14', speed: 5.8, accel: 0.20, handling: 0.060, weight: 1.6, driftPower: 1.35, maxHp: 140 }
];

class CatsEyeRacing {
  constructor() {
    this.canvas = document.getElementById('raceCanvas');
    if (this.canvas) this.ctx = this.canvas.getContext('2d');

    this.state = 'menu'; // 'menu', 'countdown', 'racing', 'finished'
    this.gameMode = '1p'; // '1p', '2p_local', 'arena_1p', 'online'
    this.currentTrackIndex = 0;
    this.track = RACING_TRACKS[0];

    this.camera = { x: 0, y: 0, zoom: 1.0 };
    this.karts = [];
    this.projectiles = [];
    this.traps = [];
    this.particles = [];
    this.shockwaves = [];
    this.floatTexts = [];
    this.killFeed = [];

    this.countdown = 3;
    this.countdownTimer = 0;
    this.raceStartTime = 0;
    this.screenShake = 0;

    this.keys = {};
    this.initControls();
    this.initNetworkListeners();
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

  initNetworkListeners() {
    const net = window.networkManager;
    net.onRaceSync = (state) => {
      if (this.gameMode === 'online' && net.role === 'guest') {
        state.karts.forEach(remoteK => {
          const localK = this.karts.find(k => k.id === remoteK.id);
          if (localK && !localK.isHuman) {
            localK.x += (remoteK.x - localK.x) * 0.4;
            localK.y += (remoteK.y - localK.y) * 0.4;
            localK.angle = remoteK.angle;
            localK.speed = remoteK.speed;
            localK.hp = remoteK.hp;
            localK.item = remoteK.item;
          }
        });
      }
    };

    net.onRaceDamage = (data) => {
      const target = this.karts.find(k => k.id === data.targetId);
      if (target) {
        target.hp = Math.max(0, target.hp - data.damage);
        target.spinTimer = 40;
        this.createHitParticles(target.x, target.y, '#ff0055', 20);
        this.addFloatText(target.x, target.y - 20, `💥 -${data.damage} HP!`, '#ff0055');
      }
    };
  }

  startRace(mode = '1p', trackIndex = 0, selectedRacerIndex = 0) {
    if (!this.canvas) {
      this.canvas = document.getElementById('raceCanvas');
      if (this.canvas) this.ctx = this.canvas.getContext('2d');
    }

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
    this.killFeed = [];
    this.screenShake = 0;

    this.track.itemBoxes.forEach(b => { b.respawn = 0; });

    const isArena = this.track.type === 'arena';
    this.karts = [];

    if (isArena) {
      // MODO ARENA: 8 a 10 combatentes em círculo na arena gigante
      const totalCombatants = 8;
      const centerX = this.track.worldWidth / 2;
      const centerY = this.track.worldHeight / 2;
      const spawnRadius = 650;

      for (let i = 0; i < totalCombatants; i++) {
        const angle = (i / totalCombatants) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * spawnRadius;
        const y = centerY + Math.sin(angle) * spawnRadius;
        const faceAngle = angle + Math.PI;
        const isPlayer1 = i === 0;
        const isPlayer2 = mode === '2p_local' && i === 1;
        const racer = CAT_RACERS[i % CAT_RACERS.length];

        this.karts.push(this.createKart({
          id: isPlayer1 ? 'p1' : (isPlayer2 ? 'p2' : `bot_${i}`),
          name: isPlayer1 ? 'VOCÊ (GATO NEON)' : (isPlayer2 ? 'PLAYER 2' : `${racer.name.split(' ')[0]} (IA)`),
          isHuman: isPlayer1 || isPlayer2,
          playerNum: isPlayer1 ? 1 : (isPlayer2 ? 2 : 0),
          racer,
          x,
          y,
          angle: faceAngle
        }));
      }
    } else {
      // MODO CIRCUITO GIGANTE: Grid de Largada
      const startWp = this.track.waypoints[0];
      const nextWp = this.track.waypoints[1];
      const startAngle = Math.atan2(nextWp.y - startWp.y, nextWp.x - startWp.x);

      // Player 1
      this.karts.push(this.createKart({
        id: 'p1',
        name: 'VOCÊ (GATO NEON)',
        isHuman: true,
        playerNum: 1,
        racer: CAT_RACERS[selectedRacerIndex % CAT_RACERS.length],
        x: startWp.x - 30,
        y: startWp.y - 25,
        angle: startAngle
      }));

      // Player 2 se local
      if (mode === '2p_local') {
        this.karts.push(this.createKart({
          id: 'p2',
          name: 'PLAYER 2',
          isHuman: true,
          playerNum: 2,
          racer: CAT_RACERS[(selectedRacerIndex + 1) % CAT_RACERS.length],
          x: startWp.x - 70,
          y: startWp.y + 25,
          angle: startAngle
        }));
      }

      // 5 Bots para corrida massiva
      const botCount = mode === '2p_local' ? 4 : 5;
      for (let i = 1; i <= botCount; i++) {
        const racer = CAT_RACERS[i % CAT_RACERS.length];
        this.karts.push(this.createKart({
          id: `bot${i}`,
          name: `${racer.name.split(' ')[0]} (IA)`,
          isHuman: false,
          racer,
          x: startWp.x - (i * 65) - 30,
          y: startWp.y + (i % 2 === 0 ? 25 : -25),
          angle: startAngle
        }));
      }
    }

    const p1 = this.karts[0];
    this.camera.x = p1.x;
    this.camera.y = p1.y;

    const menu = document.getElementById('main-menu');
    const screen = document.getElementById('racing-screen');
    const over = document.getElementById('race-game-over-screen');
    if (menu) menu.classList.remove('active');
    if (over) over.classList.remove('active');
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
      angle: config.angle,
      speed: 0,
      maxSpeed: config.racer.speed,
      accel: config.racer.accel,
      handling: config.racer.handling,
      driftPower: config.racer.driftPower || 1.25,
      weight: config.racer.weight || 1.0,
      hp: config.racer.maxHp || 100,
      maxHp: config.racer.maxHp || 100,
      kills: 0,
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
      eliminated: false,
      rank: 1,
      item: null,
      trail: []
    };
  }

  loop() {
    try {
      this.update();
      this.render();
    } catch (err) {
      console.warn('Racing loop catch:', err);
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
      if (!kart.eliminated) this.updateKart(kart);
    });

    // Câmera segue suavemente o Player 1
    const p1 = this.karts.find(k => k.id === 'p1');
    if (p1) {
      this.camera.x += (p1.x - this.camera.x) * 0.12;
      this.camera.y += (p1.y - this.camera.y) * 0.12;
      this.camera.x = Math.max(RACE_VIEW_WIDTH / 2, Math.min(this.track.worldWidth - RACE_VIEW_WIDTH / 2, this.camera.x));
      this.camera.y = Math.max(RACE_VIEW_HEIGHT / 2, Math.min(this.track.worldHeight - RACE_VIEW_HEIGHT / 2, this.camera.y));
    }

    // Colisões Físicas entre Karts (Batidas, empurrões e dano de impacto no modo arena)
    for (let i = 0; i < this.karts.length; i++) {
      for (let j = i + 1; j < this.karts.length; j++) {
        if (!this.karts[i].eliminated && !this.karts[j].eliminated) {
          this.handleKartCollision(this.karts[i], this.karts[j]);
        }
      }
    }

    // Atualiza Projéteis
    this.updateProjectiles();

    // Atualiza Armadilhas
    this.updateTraps();

    // Atualiza Partículas e Shockwaves
    this.updateParticles();
    this.updateShockwaves();

    // Atualiza Rankings / Sobrevivência na Arena
    this.updateRankings();
  }

  updateKart(kart) {
    if (kart.spinTimer > 0) {
      kart.spinTimer--;
      kart.angle += 0.28;
      kart.speed *= 0.93;
      kart.x += Math.cos(kart.angle) * kart.speed;
      kart.y += Math.sin(kart.angle) * kart.speed;
      return;
    }

    if (kart.nitroTimer > 0) {
      kart.nitroTimer--;
      kart.speed = kart.maxSpeed * 1.55;
      if (Math.random() < 0.5) {
        this.particles.push({
          x: kart.x - Math.cos(kart.angle) * 16,
          y: kart.y - Math.sin(kart.angle) * 16,
          vx: -Math.cos(kart.angle) * 4 + (Math.random() - 0.5) * 2,
          vy: -Math.sin(kart.angle) * 4 + (Math.random() - 0.5) * 2,
          life: 0.4,
          color: Math.random() > 0.5 ? '#ffea00' : '#ff007f',
          size: Math.random() * 6 + 3
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
      const aiCmd = this.getAICommand(kart);
      accelerating = aiCmd.accelerating;
      braking = aiCmd.braking;
      turnLeft = aiCmd.turnLeft;
      turnRight = aiCmd.turnRight;
      driftKey = aiCmd.driftKey;
      useItemKey = aiCmd.useItemKey;
    }

    if (useItemKey && kart.item) {
      this.useKartItem(kart);
    }

    if (accelerating) {
      kart.speed = Math.min(kart.nitroTimer > 0 ? kart.maxSpeed * 1.55 : kart.maxSpeed, kart.speed + kart.accel);
    } else if (braking) {
      kart.speed = Math.max(-kart.maxSpeed * 0.4, kart.speed - kart.accel * 1.5);
    } else {
      kart.speed *= 0.985;
    }

    // Drift & Mini-Turbo
    if (driftKey && Math.abs(kart.speed) > 2.0 && (turnLeft || turnRight)) {
      if (!kart.isDrifting) {
        kart.isDrifting = true;
        kart.driftDir = turnLeft ? -1 : 1;
        kart.driftCharge = 0;
      }
      kart.driftCharge += 1.8;
      kart.angle += kart.driftDir * kart.handling * 1.38;

      if (Math.random() < 0.6) {
        const sparkColor = kart.driftCharge > 80 ? '#ffea00' : (kart.driftCharge > 40 ? '#00f0ff' : '#ffffff');
        this.particles.push({
          x: kart.x - Math.cos(kart.angle) * 14,
          y: kart.y - Math.sin(kart.angle) * 14,
          vx: -Math.cos(kart.angle) * 2.5 + (Math.random() - 0.5) * 2,
          vy: -Math.sin(kart.angle) * 2.5 + (Math.random() - 0.5) * 2,
          life: 0.35,
          color: sparkColor,
          size: Math.random() * 4 + 2
        });
      }
    } else {
      if (kart.isDrifting) {
        if (kart.driftCharge > 80) {
          kart.nitroTimer = 55;
          window.retroAudio.playPaddleHit(true);
          this.addFloatText(kart.x, kart.y - 25, '⚡ MEGA TURBO!', '#ffea00');
          this.addShockwave(kart.x, kart.y, '#ffea00', 45);
        } else if (kart.driftCharge > 40) {
          kart.nitroTimer = 30;
          window.retroAudio.playPaddleHit(false);
          this.addFloatText(kart.x, kart.y - 25, '⚡ MINI TURBO!', '#00f0ff');
          this.addShockwave(kart.x, kart.y, '#00f0ff', 30);
        }
        kart.isDrifting = false;
        kart.driftCharge = 0;
      }

      if (turnLeft) kart.angle -= kart.handling * (kart.speed / kart.maxSpeed);
      if (turnRight) kart.angle += kart.handling * (kart.speed / kart.maxSpeed);
    }

    kart.x += Math.cos(kart.angle) * kart.speed;
    kart.y += Math.sin(kart.angle) * kart.speed;

    // Rastro de pneu
    kart.trail.push({ x: kart.x, y: kart.y, angle: kart.angle, isDrifting: kart.isDrifting });
    if (kart.trail.length > 12) kart.trail.shift();

    // Bordas do Mundo Gigante
    kart.x = Math.max(45, Math.min(this.track.worldWidth - 45, kart.x));
    kart.y = Math.max(45, Math.min(this.track.worldHeight - 45, kart.y));

    // Coleta de Caixas de Itens
    this.track.itemBoxes.forEach(box => {
      if (box.respawn <= 0 && !kart.item) {
        const dist = Math.hypot(kart.x - box.x, kart.y - box.y);
        if (dist < box.r + 18) {
          box.respawn = 180;
          const items = ['missile', 'trap', 'nitro', 'shield', 'bomb'];
          kart.item = items[Math.floor(Math.random() * items.length)];
          window.retroAudio.playPortal();
          this.createHitParticles(box.x, box.y, '#ffea00', 16);
          this.addShockwave(box.x, box.y, '#00f0ff', 35);
          this.addFloatText(kart.x, kart.y - 25, `🎁 ${this.getItemName(kart.item)}!`, '#ffea00');
        }
      }
    });

    // Checkpoints para Modo Circuito
    if (this.track.type === 'circuit') {
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
              this.addFloatText(kart.x, kart.y - 30, `VOLTA ${kart.currentLap}/${this.track.laps}!`, '#00f0ff');
            }
            if (kart.currentLap > this.track.laps && !kart.finished) {
              kart.finished = true;
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
      kart.nitroTimer = 85;
      window.retroAudio.playPaddleHit(true);
      this.addFloatText(kart.x, kart.y - 25, '⚡ NITRO MÁXIMO!', '#ffea00');
      this.addShockwave(kart.x, kart.y, '#ffea00', 50);
    } else if (item === 'shield') {
      kart.shieldTimer = 350;
      window.retroAudio.playPortal();
      this.addFloatText(kart.x, kart.y - 25, '🛡️ ESCUDO ATIVO!', '#00f0ff');
    } else if (item === 'trap') {
      this.traps.push({
        x: kart.x - Math.cos(kart.angle) * 32,
        y: kart.y - Math.sin(kart.angle) * 32,
        r: 16,
        life: 800
      });
      window.retroAudio.playWallBounce();
      this.addFloatText(kart.x, kart.y - 25, '🐟 ARMADILHA!', '#ffaa00');
    } else if (item === 'missile') {
      this.projectiles.push({
        type: 'missile',
        owner: kart.id,
        x: kart.x + Math.cos(kart.angle) * 26,
        y: kart.y + Math.sin(kart.angle) * 26,
        angle: kart.angle,
        speed: 10.5,
        target: this.findAheadKart(kart),
        life: 220
      });
      window.retroAudio.playBlasterHit();
      this.addFloatText(kart.x, kart.y - 25, '🚀 MÍSSIL LANÇADO!', '#ff0055');
    } else if (item === 'bomb') {
      this.projectiles.push({
        type: 'bomb',
        owner: kart.id,
        x: kart.x + Math.cos(kart.angle) * 30,
        y: kart.y + Math.sin(kart.angle) * 30,
        angle: kart.angle,
        speed: 7.0,
        timer: 70
      });
      window.retroAudio.playPaddleHit(false);
      this.addFloatText(kart.x, kart.y - 25, '💣 BOMBA EMP!', '#ff00ff');
    }
  }

  findAheadKart(sourceKart) {
    let target = null;
    let minDist = Infinity;
    this.karts.forEach(k => {
      if (k.id !== sourceKart.id && !k.eliminated) {
        const dx = k.x - sourceKart.x;
        const dy = k.y - sourceKart.y;
        const dist = Math.hypot(dx, dy);
        if (dist < minDist) {
          minDist = dist;
          target = k;
        }
      }
    });
    return target;
  }

  handleKartCollision(k1, k2) {
    const dx = k2.x - k1.x;
    const dy = k2.y - k1.y;
    const dist = Math.hypot(dx, dy);
    const minDist = 30;

    if (dist < minDist) {
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);

      k1.x -= nx * (minDist - dist) * 0.5;
      k1.y -= ny * (minDist - dist) * 0.5;
      k2.x += nx * (minDist - dist) * 0.5;
      k2.y += ny * (minDist - dist) * 0.5;

      const speedDiff = Math.abs(k1.speed - k2.speed);
      const damage = Math.round(speedDiff * 5 * (k1.weight || 1.0));

      if (this.track.type === 'arena' && damage > 8) {
        if (k1.shieldTimer <= 0) k1.hp = Math.max(0, k1.hp - damage);
        if (k2.shieldTimer <= 0) k2.hp = Math.max(0, k2.hp - damage);
        this.addFloatText((k1.x + k2.x) / 2, (k1.y + k2.y) / 2 - 20, `💥 RAM -${damage} HP!`, '#ffea00');
        this.checkElimination(k1, k2);
        this.checkElimination(k2, k1);
      }

      const tempSpeed = k1.speed;
      k1.speed = k2.speed * 0.85;
      k2.speed = tempSpeed * 0.85;

      this.screenShake = 4;
      window.retroAudio.playPaddleHit(false);
      this.createHitParticles((k1.x + k2.x) / 2, (k1.y + k2.y) / 2, '#ffea00', 12);
    }
  }

  checkElimination(victim, attacker) {
    if (victim.hp <= 0 && !victim.eliminated) {
      victim.eliminated = true;
      if (attacker) attacker.kills++;
      this.screenShake = 12;
      this.createHitParticles(victim.x, victim.y, '#ff0055', 40);
      this.addShockwave(victim.x, victim.y, '#ff0055', 70);
      window.retroAudio.playBlasterHit();
      this.addFloatText(victim.x, victim.y - 30, `☠️ ${victim.name} K.O.!`, '#ff0033');

      const aliveKarts = this.karts.filter(k => !k.eliminated);
      if (victim.isHuman && victim.id === 'p1') {
        this.state = 'finished';
        this.showGameOver(aliveKarts.length + 1);
      } else if (aliveKarts.length === 1 && aliveKarts[0].id === 'p1') {
        this.state = 'finished';
        this.spawnConfetti();
        this.showGameOver(1);
      }
    }
  }

  updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life--;

      if (p.type === 'missile') {
        if (p.target && p.target.x && !p.target.eliminated) {
          const targetAngle = Math.atan2(p.target.y - p.y, p.target.x - p.x);
          let diff = targetAngle - p.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          p.angle += diff * 0.09;
        }
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        if (Math.random() < 0.5) {
          this.particles.push({
            x: p.x, y: p.y,
            vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
            life: 0.35, color: '#ff5500', size: 4
          });
        }

        this.karts.forEach(k => {
          if (k.id !== p.owner && !k.eliminated && Math.hypot(k.x - p.x, k.y - p.y) < 28) {
            if (k.shieldTimer <= 0) {
              k.spinTimer = 50;
              k.hp = Math.max(0, k.hp - 35);
              this.screenShake = 8;
              window.retroAudio.playBlasterHit();
              this.createHitParticles(k.x, k.y, '#ff0055', 30);
              this.addShockwave(k.x, k.y, '#ff0055', 55);
              this.addFloatText(k.x, k.y - 25, '💥 MÍSSIL -35 HP!', '#ff0055');
              const attacker = this.karts.find(atk => atk.id === p.owner);
              this.checkElimination(k, attacker);
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
        if (!k.eliminated && Math.hypot(k.x - t.x, k.y - t.y) < t.r + 16) {
          if (k.shieldTimer <= 0) {
            k.spinTimer = 45;
            k.hp = Math.max(0, k.hp - 15);
            window.retroAudio.playWallBounce();
            this.createHitParticles(t.x, t.y, '#ffaa00', 20);
            this.addFloatText(k.x, k.y - 25, '🌀 ESCORREGOU -15 HP!', '#ffaa00');
            this.checkElimination(k, null);
          }
          t.life = 0;
        }
      });

      if (t.life <= 0) this.traps.splice(i, 1);
    }
  }

  getAICommand(kart) {
    if (this.track.type === 'arena') {
      // IA Modo Arena: Busca caixas de itens e persegue o inimigo mais próximo!
      let target = null;
      let minDist = Infinity;

      if (!kart.item) {
        this.track.itemBoxes.forEach(b => {
          if (b.respawn <= 0) {
            const dist = Math.hypot(b.x - kart.x, b.y - kart.y);
            if (dist < minDist) {
              minDist = dist;
              target = b;
            }
          }
        });
      }

      if (!target) {
        this.karts.forEach(k => {
          if (k.id !== kart.id && !k.eliminated) {
            const dist = Math.hypot(k.x - kart.x, k.y - kart.y);
            if (dist < minDist) {
              minDist = dist;
              target = k;
            }
          }
        });
      }

      if (!target) target = { x: this.track.worldWidth / 2, y: this.track.worldHeight / 2 };

      const targetAngle = Math.atan2(target.y - kart.y, target.x - kart.x);
      let diff = targetAngle - kart.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      return {
        accelerating: true,
        braking: Math.abs(diff) > 1.2 && kart.speed > 4.0,
        turnLeft: diff < -0.15,
        turnRight: diff > 0.15,
        driftKey: Math.abs(diff) > 0.9 && Math.random() < 0.6,
        useItemKey: !!kart.item && Math.random() < 0.06
      };
    } else {
      // IA Modo Circuito Gigante
      const targetWp = this.track.waypoints[kart.currentWaypoint % this.track.waypoints.length];
      const distToWp = Math.hypot(targetWp.x - kart.x, targetWp.y - kart.y);

      if (distToWp < 90) {
        kart.currentWaypoint = (kart.currentWaypoint + 1) % this.track.waypoints.length;
      }

      const targetAngle = Math.atan2(targetWp.y - kart.y, targetWp.x - kart.x);
      let diff = targetAngle - kart.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      const isSharp = Math.abs(diff) > 0.8;
      return {
        accelerating: !isSharp || kart.speed < 4.0,
        braking: isSharp && kart.speed > 5.0,
        turnLeft: diff < -0.15,
        turnRight: diff > 0.15,
        driftKey: isSharp && Math.random() < 0.6,
        useItemKey: !!kart.item && Math.random() < 0.05
      };
    }
  }

  updateRankings() {
    if (this.track.type === 'arena') {
      const alive = this.karts.filter(k => !k.eliminated);
      const p1 = this.karts.find(k => k.id === 'p1');
      if (p1) {
        const posEl = document.getElementById('race-hud-pos');
        const lapEl = document.getElementById('race-hud-lap');
        const itemEl = document.getElementById('race-hud-item');
        if (posEl) posEl.innerText = `❤️ HP: ${p1.hp}/${p1.maxHp}`;
        if (lapEl) lapEl.innerText = `VIVOS: ${alive.length}/${this.karts.length}`;
        if (itemEl) itemEl.innerText = p1.item ? `🎁 ${this.getItemName(p1.item)}` : 'NENHUM';
      }
    } else {
      this.karts.sort((a, b) => {
        if (a.currentLap !== b.currentLap) return b.currentLap - a.currentLap;
        if (a.nextCheckpoint !== b.nextCheckpoint) return b.nextCheckpoint - a.nextCheckpoint;
        const cp = this.track.checkpoints[a.nextCheckpoint] || { x: 0, y: 0 };
        return Math.hypot(a.x - cp.x, a.y - cp.y) - Math.hypot(b.x - cp.x, b.y - cp.y);
      });

      this.karts.forEach((k, idx) => { k.rank = idx + 1; });

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
  }

  render() {
    this.ctx.save();

    // Limpa a tela
    this.ctx.fillStyle = '#05051a';
    this.ctx.fillRect(0, 0, RACE_VIEW_WIDTH, RACE_VIEW_HEIGHT);

    // Câmera do Mundo Gigante
    this.ctx.save();
    this.ctx.translate(
      -this.camera.x + RACE_VIEW_WIDTH / 2 + (Math.random() - 0.5) * this.screenShake,
      -this.camera.y + RACE_VIEW_HEIGHT / 2 + (Math.random() - 0.5) * this.screenShake
    );

    // Renderiza Mundo Gigante
    this.renderWorldBackground();
    this.renderTrackOrArena();
    this.renderCheckpoints();
    this.renderItemBoxes();
    this.renderTraps();

    // Karts
    this.karts.forEach(k => {
      if (!k.eliminated) this.renderKart(k);
    });

    // Projéteis e Efeitos
    this.renderProjectiles();
    this.renderParticles();
    this.renderShockwaves();
    this.renderFloatTexts();

    this.ctx.restore(); // Restaura da câmera

    // Mini-Mapa Radar
    this.renderMiniMap();

    // Countdown Overlay
    if (this.state === 'countdown') {
      this.ctx.fillStyle = '#ffea00';
      this.ctx.font = '48px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = '#ffea00';
      this.ctx.shadowBlur = 20;
      const txt = this.countdown > 0 ? this.countdown.toString() : (this.track.type === 'arena' ? 'COMBATE!' : 'LARGADA!');
      this.ctx.fillText(txt, RACE_VIEW_WIDTH / 2, RACE_VIEW_HEIGHT / 2 + 16);
    }

    this.ctx.restore();
  }

  renderWorldBackground() {
    // Grid Cyber Espacial
    this.ctx.strokeStyle = 'rgba(40, 40, 110, 0.2)';
    this.ctx.lineWidth = 2;
    for (let x = 0; x < this.track.worldWidth; x += 100) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.track.worldHeight);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.track.worldHeight; y += 100) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.track.worldWidth, y);
      this.ctx.stroke();
    }

    // Paredes Externas do Mundo
    this.ctx.strokeStyle = this.track.themeColor;
    this.ctx.lineWidth = 8;
    this.ctx.strokeRect(20, 20, this.track.worldWidth - 40, this.track.worldHeight - 40);
  }

  renderTrackOrArena() {
    if (this.track.type === 'arena') {
      // Arena Coliseu Gigante
      const cx = this.track.worldWidth / 2;
      const cy = this.track.worldHeight / 2;
      this.ctx.fillStyle = '#121235';
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 950, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#ff007f';
      this.ctx.lineWidth = 12;
      this.ctx.shadowColor = '#ff007f';
      this.ctx.shadowBlur = 25;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Pilares de Colisão
      if (this.track.pillars) {
        this.track.pillars.forEach(pil => {
          this.ctx.fillStyle = '#ff0055';
          this.ctx.beginPath();
          this.ctx.arc(pil.x, pil.y, pil.r, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.strokeStyle = '#ffea00';
          this.ctx.lineWidth = 4;
          this.ctx.stroke();
        });
      }
    } else {
      // Circuito Gigante
      const wps = this.track.waypoints;
      const tw = this.track.trackWidth;

      this.ctx.strokeStyle = '#151538';
      this.ctx.lineWidth = tw;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(wps[0].x, wps[0].y);
      for (let i = 1; i < wps.length; i++) this.ctx.lineTo(wps[i].x, wps[i].y);
      this.ctx.closePath();
      this.ctx.stroke();

      // Zebras Neon
      this.ctx.strokeStyle = this.track.themeColor;
      this.ctx.lineWidth = 6;
      this.ctx.shadowColor = this.track.themeColor;
      this.ctx.shadowBlur = 15;
      this.ctx.setLineDash([25, 25]);
      this.ctx.beginPath();
      this.ctx.moveTo(wps[0].x, wps[0].y);
      for (let i = 1; i < wps.length; i++) this.ctx.lineTo(wps[i].x, wps[i].y);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.setLineDash([]);
      this.ctx.shadowBlur = 0;
    }
  }

  renderCheckpoints() {
    this.track.checkpoints.forEach(cp => {
      this.ctx.save();
      this.ctx.translate(cp.x, cp.y);
      this.ctx.fillStyle = cp.isFinish ? '#ffffff' : 'rgba(0, 240, 255, 0.25)';
      this.ctx.fillRect(-cp.w / 2, -cp.h / 2, cp.w, cp.h);
      if (cp.isFinish) {
        this.ctx.fillStyle = '#000000';
        for (let x = -cp.w / 2; x < cp.w / 2; x += 16) {
          this.ctx.fillRect(x, -cp.h / 2, 8, cp.h);
        }
      }
      this.ctx.restore();
    });
  }

  renderItemBoxes() {
    this.track.itemBoxes.forEach(b => {
      if (b.respawn <= 0) {
        this.ctx.save();
        this.ctx.translate(b.x, b.y);
        const rot = Date.now() * 0.003;
        this.ctx.rotate(rot);

        this.ctx.shadowColor = '#ffea00';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = 'rgba(255, 234, 0, 0.5)';
        this.ctx.fillRect(-b.r, -b.r, b.r * 2, b.r * 2);
        this.ctx.strokeStyle = '#ffea00';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(-b.r, -b.r, b.r * 2, b.r * 2);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px "Press Start 2P"';
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
      this.ctx.font = '18px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🐟', 0, 7);
      this.ctx.restore();
    });
  }

  renderKart(k) {
    this.ctx.save();
    this.ctx.translate(k.x, k.y);
    this.ctx.rotate(k.angle);

    // Barra de Vida no Modo Arena
    if (this.track.type === 'arena') {
      this.ctx.rotate(-k.angle);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(-22, -26, 44, 6);
      const hpPct = Math.max(0, k.hp / k.maxHp);
      this.ctx.fillStyle = hpPct > 0.5 ? '#39ff14' : (hpPct > 0.25 ? '#ffea00' : '#ff0033');
      this.ctx.fillRect(-20, -25, 40 * hpPct, 4);
      this.ctx.rotate(k.angle);
    }

    // Escudo Ativo
    if (k.shieldTimer > 0) {
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 20;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 24, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Chassi
    this.ctx.fillStyle = '#101025';
    this.ctx.fillRect(-15, -10, 30, 20);

    // Rodas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(-14, -14, 9, 4);
    this.ctx.fillRect(5, -14, 9, 4);
    this.ctx.fillRect(-14, 10, 9, 4);
    this.ctx.fillRect(5, 10, 9, 4);

    // Corpo Colorido
    this.ctx.fillStyle = k.racer.color;
    this.ctx.shadowColor = k.racer.color;
    this.ctx.shadowBlur = 12;
    this.ctx.fillRect(-10, -8, 20, 16);

    // Piloto Gato
    this.ctx.font = '14px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(k.racer.icon, 0, 5);

    this.ctx.restore();
  }

  renderProjectiles() {
    this.projectiles.forEach(p => {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.font = '16px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(p.type === 'missile' ? '🚀' : '💣', 0, 6);
      this.ctx.restore();
    });
  }

  renderMiniMap() {
    const mapW = 160;
    const mapH = 120;
    const mapX = RACE_VIEW_WIDTH - mapW - 14;
    const mapY = RACE_VIEW_HEIGHT - mapH - 14;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(8, 8, 35, 0.85)';
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(mapX, mapY, mapW, mapH);
    this.ctx.strokeRect(mapX, mapY, mapW, mapH);

    const scaleX = mapW / this.track.worldWidth;
    const scaleY = mapH / this.track.worldHeight;

    // Karts no Radar
    this.karts.forEach(k => {
      if (!k.eliminated) {
        const kx = mapX + k.x * scaleX;
        const ky = mapY + k.y * scaleY;
        this.ctx.fillStyle = k.id === 'p1' ? '#ffea00' : k.racer.color;
        this.ctx.beginPath();
        this.ctx.arc(kx, ky, k.id === 'p1' ? 4 : 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    this.ctx.restore();
  }

  createHitParticles(x, y, color = '#ffffff', count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color,
        size: Math.random() * 5 + 2
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
      sw.r += (sw.maxR - sw.r) * 0.2 + 1.2;
      sw.alpha -= 0.05;
      if (sw.alpha <= 0 || sw.r >= sw.maxR) this.shockwaves.splice(i, 1);
    }
  }

  addFloatText(x, y, text, color = '#ffea00') {
    this.floatTexts.push({ x, y, text, color, alpha: 1.0, vy: -1.4 });
  }

  renderFloatTexts() {
    this.floatTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.font = '12px "Press Start 2P"';
      this.ctx.fillStyle = ft.color;
      this.ctx.shadowColor = ft.color;
      this.ctx.shadowBlur = 12;
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
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: this.camera.x + (Math.random() - 0.5) * RACE_VIEW_WIDTH,
        y: this.camera.y - RACE_VIEW_HEIGHT / 2,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 4 + 2,
        life: 2.5,
        color: ['#00f0ff', '#ff007f', '#ffea00', '#39ff14'][Math.floor(Math.random() * 4)],
        size: 6
      });
    }
  }

  showGameOver(rank) {
    const modal = document.getElementById('race-game-over-screen');
    const title = document.getElementById('race-winner-msg');
    if (title) {
      if (this.track.type === 'arena') {
        title.innerText = rank === 1 ? '👑 SOBREVIVENTE DA ARENA! VITÓRIA!' : `☠️ VOCÊ FOI ELIMINADO EM ${rank}º LUGAR!`;
      } else {
        title.innerText = rank === 1 ? '🏆 1º LUGAR! CAMPEÃO!' : `🏁 VOCÊ TERMINOU EM ${rank}º LUGAR!`;
      }
    }
    if (modal) modal.classList.add('active');
  }

  returnToMenu() {
    this.state = 'menu';
    const menu = document.getElementById('main-menu');
    const screen = document.getElementById('racing-screen');
    const over = document.getElementById('race-game-over-screen');
    if (screen) screen.classList.remove('active');
    if (over) over.classList.remove('active');
    if (menu) menu.classList.add('active');
  }
}

window.catsEyeRacing = new CatsEyeRacing();
