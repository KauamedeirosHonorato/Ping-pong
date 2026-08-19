// RETRO PING PONG - Ultra Polish Edition (14 Action Modes, Smash & Spin Physics, Synthwave VFX)

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const ACTION_MODES = [
  { 
    id: 'secret_wall', 
    name: 'PAREDE SECRETA', 
    desc: 'Uma barreira holográfica no centro rebate a bola de volta! Contorne-a!',
    color: '#ff007f'
  },
  { 
    id: 'fireball', 
    name: 'BOLA DE FOGO', 
    desc: 'O anel solar central superaquece a bola em chamas de alta velocidade!',
    color: '#ff5500'
  },
  { 
    id: 'multiball', 
    name: 'MULTIBOLA TRIPLA', 
    desc: '3 bolas em jogo colidindo entre si! Marque 2 gols para vencer!',
    color: '#00f0ff'
  },
  { 
    id: 'big_ball', 
    name: 'BOLA GIGANTE & MINI RAQUETES', 
    desc: 'Bola massiva e raquetes reduzidas pela metade!',
    color: '#ffea00'
  },
  { 
    id: 'fog_zone', 
    name: 'ZONA DE NEBLINA', 
    desc: 'Nuvem espessa no centro: a bola fica invisível e sem som ao cruzar!',
    color: '#8b8be6'
  },
  { 
    id: 'gravity_well', 
    name: 'POÇO GRAVITACIONAL', 
    desc: 'Vórtices cósmicos atraem e arremessam a bola em estilingue orbital!',
    color: '#b026ff'
  },
  { 
    id: 'portals', 
    name: 'PORTAIS INTERDIMENSIONAIS', 
    desc: 'Portais Quânticos (Azul & Laranja) no campo teletransportam a bola!',
    color: '#00d4ff'
  },
  { 
    id: 'lightning_storm', 
    name: 'TEMPESTADE ELÉTRICA 10.000V', 
    desc: 'Raios eletrificam as paredes e sobrecarregam a bola com ziguezagues!',
    color: '#ffff00'
  },
  { 
    id: 'time_warp', 
    name: 'CAMPO TEMPORAL (BULLET TIME)', 
    desc: 'No centro do campo o tempo desacelera em câmera lenta extrema!',
    color: '#00ffaa'
  },
  { 
    id: 'asteroid_belt', 
    name: 'CHUVA DE ASTEROIDES', 
    desc: 'Meteoros flutuam na mesa e se fragmentam quando atingidos!',
    color: '#d488ff'
  },
  { 
    id: 'bumper_ball', 
    name: 'BUMPER PINBALL MADNESS', 
    desc: '5 bumpers arcade de pinball disparam a bola com impulsos luminosos!',
    color: '#00ffaa'
  },
  { 
    id: 'kitty', 
    name: 'NÃO ACERTE O GATINHO!', 
    desc: 'Um gatinho passeia na mesa! 2 acertos nele ou gol perdem a rodada!',
    color: '#ff9900'
  },
  { 
    id: 'blaster', 
    name: 'BLASTER (LANÇADORES & ESCUDOS)', 
    desc: 'Aperte ESPAÇO para atirar lasers! 2 acertos nocautearão o oponente!',
    color: '#ff0055'
  },
  { 
    id: 'speed_frenzy', 
    name: 'SUPER SÔNICA TURBO 200%', 
    desc: 'Velocidade extrema e aceleração instantânea a cada rebatida!',
    color: '#ff0033'
  },
  { 
    id: 'shield_generator', 
    name: 'GERADOR DE ESCUDOS HOLOGRÁFICOS', 
    desc: '3 camadas de escudos de energia protegem os gols de cada jogador!',
    color: '#00e5ff'
  },
  { 
    id: 'black_hole', 
    name: 'BURACO NEGRO SUPERMASSIVO', 
    desc: 'Um horizonte de eventos cósmico no centro suga a bola em hiperespaço!',
    color: '#b026ff'
  },
  { 
    id: 'magnet_field', 
    name: 'CAMPO ELETROMAGNÉTICO', 
    desc: 'Pólos Magnéticos Norte e Sul repelem e atraem a bola pelo campo!',
    color: '#ff3366'
  },
  { 
    id: 'paddle_morph', 
    name: 'RAQUETES MUTANTES NANO-TECH', 
    desc: 'As raquetes pulsam e mudam de tamanho dinamicamente em cada jogada!',
    color: '#39ff14'
  },
  { 
    id: 'laser_turrets', 
    name: 'TORRETAS DE DEFESA CYBER', 
    desc: 'Canhões automáticos disparam lasers energéticos pelo centro da mesa!',
    color: '#ff0055'
  },
  { 
    id: 'ghost_ball', 
    name: 'BOLA FANTASMA DIMENSIONAL', 
    desc: 'A bola oscila entre dimensões, tornando-se translúcida com clones falsos!',
    color: '#e066ff'
  },
  { 
    id: 'meteor_shower', 
    name: 'CHUVA DE METEOROS CADENTES', 
    desc: 'Meteoros flamejantes despencam do céu e criam crateras energéticas!',
    color: '#ff4400'
  },
  { 
    id: 'ice_rink', 
    name: 'PISTA DE GELO FRICÇÃO ZERO', 
    desc: 'Sem atrito! As raquetes deslizam e aceleram com inércia pura!',
    color: '#a0f0ff'
  },
  { 
    id: 'laser_grid', 
    name: 'GRADE DE LASERS DE SEGURANÇA', 
    desc: 'Feixes verticais cortam a quadra! Cruzar no timing certo dá turbo!',
    color: '#ff0033'
  },
  { 
    id: 'wind_tunnel', 
    name: 'TÚNEL DE VENTO FURACÃO', 
    desc: 'Rajadas de vento empurram a bola para cima e para baixo em ondas!',
    color: '#00ffcc'
  },
  { 
    id: 'disco_chaos', 
    name: 'DISCO INFERNO SYNTHWAVE', 
    desc: 'Música pulsante, luzes estroboscópicas e trilha multicolorida a cada hit!',
    color: '#ff00ff'
  },
  { 
    id: 'shrink_ray', 
    name: 'PRISMA DE RAIO ENCOLHEDOR', 
    desc: 'O prisma central altera o tamanho da bola entre micro-bala e bola gigante!',
    color: '#ffff00'
  },
  { 
    id: 'mirror_dimension', 
    name: 'DIMENSÃO ESPELHO INVERTIDA', 
    desc: 'Ao cruzar o espelho central, os controles e trajetória se invertem!',
    color: '#9933ff'
  },
  { 
    id: 'plasma_cannon', 
    name: 'CANHÃO CENTRAL DE PLASMA', 
    desc: 'Uma torre giratória no centro dispara esferas de plasma em alta velocidade!',
    color: '#00e5ff'
  },
  { 
    id: 'anti_gravity', 
    name: 'ANTI-GRAVIDADE ORBITAL', 
    desc: 'A gravidade oscila e empurra a bola e partículas em direção ao teto!',
    color: '#cc00ff'
  },
  { 
    id: 'chain_lightning', 
    name: 'BOBINAS DE TESLA 50.000V', 
    desc: 'Arcos elétricos conectam as raquetes e a bola com faíscas supersônicas!',
    color: '#ffff33'
  },
  { 
    id: 'cyber_barrier', 
    name: 'COMPORTAS CIBERNÉTICAS', 
    desc: 'Portas blindadas abrem e fecham ritmicamente no centro da mesa!',
    color: '#00ffaa'
  },
  { 
    id: 'drone_patrol', 
    name: 'DRONES DE SEGURANÇA CYBER', 
    desc: 'Mini drones voam em órbita interceptando e rebatendo tiros!',
    color: '#ff3366'
  },
  { 
    id: 'hyper_jump', 
    name: 'HIPER-SALTO ESTELAR', 
    desc: 'A bola teleporta instantaneamente 120px para a frente em saltos quânticos!',
    color: '#33ccff'
  },
  { 
    id: 'bubble_shield', 
    name: 'BOLHAS DE FORÇA ELÁSTICAS', 
    desc: 'Bolhas flutuantes absorvem e disparam a bola com física de mola!',
    color: '#ff66cc'
  },
  { 
    id: 'sonic_boom', 
    name: 'ESTRONDO SÔNICO DE IMPACTO', 
    desc: 'Toda rebatida gera uma onda de choque expansiva que repele objetos!',
    color: '#ffaa00'
  },
  { 
    id: 'boss_invasion', 
    name: 'INVASÃO DO MEGABOSS RETRO', 
    desc: 'Um Boss alienígena invade o centro com barras de vida e lasers!',
    color: '#ff0044'
  }
];

class RetroPingPong {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Configurações
    this.gameType = '1p';
    this.gameMode = 'action';
    this.aiSkill = 'rookie';
    this.actionSequence = [];
    this.currentActionIndex = 0;
    this.currentAction = null;

    // Estado da partida
    this.score1 = 0;
    this.score2 = 0;
    this.maxScore = 7;
    this.state = 'menu';
    this.countdown = 3;
    this.countdownTimer = 0;

    // Sub-pontuação Multiball
    this.multiballScore1 = 0;
    this.multiballScore2 = 0;

    // Efeitos Globais & Animação Synthwave
    this.screenShake = 0;
    this.gridOffset = 0;
    this.floatTexts = [];

    // Jogadores / Raquetes com Física de Força, Spin & Smash
    this.p1 = {
      x: 30,
      y: 250,
      prevY: 250,
      vy: 0,
      width: 14,
      height: 90,
      baseHeight: 90,
      speed: 8.5,
      powerMeter: 0,
      hitsTaken: 0,
      laserCooldown: 0,
      scaleX: 1,
      scaleY: 1,
      muzzleFlash: 0,
      name: 'PLAYER 1'
    };

    this.p2 = {
      x: CANVAS_WIDTH - 30 - 14,
      y: 250,
      prevY: 250,
      vy: 0,
      width: 14,
      height: 90,
      baseHeight: 90,
      speed: 8.5,
      powerMeter: 0,
      hitsTaken: 0,
      laserCooldown: 0,
      scaleX: 1,
      scaleY: 1,
      muzzleFlash: 0,
      name: 'PLAYER 2'
    };

    this.p3 = {
      x: 75,
      y: 250,
      prevY: 250,
      vy: 0,
      width: 14,
      height: 75,
      baseHeight: 75,
      speed: 8.0,
      powerMeter: 0,
      hitsTaken: 0,
      laserCooldown: 0,
      scaleX: 1,
      scaleY: 1,
      muzzleFlash: 0,
      name: 'PLAYER 3'
    };

    this.p4 = {
      x: CANVAS_WIDTH - 75 - 14,
      y: 250,
      prevY: 250,
      vy: 0,
      width: 14,
      height: 75,
      baseHeight: 75,
      speed: 8.0,
      powerMeter: 0,
      hitsTaken: 0,
      laserCooldown: 0,
      scaleX: 1,
      scaleY: 1,
      muzzleFlash: 0,
      name: 'PLAYER 4'
    };

    // Bolas
    this.balls = [];
    this.defaultBallRadius = 8;

    // Elementos Especiais dos Modos
    this.particles = [];
    this.shockwaves = [];
    this.confetti = [];
    this.lasers = [];
    this.bumpers = [];
    this.kitty = null;
    this.gravityWells = [];
    this.secretWall = null;
    this.portals = [];
    this.asteroids = [];
    this.lightningBolts = [];
    this.fogParticles = [];
    this.ambientDust = [];
    this.shields1 = [];
    this.shields2 = [];
    this.blackHole = null;
    this.magnets = [];
    this.turrets = [];
    this.turretLasers = [];

    // Controles
    this.keys = {};
    this.mouseControl = false;
    this.mouseTargetY = null;
    
    // UI
    this.bannerEl = document.getElementById('action-banner');
    this.bannerTitle = document.getElementById('banner-title');
    this.bannerDesc = document.getElementById('banner-desc');
    this.hudMode = document.getElementById('hud-mode');
    this.hudScore1 = document.getElementById('score1');
    this.hudScore2 = document.getElementById('score2');

    this.initAmbientDust();
    this.initFogParticles();
    this.initEventListeners();
    this.initNetworkListeners();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initAmbientDust() {
    this.ambientDust = [];
    for (let i = 0; i < 45; i++) {
      this.ambientDust.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() * 2.2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  initFogParticles() {
    this.fogParticles = [];
    for (let i = 0; i < 35; i++) {
      this.fogParticles.push({
        x: CANVAS_WIDTH / 2 - 110 + Math.random() * 220,
        y: Math.random() * CANVAS_HEIGHT,
        r: 30 + Math.random() * 50,
        speedY: (Math.random() - 0.5) * 0.6,
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: 0.18 + Math.random() * 0.22
      });
    }
  }

  initEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      this.keys[e.key] = true;
      this.keys[e.key.toLowerCase()] = true;
      this.mouseControl = false;

      if (['Space', 'Enter'].includes(e.code) || e.key === ' ') {
        e.preventDefault();
        this.handleBlasterInput();
      }

      if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.keys[e.key] = false;
      this.keys[e.key.toLowerCase()] = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleY = CANVAS_HEIGHT / rect.height;
      this.mouseTargetY = (e.clientY - rect.top) * scaleY;
      this.mouseControl = true;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (this.state === 'playing') {
        this.handleBlasterInput();
      }
    });

    const bindTouch = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); }, { passive: false });
      el.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(); });
      el.addEventListener('mouseup', (e) => { e.preventDefault(); onUp(); });
    };

    bindTouch('btn-touch-up', () => { this.keys['KeyW'] = true; this.keys['ArrowUp'] = true; }, () => { this.keys['KeyW'] = false; this.keys['ArrowUp'] = false; });
    bindTouch('btn-touch-down', () => { this.keys['KeyS'] = true; this.keys['ArrowDown'] = true; }, () => { this.keys['KeyS'] = false; this.keys['ArrowDown'] = false; });
    bindTouch('btn-touch-p2-up', () => { this.keys['ArrowUp'] = true; }, () => { this.keys['ArrowUp'] = false; });
    bindTouch('btn-touch-p2-down', () => { this.keys['ArrowDown'] = true; }, () => { this.keys['ArrowDown'] = false; });

    const shootBtn = document.getElementById('btn-touch-shoot');
    if (shootBtn) {
      shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.handleBlasterInput(); }, { passive: false });
      shootBtn.addEventListener('click', () => { this.handleBlasterInput(); });
    }

    const handleTouch = (e) => {
      e.preventDefault();
      if (this.state !== 'playing') return;

      const hint = document.getElementById('touch-hint');
      if (hint) hint.style.display = 'none';

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const touchX = (touch.clientX - rect.left) * scaleX;
        const touchY = (touch.clientY - rect.top) * scaleY;

        if (this.gameType === '2p_local') {
          // Lado esquerdo = P1, Lado direito = P2
          if (touchX < CANVAS_WIDTH / 2) {
            this.p1.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p1.height - 10, touchY - this.p1.height / 2));
          } else {
            this.p2.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p2.height - 10, touchY - this.p2.height / 2));
          }
        } else if (this.gameType === '4p_local') {
          // 4 Quadrantes: Superior Esquerdo (P1), Inferior Esquerdo (P3), Superior Direito (P2), Inferior Direito (P4)
          if (touchX < CANVAS_WIDTH / 2) {
            if (touchY < CANVAS_HEIGHT / 2) {
              this.p1.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p1.height - 10, touchY - this.p1.height / 2));
            } else {
              this.p3.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p3.height - 10, touchY - this.p3.height / 2));
            }
          } else {
            if (touchY < CANVAS_HEIGHT / 2) {
              this.p2.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p2.height - 10, touchY - this.p2.height / 2));
            } else {
              this.p4.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p4.height - 10, touchY - this.p4.height / 2));
            }
          }
        } else if (this.gameType === '2p_lan') {
          if (window.networkManager.role === 'host') {
            this.p1.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p1.height - 10, touchY - this.p1.height / 2));
          } else {
            this.p2.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p2.height - 10, touchY - this.p2.height / 2));
          }
        } else {
          // 1P vs CPU
          this.p1.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p1.height - 10, touchY - this.p1.height / 2));
          // Se tocar no lado direito em 1P, dispara o laser/blaster
          if (touchX > CANVAS_WIDTH / 2 && e.type === 'touchstart') {
            this.handleBlasterInput();
          }
        }
      }
    };

    this.canvas.addEventListener('touchstart', handleTouch, { passive: false });
    this.canvas.addEventListener('touchmove', handleTouch, { passive: false });
  }

  handleBlasterInput() {
    if (this.currentAction && this.currentAction.id === 'blaster' && this.state === 'playing') {
      if (this.gameType === '2p_lan') {
        if (window.networkManager.role === 'host' && this.p1.laserCooldown <= 0) {
          this.fireLaser('p1');
        } else if (window.networkManager.role === 'guest' && this.p2.laserCooldown <= 0) {
          window.networkManager.sendBlasterFire(this.p2.y);
          this.fireLaser('p2');
        }
      } else {
        if (this.p1.laserCooldown <= 0) this.fireLaser('p1');
        if (this.gameType === '2p_local' && this.p2.laserCooldown <= 0) this.fireLaser('p2');
      }
    }
  }

  initNetworkListeners() {
    const net = window.networkManager;

    net.onRoomCreated = (roomId) => {
      document.getElementById('lan-room-code').innerText = roomId;
      document.getElementById('lan-status-msg').innerText = 'Aguardando oponente entrar...';
      document.getElementById('lan-ready-btn').style.display = 'none';
    };

    net.onRoomJoined = (data) => {
      document.getElementById('lan-room-code').innerText = data.roomId;
      document.getElementById('lan-status-msg').innerText = 'Conectado! Clique em ESTOU PRONTO!';
      document.getElementById('lan-ready-btn').style.display = 'inline-block';
    };

    net.onOpponentJoined = () => {
      document.getElementById('lan-status-msg').innerText = 'Oponente conectado! Clique em ESTOU PRONTO!';
      document.getElementById('lan-ready-btn').style.display = 'inline-block';
    };

    net.onReadyStatus = (status) => {
      const p1Status = status.hostReady ? '✅ Host Pronto' : '⏳ Host esperando';
      const p2Status = status.guestReady ? '✅ Guest Pronto' : '⏳ Guest esperando';
      document.getElementById('lan-status-msg').innerText = `${p1Status} | ${p2Status}`;
    };

    net.onMatchStart = (data) => {
      document.getElementById('lan-modal').classList.remove('active');
      this.startLanMatch(data.gameMode || 'action', data.actionSubmode);
    };

    net.onRoundStart = (data) => {
      if (data.actionId) {
        this.currentAction = ACTION_MODES.find(a => a.id === data.actionId) || null;
      } else {
        this.currentAction = null;
      }
      this.score1 = data.score1;
      this.score2 = data.score2;
      this.setupActionElements();
      
      if (this.currentAction) {
        this.bannerTitle.innerText = this.currentAction.name;
        this.bannerTitle.style.color = this.currentAction.color || '#ffea00';
        this.bannerDesc.innerText = this.currentAction.desc;
        this.bannerEl.style.display = 'block';
        setTimeout(() => { this.bannerEl.style.display = 'none'; }, 2800);
      } else {
        this.bannerEl.style.display = 'none';
      }

      this.state = 'countdown';
      this.countdown = 3;
      this.countdownTimer = Date.now();
      this.updateHUD();
      window.retroAudio.playCountdown(false);
    };

    net.onOpponentMove = (data) => {
      if (data.role === 'host') this.p1.y = data.y;
      if (data.role === 'guest') this.p2.y = data.y;
    };

    net.onBlasterFired = (data) => {
      if (data.role === 'guest') this.fireLaser('p2', data.y);
      if (data.role === 'host') this.fireLaser('p1', data.y);
    };

    net.onStateSync = (state) => {
      if (net.role === 'guest') {
        this.p1.y = state.p1Y;
        if (state.balls && Array.isArray(state.balls)) {
          this.balls = state.balls.map((b, idx) => {
            const existing = (this.balls && this.balls[idx]) ? this.balls[idx] : {};
            const trail = existing.trail || [];
            trail.push({ x: b.x, y: b.y, fire: b.fireLevel, isSmash: b.isSmash, hue: b.hue });
            if (trail.length > 14) trail.shift();
            return {
              x: b.x,
              y: b.y,
              vx: b.vx || 0,
              vy: b.vy || 0,
              spin: b.spin || 0,
              radius: b.radius || this.defaultBallRadius,
              isSmash: !!b.isSmash,
              fireLevel: b.fireLevel || 0,
              hue: b.hue || 0,
              trail,
              rotation: (existing.rotation || 0) + 0.1
            };
          });
        }
        this.score1 = state.score1;
        this.score2 = state.score2;
        if (state.bumpers) this.bumpers = state.bumpers;
        if (state.kitty !== undefined) this.kitty = state.kitty;
        if (state.secretWall !== undefined) this.secretWall = state.secretWall;
        if (state.gravityWells) this.gravityWells = state.gravityWells;
        if (state.portals) this.portals = state.portals;
        if (state.asteroids) this.asteroids = state.asteroids;
        if (state.shields1) this.shields1 = state.shields1;
        if (state.shields2) this.shields2 = state.shields2;
        if (state.blackHole) this.blackHole = state.blackHole;
        if (state.magnets) this.magnets = state.magnets;
        this.p1.hitsTaken = state.p1Hits || 0;
        this.p2.hitsTaken = state.p2Hits || 0;
        this.p1.powerMeter = state.p1Power || 0;
        this.p2.powerMeter = state.p2Power || 0;
        this.updateHUD();
      }
    };

    net.onRoundEvent = (data) => {
      this.score1 = data.score1;
      this.score2 = data.score2;
      this.updateHUD();
      if (data.event === 'point') {
        window.retroAudio.playScore(data.score1 > this.score1);
        this.triggerGoalEffects(data.score1 > this.score1 ? 1 : 2);
      }
    };

    net.onOpponentLeft = (msg) => {
      alert(msg || 'Oponente desconectou.');
      this.returnToMenu();
    };

    net.onError = (msg) => {
      alert(msg);
    };
  }

  shuffleActionModes() {
    this.actionSequence = [...ACTION_MODES];
    for (let i = this.actionSequence.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.actionSequence[i], this.actionSequence[j]] = [this.actionSequence[j], this.actionSequence[i]];
    }
  }

  startGame(type, mode = 'action', skill = 'rookie') {
    this.gameType = type;
    this.gameMode = mode;
    this.aiSkill = skill;
    this.score1 = 0;
    this.score2 = 0;
    this.currentActionIndex = 0;
    this.shuffleActionModes();

    this.p1.name = 'PLAYER 1';
    this.p2.name = this.gameType === '1p' ? `CPU (${skill.toUpperCase()})` : 'PLAYER 2';

    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    document.getElementById('game-over-screen').classList.remove('active');

    const p2Touch = document.getElementById('p2-touch-group');
    if (p2Touch) p2Touch.style.display = this.gameType === '2p_local' ? 'flex' : 'none';

    const shootBtn = document.getElementById('btn-touch-shoot');
    if (shootBtn) shootBtn.style.display = this.gameMode === 'action' ? 'flex' : 'none';

    this.startRound();
  }

  startLanMatch(mode = 'action', actionSubmode) {
    this.gameType = '2p_lan';
    this.gameMode = mode;
    this.score1 = 0;
    this.score2 = 0;
    this.currentActionIndex = 0;
    this.shuffleActionModes();

    const isHost = window.networkManager.role === 'host';
    this.p1.name = isHost ? 'VOCÊ (P1)' : 'OPONENTE (P1)';
    this.p2.name = isHost ? 'OPONENTE (P2)' : 'VOCÊ (P2)';

    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    document.getElementById('game-over-screen').classList.remove('active');

    const shootBtn = document.getElementById('btn-touch-shoot');
    if (shootBtn) shootBtn.style.display = this.gameMode === 'action' ? 'flex' : 'none';

    if (isHost) {
      this.startRound();
    }
  }

  startRound() {
    this.state = 'countdown';
    this.countdown = 3;
    this.countdownTimer = Date.now();

    if (this.gameType === '4p_local' || this.gameType === '4p_lan') {
      this.p1.x = 24;
      this.p1.y = 120;
      this.p3.x = 85;
      this.p3.y = 360;
      this.p2.x = CANVAS_WIDTH - 24 - 14;
      this.p2.y = 120;
      this.p4.x = CANVAS_WIDTH - 85 - 14;
      this.p4.y = 360;
      this.p3.hitsTaken = 0;
      this.p4.hitsTaken = 0;
      this.p3.powerMeter = 0;
      this.p4.powerMeter = 0;
    } else {
      this.p1.x = 30;
      this.p1.y = CANVAS_HEIGHT / 2 - this.p1.height / 2;
      this.p2.x = CANVAS_WIDTH - 30 - 14;
      this.p2.y = CANVAS_HEIGHT / 2 - this.p2.height / 2;
    }

    this.p1.hitsTaken = 0;
    this.p2.hitsTaken = 0;
    this.multiballScore1 = 0;
    this.multiballScore2 = 0;
    this.lasers = [];
    this.particles = [];
    this.shockwaves = [];
    this.floatTexts = [];

    if (this.gameMode === 'action') {
      if (this.actionSequence.length === 0) this.shuffleActionModes();
      this.currentAction = this.actionSequence[this.currentActionIndex % this.actionSequence.length];
      this.currentActionIndex++;
      this.setupActionElements();
      
      this.bannerTitle.innerText = this.currentAction.name;
      this.bannerTitle.style.color = this.currentAction.color || '#ffea00';
      this.bannerDesc.innerText = this.currentAction.desc;
      this.bannerEl.style.display = 'block';
      setTimeout(() => {
        this.bannerEl.style.display = 'none';
      }, 2800);

      if (this.gameType === '2p_lan' && window.networkManager.role === 'host') {
        window.networkManager.sendRoundStart(this.currentAction.id, this.score1, this.score2);
      }
    } else {
      this.currentAction = null;
      this.p1.height = this.p1.baseHeight;
      this.p2.height = this.p2.baseHeight;
      this.bumpers = [];
      this.kitty = null;
      this.gravityWells = [];
      this.secretWall = null;
      this.portals = [];
      this.asteroids = [];
      this.bannerEl.style.display = 'none';

      if (this.gameType === '2p_lan' && window.networkManager.role === 'host') {
        window.networkManager.sendRoundStart(null, this.score1, this.score2);
      }
    }

    this.spawnBalls();
    this.updateHUD();
    window.retroAudio.playCountdown(false);
  }

  setupActionElements() {
    if (!this.currentAction) return;
    const act = this.currentAction.id;
    this.bumpers = [];
    this.kitty = null;
    this.gravityWells = [];
    this.secretWall = null;
    this.portals = [];
    this.asteroids = [];
    this.lightningBolts = [];

    this.p1.height = this.p1.baseHeight;
    this.p2.height = this.p2.baseHeight;

    this.shields1 = [];
    this.shields2 = [];
    this.blackHole = null;
    this.magnets = [];
    this.turrets = [];
    this.turretLasers = [];

    if (act === 'big_ball') {
      this.p1.height = this.p1.baseHeight * 0.5;
      this.p2.height = this.p2.baseHeight * 0.5;
    } else if (act === 'shield_generator') {
      this.shields1 = [
        { x: 14, y: 80, w: 8, h: 120, active: true },
        { x: 14, y: 240, w: 8, h: 120, active: true },
        { x: 14, y: 400, w: 8, h: 120, active: true }
      ];
      this.shields2 = [
        { x: CANVAS_WIDTH - 22, y: 80, w: 8, h: 120, active: true },
        { x: CANVAS_WIDTH - 22, y: 240, w: 8, h: 120, active: true },
        { x: CANVAS_WIDTH - 22, y: 400, w: 8, h: 120, active: true }
      ];
    } else if (act === 'black_hole') {
      this.blackHole = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        r: 32,
        rot: 0,
        cooldown: 0,
        pulse: 0
      };
    } else if (act === 'magnet_field') {
      this.magnets = [
        { x: CANVAS_WIDTH / 2 - 130, y: CANVAS_HEIGHT / 2, type: 'repel', r: 32, rot: 0, color: '#00f0ff' },
        { x: CANVAS_WIDTH / 2 + 130, y: CANVAS_HEIGHT / 2, type: 'attract', r: 32, rot: 0, color: '#ff0055' }
      ];
    } else if (act === 'paddle_morph') {
      this.p1.height = 135;
      this.p2.height = 135;
    } else if (act === 'laser_turrets') {
      this.turrets = [
        { x: CANVAS_WIDTH / 2, y: 16, dirY: 1, timer: 40, rot: 0 },
        { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 16, dirY: -1, timer: 100, rot: Math.PI }
      ];
    } else if (act === 'bumper_ball') {
      const cx = CANVAS_WIDTH / 2;
      const cy = CANVAS_HEIGHT / 2;
      this.bumpers = [
        { x: cx, y: cy - 135, r: 24, pulse: 0, cooldown: 0 },
        { x: cx, y: cy + 135, r: 24, pulse: 0, cooldown: 0 },
        { x: cx, y: cy, r: 22, pulse: 0, cooldown: 0 }
      ];
    } else if (act === 'gravity_well') {
      this.gravityWells = [
        { x: CANVAS_WIDTH / 2 - 100, y: CANVAS_HEIGHT / 2 - 80, r: 42, angle: 0, cooldown: 0 },
        { x: CANVAS_WIDTH / 2 + 100, y: CANVAS_HEIGHT / 2 + 80, r: 42, angle: Math.PI, cooldown: 0 }
      ];
    } else if (act === 'portals') {
      this.portals = [
        { x: CANVAS_WIDTH / 2 - 110, y: 160, r: 30, color: '#00d4ff', label: 'PORTAL A', rot: 0, cooldown: 0 },
        { x: CANVAS_WIDTH / 2 + 110, y: 440, r: 30, color: '#ff7700', label: 'PORTAL B', rot: 0, cooldown: 0 }
      ];
    } else if (act === 'asteroid_belt') {
      this.asteroids = [
        { x: CANVAS_WIDTH / 2 - 60, y: 180, r: 22, hp: 2, rot: 0, vx: 0.3, vy: 0.4 },
        { x: CANVAS_WIDTH / 2 + 60, y: 320, r: 25, hp: 2, rot: 0, vx: -0.4, vy: -0.3 },
        { x: CANVAS_WIDTH / 2, y: 460, r: 20, hp: 2, rot: 0, vx: 0.5, vy: -0.2 }
      ];
    } else if (act === 'secret_wall') {
      this.secretWall = {
        x: CANVAS_WIDTH / 2 - 5,
        y: 120,
        width: 10,
        height: 360,
        flash: 0,
        pulseAnim: 0
      };
    } else if (act === 'kitty') {
      this.kitty = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        vx: 1.8,
        vy: 1.4,
        width: 36,
        height: 30,
        frame: 0,
        blink: 0,
        surprised: 0,
        p1Hits: 0,
        p2Hits: 0
      };
    }
  }

  spawnBalls() {
    this.balls = [];
    const isBig = this.currentAction && this.currentAction.id === 'big_ball';
    const isSpeed = this.currentAction && this.currentAction.id === 'speed_frenzy';
    const radius = isBig ? 26 : this.defaultBallRadius;
    const baseSpeed = isSpeed ? 5.5 : 3.8; // Começa suave e agradável

    const createBall = (dirX = 1, offsetY = 0, hue = 0) => {
      const angle = (Math.random() * 0.5 - 0.25);
      return {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2 + offsetY,
        vx: dirX * baseSpeed * Math.cos(angle),
        vy: baseSpeed * Math.sin(angle),
        spin: 0,
        radius,
        speed: baseSpeed,
        hitCount: 0,
        trail: [],
        fireLevel: 0,
        isSmash: false,
        hue,
        rotation: 0,
        lastHitter: null
      };
    };

    if (this.currentAction && this.currentAction.id === 'multiball') {
      this.balls.push(createBall(1, -70, 180));
      this.balls.push(createBall(-1, 0, 320));
      this.balls.push(createBall(1, 70, 60));
    } else {
      const dir = Math.random() > 0.5 ? 1 : -1;
      this.balls.push(createBall(dir, 0, 0));
    }
  }

  fireLaser(shooterRole, explicitY = null) {
    window.retroAudio.playBlaster();
    const isP1 = shooterRole === 'p1';
    const paddle = isP1 ? this.p1 : this.p2;
    const y = explicitY !== null ? explicitY + paddle.height / 2 : paddle.y + paddle.height / 2;

    paddle.muzzleFlash = 1.0;
    this.lasers.push({
      x: isP1 ? paddle.x + paddle.width + 6 : paddle.x - 22,
      y,
      vx: isP1 ? 16 : -16,
      owner: shooterRole,
      width: 22,
      height: 5,
      glow: 1.0
    });

    paddle.laserCooldown = 24;
    this.createHitParticles(isP1 ? paddle.x + paddle.width : paddle.x, y, isP1 ? '#00f0ff' : '#ff0055', 6);
  }

  addFloatText(x, y, text, color = '#ffea00') {
    this.floatTexts.push({
      x, y, text, color,
      vy: -1.5,
      alpha: 1.0
    });
  }

  updateHUD() {
    this.hudScore1.innerText = this.score1;
    this.hudScore2.innerText = this.score2;
    
    if (this.gameMode === 'classic') {
      this.hudMode.innerText = 'CLASSIC';
    } else if (this.currentAction) {
      let subInfo = this.currentAction.name;
      if (this.currentAction.id === 'kitty' && this.kitty) {
        subInfo += ` | 🐱 P1: ${this.kitty.p1Hits}/2 - P2: ${this.kitty.p2Hits}/2`;
      } else if (this.currentAction.id === 'blaster') {
        subInfo += ` | 🛡️ P1: ${2 - this.p1.hitsTaken}/2 - P2: ${2 - this.p2.hitsTaken}/2`;
      } else if (this.currentAction.id === 'multiball') {
        subInfo += ` | ⚪ Gols: ${this.multiballScore1} - ${this.multiballScore2} (Meta: 2)`;
      }
      this.hudMode.innerText = subInfo;
    }
  }

  loop() {
    try {
      this.update();
      this.render();
    } catch (err) {
      console.warn('Loop safe catch:', err);
    }
    requestAnimationFrame(this.loop);
  }

  update() {
    this.gridOffset = (this.gridOffset + 1.2) % 30;

    this.ambientDust.forEach(d => {
      d.x += d.speedX;
      d.y += d.speedY;
      if (d.x < 0) d.x = CANVAS_WIDTH;
      if (d.x > CANVAS_WIDTH) d.x = 0;
      if (d.y < 0) d.y = CANVAS_HEIGHT;
      if (d.y > CANVAS_HEIGHT) d.y = 0;
    });

    if (this.screenShake > 0) this.screenShake -= 0.5;

    if (this.p1.muzzleFlash > 0) this.p1.muzzleFlash -= 0.1;
    if (this.p2.muzzleFlash > 0) this.p2.muzzleFlash -= 0.1;
    this.p1.scaleX += (1 - this.p1.scaleX) * 0.15;
    this.p1.scaleY += (1 - this.p1.scaleY) * 0.15;
    this.p2.scaleX += (1 - this.p2.scaleX) * 0.15;
    this.p2.scaleY += (1 - this.p2.scaleY) * 0.15;

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
          this.state = 'playing';
        }
      }
      return;
    }

    if (this.state !== 'playing') {
      this.updateConfetti();
      return;
    }

    if (this.p1.laserCooldown > 0) this.p1.laserCooldown--;
    if (this.p2.laserCooldown > 0) this.p2.laserCooldown--;

    this.updatePaddles();

    const isHostOrLocal = this.gameType !== '2p_lan' || window.networkManager.role === 'host';
    if (isHostOrLocal) {
      this.updatePhysics();

      if (this.gameType === '2p_lan') {
        const now = Date.now();
        if (!this.lastSyncTime || now - this.lastSyncTime >= 32) {
          this.lastSyncTime = now;
          window.networkManager.sendGameState({
            p1Y: Math.round(this.p1.y),
            balls: this.balls.map(b => ({
              x: Math.round(b.x * 10) / 10,
              y: Math.round(b.y * 10) / 10,
              vx: Math.round(b.vx * 100) / 100,
              vy: Math.round(b.vy * 100) / 100,
              spin: Math.round((b.spin || 0) * 100) / 100,
              isSmash: !!b.isSmash,
              radius: b.radius,
              fireLevel: b.fireLevel || 0,
              hue: b.hue || 0
            })),
            score1: this.score1,
            score2: this.score2,
            bumpers: this.bumpers,
            kitty: this.kitty,
            secretWall: this.secretWall,
            gravityWells: this.gravityWells,
            portals: this.portals,
            asteroids: this.asteroids,
            shields1: this.shields1,
            shields2: this.shields2,
            blackHole: this.blackHole,
            magnets: this.magnets,
            p1Hits: this.p1.hitsTaken,
            p2Hits: this.p2.hitsTaken,
            p1Power: this.p1.powerMeter,
            p2Power: this.p2.powerMeter
          });
        }
      }
    }

    this.updateLasers();
    this.updateParticles();
    this.updateShockwaves();
  }

  updatePaddles() {
    this.p1.prevY = this.p1.y;
    this.p2.prevY = this.p2.y;

    const isLan = this.gameType === '2p_lan';
    const isHost = isLan && window.networkManager.role === 'host';
    const isGuest = isLan && window.networkManager.role === 'guest';

    if (!isGuest) {
      const p1Up = this.keys['KeyW'] || this.keys['w'] || this.keys['W'] || (this.gameType === '1p' && (this.keys['ArrowUp'] || this.keys['Up']));
      const p1Down = this.keys['KeyS'] || this.keys['s'] || this.keys['S'] || (this.gameType === '1p' && (this.keys['ArrowDown'] || this.keys['Down']));

      if (p1Up) this.p1.y -= this.p1.speed;
      if (p1Down) this.p1.y += this.p1.speed;

      if (this.mouseControl && this.mouseTargetY !== null && (this.gameType === '1p' || isHost)) {
        const targetY = this.mouseTargetY - this.p1.height / 2;
        this.p1.y += (targetY - this.p1.y) * 0.35;
      }

      this.p1.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p1.height - 10, this.p1.y));
      this.p1.vy = this.p1.y - this.p1.prevY;

      if (isHost) {
        window.networkManager.sendPaddleMove(this.p1.y, this.p1.vy);
      }
    }

    if (this.gameType === '2p_local') {
      const p2Up = this.keys['ArrowUp'] || this.keys['Up'];
      const p2Down = this.keys['ArrowDown'] || this.keys['Down'];
      if (p2Up) this.p2.y -= this.p2.speed;
      if (p2Down) this.p2.y += this.p2.speed;
      this.p2.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p2.height - 10, this.p2.y));
      this.p2.vy = this.p2.y - this.p2.prevY;
    } else if (this.gameType === '4p_local') {
      const p2Up = this.keys['ArrowUp'] || this.keys['Up'];
      const p2Down = this.keys['ArrowDown'] || this.keys['Down'];
      if (p2Up) this.p2.y -= this.p2.speed;
      if (p2Down) this.p2.y += this.p2.speed;
      this.p2.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p2.height - 10, this.p2.y));
      this.p2.vy = this.p2.y - this.p2.prevY;

      const p3Up = this.keys['KeyF'] || this.keys['f'] || this.keys['F'] || this.keys['KeyA'] || this.keys['a'];
      const p3Down = this.keys['KeyV'] || this.keys['v'] || this.keys['V'] || this.keys['KeyZ'] || this.keys['z'];
      if (p3Up) this.p3.y -= this.p3.speed;
      if (p3Down) this.p3.y += this.p3.speed;
      this.p3.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p3.height - 10, this.p3.y));
      this.p3.vy = this.p3.y - this.p3.prevY;

      const p4Up = this.keys['KeyI'] || this.keys['i'] || this.keys['I'] || this.keys['Numpad8'] || this.keys['KeyO'] || this.keys['o'];
      const p4Down = this.keys['KeyK'] || this.keys['k'] || this.keys['K'] || this.keys['Numpad2'] || this.keys['KeyL'] || this.keys['l'];
      if (p4Up) this.p4.y -= this.p4.speed;
      if (p4Down) this.p4.y += this.p4.speed;
      this.p4.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p4.height - 10, this.p4.y));
      this.p4.vy = this.p4.y - this.p4.prevY;
    } else if (isGuest) {
      const guestUp = this.keys['ArrowUp'] || this.keys['Up'] || this.keys['KeyW'] || this.keys['w'] || this.keys['W'];
      const guestDown = this.keys['ArrowDown'] || this.keys['Down'] || this.keys['KeyS'] || this.keys['s'] || this.keys['S'];
      
      if (guestUp) this.p2.y -= this.p2.speed;
      if (guestDown) this.p2.y += this.p2.speed;

      if (this.mouseControl && this.mouseTargetY !== null) {
        const targetY = this.mouseTargetY - this.p2.height / 2;
        this.p2.y += (targetY - this.p2.y) * 0.35;
      }

      this.p2.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p2.height - 10, this.p2.y));
      this.p2.vy = this.p2.y - this.p2.prevY;
      window.networkManager.sendPaddleMove(this.p2.y, this.p2.vy);
    } else if (this.gameType === '1p') {
      this.updateAI();
    }
  }

  updateAI() {
    if (this.balls.length === 0) return;
    let targetBall = this.balls[0];
    for (let b of this.balls) {
      if (b.vx > 0 && b.x > targetBall.x) targetBall = b;
    }

    let speed = 4.8;
    let errorMargin = 16;
    let targetY = targetBall.y;

    if (this.aiSkill === 'rookie') {
      speed = 4.4;
      errorMargin = 18;
      targetY = targetBall.y + Math.sin(Date.now() * 0.003) * 20;
    } else if (this.aiSkill === 'veteran') {
      speed = 5.8;
      errorMargin = 10;
      if (targetBall.vx > 0) {
        const time = (this.p2.x - targetBall.x) / (targetBall.vx || 1);
        targetY = targetBall.y + targetBall.vy * Math.min(time, 40);
      }
    } else if (this.aiSkill === 'ace') {
      speed = 7.2;
      errorMargin = 4;
      if (targetBall.vx > 0) {
        const timeToReach = (this.p2.x - targetBall.x) / (targetBall.vx || 1);
        let predict = targetBall.y + targetBall.vy * timeToReach;
        while (predict < 8 || predict > CANVAS_HEIGHT - 8) {
          if (predict < 8) predict = 16 - predict;
          if (predict > CANVAS_HEIGHT - 8) predict = 2 * (CANVAS_HEIGHT - 8) - predict;
        }
        targetY = predict + (targetBall.y > CANVAS_HEIGHT / 2 ? -16 : 16);
      }

      if (this.currentAction && this.currentAction.id === 'blaster' && this.p2.laserCooldown <= 0) {
        if (Math.abs(this.p2.y - this.p1.y) < 70 && Math.random() < 0.15) {
          this.fireLaser('p2');
        }
      }
    }

    const paddleCenter = this.p2.y + this.p2.height / 2;
    if (paddleCenter < targetY - errorMargin) {
      this.p2.y += speed;
    } else if (paddleCenter > targetY + errorMargin) {
      this.p2.y -= speed;
    }

    this.p2.y = Math.max(10, Math.min(CANVAS_HEIGHT - this.p2.height - 10, this.p2.y));
    this.p2.vy = this.p2.y - this.p2.prevY;
  }

  updatePhysics() {
    const act = this.currentAction ? this.currentAction.id : null;

    if (this.kitty) {
      this.kitty.x += this.kitty.vx;
      this.kitty.y += this.kitty.vy;
      if (this.kitty.x < CANVAS_WIDTH / 2 - 130 || this.kitty.x > CANVAS_WIDTH / 2 + 130) this.kitty.vx *= -1;
      if (this.kitty.y < 80 || this.kitty.y > CANVAS_HEIGHT - 80) this.kitty.vy *= -1;
      this.kitty.frame += 0.12;
      this.kitty.blink = Math.sin(this.kitty.frame * 0.5) > 0.95 ? 1 : 0;
      if (this.kitty.surprised > 0) this.kitty.surprised -= 0.05;
    }

    this.bumpers.forEach(b => {
      if (b.pulse > 0) b.pulse -= 0.04;
      b.rot += 0.02;
    });

    if (act === 'portals') {
      this.portals.forEach(p => {
        p.rot += 0.04;
        if (p.cooldown > 0) p.cooldown--;
      });
    }

    if (act === 'gravity_well') {
      this.gravityWells.forEach(gw => {
        if (gw.cooldown > 0) gw.cooldown--;
      });
    }

    if (act === 'asteroid_belt') {
      this.asteroids.forEach(ast => {
        ast.x += ast.vx;
        ast.y += ast.vy;
        ast.rot += 0.02;
        if (ast.x < CANVAS_WIDTH / 2 - 110 || ast.x > CANVAS_WIDTH / 2 + 110) ast.vx *= -1;
        if (ast.y < 80 || ast.y > CANVAS_HEIGHT - 80) ast.vy *= -1;
      });
    }

    if (act === 'fog_zone') {
      this.fogParticles.forEach(fp => {
        fp.x += fp.speedX;
        fp.y += fp.speedY;
        if (fp.x < CANVAS_WIDTH / 2 - 120 || fp.x > CANVAS_WIDTH / 2 + 120) fp.speedX *= -1;
        if (fp.y < 0 || fp.y > CANVAS_HEIGHT) fp.speedY *= -1;
      });
    }

    if (this.secretWall) {
      this.secretWall.pulseAnim += 0.05;
      if (this.secretWall.flash > 0) this.secretWall.flash -= 0.04;
    }

    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];
      ball.rotation += 0.1;

      // Efeito de Curva Spin na trajetória
      if (ball.spin !== 0) {
        ball.vy += ball.spin;
        ball.spin *= 0.98;
      }

      // 🌌 POÇO GRAVITACIONAL COM ESTILINGUE ORBITAL (IMUNE A LOOPS)
      if (act === 'gravity_well' && this.gravityWells.length > 0) {
        this.gravityWells.forEach(well => {
          well.angle += 0.07;
          const dx = well.x - ball.x;
          const dy = well.y - ball.y;
          const dist = Math.hypot(dx, dy);

          // 1. 🚀 ESTILINGUE INSTANTÂNEO ao chegar perto do poço (< 75px)
          if (dist < 75 && well.cooldown <= 0) {
            well.cooldown = 120; // 2 segundos de imunidade para atravessar a mesa
            const forwardDir = ball.vx >= 0 ? 1 : -1;
            const boostSpeed = Math.max(8.5, Math.hypot(ball.vx, ball.vy) * 1.15);
            const slingAngle = (Math.random() * 0.8 - 0.4); // Desvio cósmico controlado

            ball.vx = forwardDir * boostSpeed * Math.cos(slingAngle);
            ball.vy = boostSpeed * Math.sin(slingAngle) + (dy < 0 ? 2 : -2);

            this.screenShake = 6;
            this.addShockwave(well.x, well.y, '#b026ff', 60);
            this.createHitParticles(well.x, well.y, '#e066ff', 20);
            window.retroAudio.playGravityPulse();
            this.addFloatText(well.x, well.y - 25, '🌌 SLINGSHOT!', '#b026ff');
          }
          // 2. Curvatura suave apenas no eixo Y (não reduz a velocidade frontal vx)
          else if (dist >= 75 && dist < 220 && well.cooldown <= 0) {
            const curveForce = 0.22 * (1 - dist / 220);
            ball.vy += (dy > 0 ? 1 : -1) * curveForce;

            if (Math.random() < 0.2) {
              this.particles.push({
                x: ball.x,
                y: ball.y,
                vx: (Math.random() - 0.5) * 2,
                vy: (dy / dist) * 2,
                life: 0.4,
                color: '#b026ff',
                size: 2.5
              });
            }
          }
        });
      }

      // 🌀 PORTAIS QUÂNTICOS
      if (act === 'portals' && this.portals.length >= 2) {
        const pA = this.portals[0];
        const pB = this.portals[1];
        
        const distA = Math.hypot(ball.x - pA.x, ball.y - pA.y);
        const distB = Math.hypot(ball.x - pB.x, ball.y - pB.y);

        if (distA < pA.r && pA.cooldown <= 0) {
          ball.x = pB.x + (ball.vx > 0 ? 30 : -30);
          ball.y = pB.y;
          pA.cooldown = 35;
          pB.cooldown = 35;
          window.retroAudio.playPortal();
          this.screenShake = 4;
          this.addShockwave(pA.x, pA.y, pA.color, 45);
          this.addShockwave(pB.x, pB.y, pB.color, 45);
          this.addFloatText(pB.x, pB.y, '🌀 WARP!', '#00d4ff');
        } else if (distB < pB.r && pB.cooldown <= 0) {
          ball.x = pA.x + (ball.vx > 0 ? 30 : -30);
          ball.y = pA.y;
          pA.cooldown = 35;
          pB.cooldown = 35;
          window.retroAudio.playPortal();
          this.screenShake = 4;
          this.addShockwave(pA.x, pA.y, pA.color, 45);
          this.addShockwave(pB.x, pB.y, pB.color, 45);
          this.addFloatText(pA.x, pA.y, '🌀 WARP!', '#ff7700');
        }
      }

      // ⏳ CAMPO TEMPORAL (BULLET TIME - SUAVE & FLUIDO)
      if (act === 'time_warp') {
        const cx = CANVAS_WIDTH / 2;
        const inField = Math.abs(ball.x - cx) < 95;

        if (inField) {
          if (!ball.inTimeWarp) {
            ball.inTimeWarp = true;
            ball.origVx = ball.vx;
            ball.origVy = ball.vy;
            ball.vx *= 0.38;
            ball.vy *= 0.38;
            window.retroAudio.playTimeWarp();
            this.addFloatText(ball.x, ball.y - 20, '⏳ SLOW-MO', '#00ffaa');
          }
          if (Math.random() < 0.25) {
            this.particles.push({
              x: ball.x,
              y: ball.y,
              vx: (Math.random() - 0.5) * 1.2,
              vy: (Math.random() - 0.5) * 1.2,
              life: 0.45,
              color: '#00ffaa',
              size: 2.5
            });
          }
        } else if (ball.inTimeWarp) {
          ball.inTimeWarp = false;
          ball.vx = (ball.origVx || ball.vx * 2.6);
          ball.vy = (ball.origVy || ball.vy * 2.6);
          this.addFloatText(ball.x, ball.y - 15, '⚡ TIME BURST!', '#00ffaa');
          this.addShockwave(ball.x, ball.y, '#00ffaa', 35);
        }
      }

      // ⚡ TEMPESTADE ELÉTRICA (10.000V)
      if (act === 'lightning_storm') {
        if (Math.random() < 0.05) {
          window.retroAudio.playLightningZap();
          ball.vy += (Math.random() - 0.5) * 3;
          this.createHitParticles(ball.x, ball.y, '#ffff00', 8);
        }
      }

      // ☄️ ASTEROIDES
      if (act === 'asteroid_belt') {
        this.asteroids.forEach(ast => {
          const dx = ball.x - ast.x;
          const dy = ball.y - ast.y;
          const dist = Math.hypot(dx, dy);
          if (dist < ast.r + ball.radius) {
            const nx = dx / dist;
            const ny = dy / dist;
            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx = (ball.vx - 2 * dot * nx) * 1.05;
            ball.vy = (ball.vy - 2 * dot * ny) * 1.05;
            ast.hp--;
            window.retroAudio.playWallBounce();
            this.createHitParticles(ast.x, ast.y, '#d488ff', 12);
            this.addShockwave(ast.x, ast.y, '#d488ff', 35);
          }
        });
      }

      // 🔥 BOLA DE FOGO
      if (act === 'fireball') {
        const cx = CANVAS_WIDTH / 2;
        const cy = CANVAS_HEIGHT / 2;
        const distCenter = Math.hypot(ball.x - cx, ball.y - cy);
        if (distCenter < 70) {
          ball.fireLevel = Math.min(4, ball.fireLevel + 0.1);
          ball.vx *= 1.02;
          ball.vy *= 1.02;
          this.createFlameParticles(ball.x, ball.y);
          if (Math.random() < 0.2) window.retroAudio.playFireball();
        }
      }

      // 🌌 BURACO NEGRO SUPERMASSIVO
      if (act === 'black_hole' && this.blackHole) {
        this.blackHole.rot += 0.08;
        if (this.blackHole.cooldown > 0) this.blackHole.cooldown--;
        const dx = this.blackHole.x - ball.x;
        const dy = this.blackHole.y - ball.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 48 && this.blackHole.cooldown <= 0) {
          this.blackHole.cooldown = 90;
          const boostSpeed = Math.max(7.5, Math.hypot(ball.vx, ball.vy) * 1.15);
          const angle = Math.atan2(ball.vy, ball.vx) + (Math.random() * 0.8 - 0.4);
          ball.vx = boostSpeed * Math.cos(angle);
          ball.vy = boostSpeed * Math.sin(angle);
          this.screenShake = 7;
          window.retroAudio.playBlackHole();
          this.createHitParticles(ball.x, ball.y, '#b026ff', 24);
          this.addShockwave(this.blackHole.x, this.blackHole.y, '#b026ff', 55);
          this.addFloatText(ball.x, ball.y - 20, '🌌 EVENT HORIZON!', '#b026ff');
        } else if (dist < 200 && this.blackHole.cooldown <= 0) {
          const force = 0.25 * (1 - dist / 200);
          ball.vx += (dx / dist) * force;
          ball.vy += (dy / dist) * force;
        }
      }

      // 🧲 CAMPO ELETROMAGNÉTICO
      if (act === 'magnet_field' && this.magnets.length >= 2) {
        this.magnets.forEach(m => {
          m.rot += 0.04;
          const dx = m.x - ball.x;
          const dy = m.y - ball.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            const force = (m.type === 'attract' ? 0.30 : -0.30) * (1 - dist / 150);
            ball.vx += (dx / dist) * force;
            ball.vy += (dy / dist) * force;
            if (Math.random() < 0.1) {
              this.particles.push({
                x: ball.x,
                y: ball.y,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                life: 0.3,
                color: m.color,
                size: 2
              });
            }
          }
        });
      }

      // 🛡️ GERADOR DE ESCUDOS HOLOGRÁFICOS
      if (act === 'shield_generator') {
        this.shields1.forEach(s => {
          if (s.active && ball.x - ball.radius <= s.x + s.w && ball.x + ball.radius >= s.x && ball.y >= s.y && ball.y <= s.y + s.h && ball.vx < 0) {
            s.active = false;
            ball.x = s.x + s.w + ball.radius;
            ball.vx = Math.abs(ball.vx) * 1.05;
            window.retroAudio.playShieldBreak();
            this.screenShake = 5;
            this.createHitParticles(ball.x, ball.y, '#00e5ff', 22);
            this.addShockwave(s.x + s.w / 2, s.y + s.h / 2, '#00e5ff', 45);
            this.addFloatText(ball.x, ball.y - 15, '🛡️ ESCUDO P1 QUEBRADO!', '#00e5ff');
          }
        });
        this.shields2.forEach(s => {
          if (s.active && ball.x + ball.radius >= s.x && ball.x - ball.radius <= s.x + s.w && ball.y >= s.y && ball.y <= s.y + s.h && ball.vx > 0) {
            s.active = false;
            ball.x = s.x - ball.radius;
            ball.vx = -Math.abs(ball.vx) * 1.05;
            window.retroAudio.playShieldBreak();
            this.screenShake = 5;
            this.createHitParticles(ball.x, ball.y, '#ff007f', 22);
            this.addShockwave(s.x + s.w / 2, s.y + s.h / 2, '#ff007f', 45);
            this.addFloatText(ball.x, ball.y - 15, '🛡️ ESCUDO P2 QUEBRADO!', '#ff007f');
          }
        });
      }

      ball.x += ball.vx;
      ball.y += ball.vy;

      ball.trail.push({ x: ball.x, y: ball.y, fire: ball.fireLevel, isSmash: ball.isSmash, hue: ball.hue });
      if (ball.trail.length > 14) ball.trail.shift();

      const inFog = act === 'fog_zone' && Math.abs(ball.x - CANVAS_WIDTH / 2) < 110;

      // Paredes Superior e Inferior (Quique Preciso & Simétrico)
      const topBound = 8;
      const bottomBound = CANVAS_HEIGHT - 8;

      if (ball.y - ball.radius <= topBound) {
        ball.y = topBound + ball.radius;
        ball.vy = Math.abs(ball.vy);
        if (ball.spin) ball.spin *= 0.6;
        if (!inFog) window.retroAudio.playWallBounce();
        this.createHitParticles(ball.x, ball.y, '#ffffff', 8);
        this.addShockwave(ball.x, ball.y, '#00e5ff', 25);
      } else if (ball.y + ball.radius >= bottomBound) {
        ball.y = bottomBound - ball.radius;
        ball.vy = -Math.abs(ball.vy);
        if (ball.spin) ball.spin *= 0.6;
        if (!inFog) window.retroAudio.playWallBounce();
        this.createHitParticles(ball.x, ball.y, '#ffffff', 8);
        this.addShockwave(ball.x, ball.y, '#00e5ff', 25);
      }

      // Parede Secreta
      if (act === 'secret_wall' && this.secretWall) {
        const sw = this.secretWall;
        if (
          ball.x + ball.radius >= sw.x &&
          ball.x - ball.radius <= sw.x + sw.width &&
          ball.y + ball.radius >= sw.y &&
          ball.y - ball.radius <= sw.y + sw.height
        ) {
          if (ball.vx > 0) {
            ball.x = sw.x - ball.radius;
            ball.vx = -Math.abs(ball.vx);
          } else {
            ball.x = sw.x + sw.width + ball.radius;
            ball.vx = Math.abs(ball.vx);
          }
          sw.flash = 1.0;
          this.screenShake = 4;
          window.retroAudio.playPaddleHit();
          this.createHitParticles(ball.x, ball.y, '#ff007f', 16);
          this.addShockwave(ball.x, ball.y, '#ff007f', 35);
        }
      }

      // Bumpers (Arcade Pinball - Fluido, Sem Armadilhas e com Disparo Dinâmico)
      if (act === 'bumper_ball') {
        this.bumpers.forEach(b => {
          if (b.cooldown > 0) b.cooldown--;
          const dx = ball.x - b.x;
          const dy = ball.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < b.r + ball.radius && (!b.cooldown || b.cooldown <= 0)) {
            b.cooldown = 18;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            ball.x = b.x + nx * (b.r + ball.radius + 3);
            ball.y = b.y + ny * (b.r + ball.radius + 3);
            const currentSpeed = Math.min(8.5, Math.hypot(ball.vx, ball.vy) * 1.06 + 0.4);
            const bounceAngle = Math.atan2(ny, nx);
            ball.vx = currentSpeed * Math.cos(bounceAngle);
            ball.vy = currentSpeed * Math.sin(bounceAngle);
            b.pulse = 1.0;
            this.screenShake = 4;
            window.retroAudio.playBumperHit();
            this.createHitParticles(ball.x, ball.y, '#00ffaa', 14);
            this.addShockwave(b.x, b.y, '#00ffaa', 40);
            this.addFloatText(b.x, b.y - 20, '⚡ PINBALL!', '#00ffaa');
          }
        });
      }

      // Gatinho
      if (act === 'kitty' && this.kitty) {
        const k = this.kitty;
        if (
          ball.x + ball.radius >= k.x - k.width / 2 &&
          ball.x - ball.radius <= k.x + k.width / 2 &&
          ball.y + ball.radius >= k.y - k.height / 2 &&
          ball.y - ball.radius <= k.y + k.height / 2
        ) {
          ball.vx *= -1;
          k.surprised = 1.0;
          this.screenShake = 5;
          window.retroAudio.playKittyMeow();
          this.createHitParticles(k.x, k.y, '#ff9900', 16);
          this.addShockwave(k.x, k.y, '#ff3377', 45);
          
          if (ball.lastHitter === 'p1') {
            k.p1Hits++;
            this.updateHUD();
            this.addFloatText(k.x, k.y, '😿 P1 ACERTOU!', '#ff3377');
            if (k.p1Hits >= 2) {
              this.scorePoint(2, 'GATINHO ATINGIDO 2 VEZES!');
              return;
            }
          } else if (ball.lastHitter === 'p2') {
            k.p2Hits++;
            this.updateHUD();
            this.addFloatText(k.x, k.y, '😿 P2 ACERTOU!', '#ff3377');
            if (k.p2Hits >= 2) {
              this.scorePoint(1, 'GATINHO ATINGIDO 2 VEZES!');
              return;
            }
          }
        }
      }

      // Raquete 1 (Esquerda - Colisão Precisa Incluindo Quinas)
      if (
        ball.x - ball.radius <= this.p1.x + this.p1.width &&
        ball.x + ball.radius >= this.p1.x &&
        ball.y + ball.radius >= this.p1.y &&
        ball.y - ball.radius <= this.p1.y + this.p1.height &&
        ball.vx < 0
      ) {
        ball.x = this.p1.x + this.p1.width + ball.radius;
        this.deflectBall(ball, this.p1, 1);
        ball.lastHitter = 'p1';
        this.p1.scaleX = 0.75;
        this.p1.scaleY = 1.25;
        this.p1.powerMeter = Math.min(100, this.p1.powerMeter + 25);
        this.createHitParticles(ball.x, ball.y, '#00f0ff', 14);
        this.addShockwave(ball.x, ball.y, '#00f0ff', 30);
      }

      // Raquete 2 (Direita - Colisão Precisa Incluindo Quinas)
      if (
        ball.x + ball.radius >= this.p2.x &&
        ball.x - ball.radius <= this.p2.x + this.p2.width &&
        ball.y + ball.radius >= this.p2.y &&
        ball.y - ball.radius <= this.p2.y + this.p2.height &&
        ball.vx > 0
      ) {
        ball.x = this.p2.x - ball.radius;
        this.deflectBall(ball, this.p2, 2);
        ball.lastHitter = 'p2';
        this.p2.scaleX = 0.75;
        this.p2.scaleY = 1.25;
        this.p2.powerMeter = Math.min(100, this.p2.powerMeter + 25);
        this.createHitParticles(ball.x, ball.y, '#ff007f', 14);
        this.addShockwave(ball.x, ball.y, '#ff007f', 30);
      }

      // Raquete 3 (Esquerda Avançada - P3 em 4P)
      if (
        (this.gameType === '4p_local' || this.gameType === '4p_lan') &&
        ball.x - ball.radius <= this.p3.x + this.p3.width &&
        ball.x + ball.radius >= this.p3.x &&
        ball.y + ball.radius >= this.p3.y &&
        ball.y - ball.radius <= this.p3.y + this.p3.height &&
        ball.vx < 0
      ) {
        ball.x = this.p3.x + this.p3.width + ball.radius;
        this.deflectBall(ball, this.p3, 1);
        ball.lastHitter = 'p3';
        this.p3.scaleX = 0.75;
        this.p3.scaleY = 1.25;
        this.p3.powerMeter = Math.min(100, this.p3.powerMeter + 25);
        this.createHitParticles(ball.x, ball.y, '#00e5ff', 14);
        this.addShockwave(ball.x, ball.y, '#00e5ff', 30);
      }

      // Raquete 4 (Direita Avançada - P4 em 4P)
      if (
        (this.gameType === '4p_local' || this.gameType === '4p_lan') &&
        ball.x + ball.radius >= this.p4.x &&
        ball.x - ball.radius <= this.p4.x + this.p4.width &&
        ball.y + ball.radius >= this.p4.y &&
        ball.y - ball.radius <= this.p4.y + this.p4.height &&
        ball.vx > 0
      ) {
        ball.x = this.p4.x - ball.radius;
        this.deflectBall(ball, this.p4, 2);
        ball.lastHitter = 'p4';
        this.p4.scaleX = 0.75;
        this.p4.scaleY = 1.25;
        this.p4.powerMeter = Math.min(100, this.p4.powerMeter + 25);
        this.createHitParticles(ball.x, ball.y, '#ff00aa', 14);
        this.addShockwave(ball.x, ball.y, '#ff00aa', 30);
      }

      // Multiball Colisão entre bolas
      if (act === 'multiball') {
        for (let j = i - 1; j >= 0; j--) {
          const b2 = this.balls[j];
          const dx = b2.x - ball.x;
          const dy = b2.y - ball.y;
          const dist = Math.hypot(dx, dy);
          if (dist < ball.radius + b2.radius) {
            const nx = dx / dist;
            const ny = dy / dist;
            const kx = ball.vx - b2.vx;
            const ky = ball.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / 2;
            ball.vx -= p * nx;
            ball.vy -= p * ny;
            b2.vx += p * nx;
            b2.vy += p * ny;
            window.retroAudio.playWallBounce();
            this.createHitParticles((ball.x + b2.x) / 2, (ball.y + b2.y) / 2, '#ffea00', 14);
            this.addShockwave((ball.x + b2.x) / 2, (ball.y + b2.y) / 2, '#ffea00', 35);
          }
        }
      }

      // Detecção de Gol Imediata (Sem sumir a bola no limbo)
      if (ball.x + ball.radius < this.p1.x - 4) {
        if (act === 'multiball') {
          this.multiballScore2++;
          this.balls.splice(i, 1);
          window.retroAudio.playScore(false);
          this.triggerGoalEffects(2);
          this.updateHUD();
          if (this.multiballScore2 >= 2) {
            this.scorePoint(2);
            return;
          } else {
            setTimeout(() => { if (this.state === 'playing') this.balls.push(this.createSpawnBall(1)); }, 800);
          }
        } else {
          this.triggerGoalEffects(2);
          this.scorePoint(2);
          return;
        }
      } else if (ball.x - ball.radius > this.p2.x + this.p2.width + 4) {
        if (act === 'multiball') {
          this.multiballScore1++;
          this.balls.splice(i, 1);
          window.retroAudio.playScore(true);
          this.triggerGoalEffects(1);
          this.updateHUD();
          if (this.multiballScore1 >= 2) {
            this.scorePoint(1);
            return;
          } else {
            setTimeout(() => { if (this.state === 'playing') this.balls.push(this.createSpawnBall(-1)); }, 800);
          }
        } else {
          this.triggerGoalEffects(1);
          this.scorePoint(1);
          return;
        }
      }
    }
  }

  triggerGoalEffects(scorerPlayer) {
    this.screenShake = 10;
    const x = scorerPlayer === 1 ? CANVAS_WIDTH - 20 : 20;
    const color = scorerPlayer === 1 ? '#00f0ff' : '#ff007f';
    this.addShockwave(x, CANVAS_HEIGHT / 2, color, 90);
    this.createHitParticles(x, CANVAS_HEIGHT / 2, color, 30);
    this.addFloatText(x, CANVAS_HEIGHT / 2 - 30, '+1 PONTO!', '#ffea00');
  }

  createSpawnBall(dirX = 1) {
    const angle = (Math.random() * 0.5 - 0.25);
    const speed = 3.8;
    return {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      vx: dirX * speed * Math.cos(angle),
      vy: speed * Math.sin(angle),
      spin: 0,
      radius: this.defaultBallRadius,
      speed,
      hitCount: 0,
      trail: [],
      fireLevel: 0,
      isSmash: false,
      hue: Math.random() * 360,
      rotation: 0,
      lastHitter: null
    };
  }

  deflectBall(ball, paddle, playerNum) {
    const relativeIntersectY = (paddle.y + paddle.height / 2) - ball.y;
    const normalizedRelativeIntersectionY = relativeIntersectY / (paddle.height / 2);
    const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 3.2);

    ball.spin = paddle.vy * 0.06;
    ball.hitCount = (ball.hitCount || 0) + 1;

    let currentSpeed = Math.hypot(ball.vx, ball.vy);
    const direction = ball.vx > 0 ? -1 : 1;

    // Aceleração progressiva: +4% a cada rebatida (suave e controlado, cap em 9.5)
    currentSpeed = Math.min(9.5, currentSpeed + 0.28);

    if (paddle.powerMeter >= 100) {
      paddle.powerMeter = 0;
      ball.isSmash = true;
      currentSpeed = Math.min(13.0, currentSpeed * 1.35 + 1.5);
      this.screenShake = 7;
      window.retroAudio.playPaddleHit(true);
      this.addFloatText(ball.x, ball.y - 20, '⚡ POWER SMASH!', '#ffea00');
      this.addShockwave(ball.x, ball.y, '#ffea00', 45);
      this.createHitParticles(ball.x, ball.y, '#ffea00', 18);
    } else {
      ball.isSmash = false;
      window.retroAudio.playPaddleHit(false);

      if (Math.abs(paddle.vy) > 3.5) {
        this.addFloatText(ball.x, ball.y - 15, '🌀 SLICE!', '#00ffaa');
      }
    }

    // Reseta cooldown dos poços gravitacionais para a nova trajetória
    if (this.gravityWells) {
      this.gravityWells.forEach(w => { w.cooldown = 0; });
    }

    ball.vx = direction * currentSpeed * Math.cos(bounceAngle);
    ball.vy = -currentSpeed * Math.sin(bounceAngle) + paddle.vy * 0.2;
  }

  updateLasers() {
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.x += l.vx;

      if (
        l.owner === 'p2' &&
        l.x <= this.p1.x + this.p1.width &&
        l.x >= this.p1.x &&
        l.y >= this.p1.y &&
        l.y <= this.p1.y + this.p1.height
      ) {
        this.lasers.splice(i, 1);
        this.p1.hitsTaken++;
        this.screenShake = 6;
        window.retroAudio.playBlasterHit();
        this.createHitParticles(l.x, l.y, '#ff0055', 18);
        this.addShockwave(l.x, l.y, '#ff0055', 35);
        this.addFloatText(this.p1.x, this.p1.y, '💥 HIT!', '#ff0055');
        this.updateHUD();
        if (this.p1.hitsTaken >= 2) {
          this.scorePoint(2, 'BLASTER KNOCKOUT!');
        }
        continue;
      }

      if (
        l.owner === 'p1' &&
        l.x >= this.p2.x &&
        l.x <= this.p2.x + this.p2.width &&
        l.y >= this.p2.y &&
        l.y <= this.p2.y + this.p2.height
      ) {
        this.lasers.splice(i, 1);
        this.p2.hitsTaken++;
        this.screenShake = 6;
        window.retroAudio.playBlasterHit();
        this.createHitParticles(l.x, l.y, '#00f0ff', 18);
        this.addShockwave(l.x, l.y, '#00f0ff', 35);
        this.addFloatText(this.p2.x, this.p2.y, '💥 HIT!', '#00f0ff');
        this.updateHUD();
        if (this.p2.hitsTaken >= 2) {
          this.scorePoint(1, 'BLASTER KNOCKOUT!');
        }
        continue;
      }

      if (l.x < 0 || l.x > CANVAS_WIDTH) {
        this.lasers.splice(i, 1);
      }
    }
  }

  scorePoint(winnerNumber, customReason = null) {
    if (winnerNumber === 1) {
      this.score1++;
      if (this.hudScore1) {
        this.hudScore1.classList.add('score-pop');
        setTimeout(() => this.hudScore1.classList.remove('score-pop'), 400);
      }
      this.addFloatText(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2 - 35, customReason || '🎯 P1 PONTO!', '#00f0ff');
    }
    if (winnerNumber === 2) {
      this.score2++;
      if (this.hudScore2) {
        this.hudScore2.classList.add('score-pop');
        setTimeout(() => this.hudScore2.classList.remove('score-pop'), 400);
      }
      this.addFloatText(CANVAS_WIDTH * 3 / 4, CANVAS_HEIGHT / 2 - 35, customReason || '🎯 P2 PONTO!', '#ff007f');
    }

    this.updateHUD();
    window.retroAudio.playScore(winnerNumber === 1);

    if (this.gameType === '2p_lan' && window.networkManager.role === 'host') {
      window.networkManager.sendRoundEvent('point', this.score1, this.score2, this.currentAction ? this.currentAction.id : null);
    }

    if (this.score1 >= this.maxScore || this.score2 >= this.maxScore) {
      const winnerName = this.score1 >= this.maxScore 
        ? (this.gameType === '4p_local' ? 'TIME AZUL (P1+P3)' : this.p1.name)
        : (this.gameType === '4p_local' ? 'TIME ROSA (P2+P4)' : this.p2.name);
      this.gameOver(winnerName);
    } else {
      this.startRound();
    }
  }

  gameOver(winnerName) {
    this.state = 'game_over';
    this.spawnConfetti();
    document.getElementById('winner-msg').innerText = `🏆 ${winnerName} VENCEU!`;
    document.getElementById('final-score-msg').innerText = `${this.score1} - ${this.score2}`;
    document.getElementById('game-over-screen').classList.add('active');
  }

  returnToMenu() {
    this.state = 'menu';
    document.getElementById('main-menu').classList.add('active');
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('game-over-screen').classList.remove('active');
    document.getElementById('lan-modal').classList.remove('active');
  }

  addShockwave(x, y, color, maxRadius) {
    this.shockwaves.push({
      x, y, color,
      r: 4,
      maxR: maxRadius,
      alpha: 1.0
    });
  }

  updateShockwaves() {
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += (sw.maxR - sw.r) * 0.18 + 1.5;
      sw.alpha -= 0.05;
      if (sw.alpha <= 0 || sw.r >= sw.maxR) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  spawnConfetti() {
    this.confetti = [];
    const colors = ['#ffea00', '#00f0ff', '#ff007f', '#00ffaa', '#ffffff', '#ff9900'];
    for (let i = 0; i < 70; i++) {
      this.confetti.push({
        x: Math.random() * CANVAS_WIDTH,
        y: -10 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8
      });
    }
  }

  updateConfetti() {
    this.confetti.forEach(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.rot += c.rotSpeed;
      if (c.y > CANVAS_HEIGHT) c.y = -10;
    });
  }

  createHitParticles(x, y, color = '#ffffff', count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
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

  createFlameParticles(x, y) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: x + (Math.random() * 20 - 10),
        y: y + (Math.random() * 20 - 10),
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 3.5 - 1,
        life: 0.85,
        color: Math.random() > 0.5 ? '#ff3300' : '#ffea00',
        size: Math.random() * 6 + 3
      });
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.035;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render() {
    this.ctx.save();

    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake * 2;
      const shakeY = (Math.random() - 0.5) * this.screenShake * 2;
      this.ctx.translate(shakeX, shakeY);
    }

    this.renderSynthwaveBackground();
    this.renderAmbientDust();

    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([14, 14]);
    this.ctx.beginPath();
    this.ctx.moveTo(CANVAS_WIDTH / 2, 0);
    this.ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    const act = this.currentAction ? this.currentAction.id : null;

    if (act === 'fireball') this.renderFireRing();
    if (act === 'bumper_ball') this.renderBumpers();
    if (act === 'gravity_well') this.renderGravityWell();
    if (act === 'portals') this.renderPortals();
    if (act === 'asteroid_belt') this.renderAsteroids();
    if (act === 'time_warp') this.renderTimeWarpField();
    if (act === 'lightning_storm') this.renderLightningRails();
    if (act === 'secret_wall') this.renderSecretWall();
    if (act === 'kitty') this.renderKitty();
    if (act === 'shield_generator') this.renderShields();
    if (act === 'black_hole') this.renderBlackHole();
    if (act === 'magnet_field') this.renderMagnets();

    this.renderPaddle(this.p1, '#00f0ff', this.p1.hitsTaken, this.p1.powerMeter, true);
    this.renderPaddle(this.p2, '#ff007f', this.p2.hitsTaken, this.p2.powerMeter, false);

    if (this.gameType === '4p_local' || this.gameType === '4p_lan') {
      this.renderPaddle(this.p3, '#00e5ff', this.p3.hitsTaken, this.p3.powerMeter, true);
      this.renderPaddle(this.p4, '#ff00aa', this.p4.hitsTaken, this.p4.powerMeter, false);
    }

    this.renderLasers();
    this.renderShockwaves();

    this.balls.forEach(ball => {
      const inFog = act === 'fog_zone' && Math.abs(ball.x - CANVAS_WIDTH / 2) < 110;
      if (!inFog) {
        this.renderBall(ball);
      }
    });

    if (act === 'fog_zone') this.renderFogZone();
    this.renderParticles();
    this.renderFloatTexts();

    if (this.state === 'game_over') this.renderConfetti();

    if (this.state === 'countdown') {
      this.ctx.fillStyle = '#ffea00';
      this.ctx.font = '54px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = '#ffea00';
      this.ctx.shadowBlur = 20;
      const txt = this.countdown > 0 ? this.countdown.toString() : 'GO!';
      this.ctx.fillText(txt, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 18);
      this.ctx.shadowBlur = 0;
    }

    this.ctx.restore();
  }

  renderSynthwaveBackground() {
    const bgGrad = this.ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 50,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 500
    );
    bgGrad.addColorStop(0, '#06063e');
    bgGrad.addColorStop(1, '#010114');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.ctx.strokeStyle = 'rgba(60, 60, 160, 0.15)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, CANVAS_HEIGHT);
      this.ctx.stroke();
    }

    for (let y = this.gridOffset; y <= CANVAS_HEIGHT; y += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(CANVAS_WIDTH, y);
      this.ctx.stroke();
    }
  }

  renderAmbientDust() {
    this.ambientDust.forEach(d => {
      this.ctx.fillStyle = `rgba(160, 160, 255, ${d.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  renderFloatTexts() {
    this.floatTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.font = '12px "Press Start 2P"';
      this.ctx.fillStyle = ft.color;
      this.ctx.shadowColor = ft.color;
      this.ctx.shadowBlur = 10;
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });
  }

  renderPaddle(p, color, hitsTaken = 0, powerMeter = 0, isLeft = true) {
    this.ctx.save();
    this.ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
    this.ctx.scale(p.scaleX, p.scaleY);

    const w = p.width;
    const h = p.height;

    if (powerMeter >= 100) {
      this.ctx.shadowColor = '#ffea00';
      this.ctx.shadowBlur = 25;
      this.ctx.fillStyle = '#ffff33';
    } else {
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = 14;
      this.ctx.fillStyle = color;
    }

    this.ctx.fillRect(-w / 2, -h / 2, w, h);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4);
    this.ctx.fillStyle = powerMeter >= 100 ? '#ff9900' : color;
    this.ctx.fillRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8);

    const gaugeH = h * (powerMeter / 100);
    this.ctx.fillStyle = '#ffea00';
    this.ctx.fillRect(isLeft ? -w / 2 - 8 : w / 2 + 4, h / 2 - gaugeH, 4, gaugeH);

    if (this.currentAction && this.currentAction.id === 'blaster') {
      this.ctx.fillStyle = '#111133';
      const barrelX = isLeft ? w / 2 : -w / 2 - 8;
      this.ctx.fillRect(barrelX, -6, 8, 12);
      this.ctx.fillStyle = color;
      this.ctx.fillRect(barrelX + (isLeft ? 4 : 0), -4, 4, 8);

      if (p.muzzleFlash > 0) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 20;
        this.ctx.beginPath();
        this.ctx.arc(isLeft ? w / 2 + 10 : -w / 2 - 10, 0, 10 * p.muzzleFlash, 0, Math.PI * 2);
        this.ctx.fill();
      }

      const hp = 2 - hitsTaken;
      for (let i = 0; i < 2; i++) {
        this.ctx.fillStyle = i < hp ? '#00f0ff' : '#ff0055';
        this.ctx.fillRect(isLeft ? -w / 2 - 16 : w / 2 + 12, -14 + i * 16, 4, 12);
      }
    }

    this.ctx.restore();
  }

  renderBall(ball) {
    for (let i = 0; i < ball.trail.length; i++) {
      const t = ball.trail[i];
      const alpha = (i + 1) / ball.trail.length * 0.55;
      if (ball.isSmash) {
        this.ctx.fillStyle = `rgba(255, 234, 0, ${alpha})`;
      } else if (ball.fireLevel > 0) {
        this.ctx.fillStyle = `rgba(255, ${Math.max(0, 160 - ball.fireLevel * 30)}, 0, ${alpha})`;
      } else if (ball.hue > 0) {
        this.ctx.fillStyle = `hsla(${ball.hue}, 100%, 60%, ${alpha})`;
      } else {
        this.ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
      }
      this.ctx.beginPath();
      this.ctx.arc(t.x, t.y, ball.radius * (0.4 + 0.6 * (i / ball.trail.length)), 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.save();
    this.ctx.translate(ball.x, ball.y);
    this.ctx.rotate(ball.rotation);

    if (ball.isSmash) {
      this.ctx.shadowColor = '#ffea00';
      this.ctx.shadowBlur = 25;
      this.ctx.fillStyle = '#ffffff';
    } else if (ball.fireLevel > 0) {
      this.ctx.shadowColor = '#ff5500';
      this.ctx.shadowBlur = 15;
      this.ctx.fillStyle = '#ffea00';
    } else if (ball.hue > 0) {
      this.ctx.shadowColor = `hsl(${ball.hue}, 100%, 60%)`;
      this.ctx.shadowBlur = 12;
      this.ctx.fillStyle = `hsl(${ball.hue}, 100%, 60%)`;
    } else {
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 10;
      this.ctx.fillStyle = '#ffffff';
    }

    this.ctx.beginPath();
    this.ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(-ball.radius / 2.5, -ball.radius / 2.5, ball.radius / 1.5, ball.radius / 1.5);
    this.ctx.restore();
  }

  renderPortals() {
    this.portals.forEach(p => {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot);

      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 25;

      this.ctx.strokeStyle = p.color;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = '#020216';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.r * 0.7, p.r * 0.4, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  renderTimeWarpField() {
    const cx = CANVAS_WIDTH / 2;
    this.ctx.save();
    
    const grad = this.ctx.createLinearGradient(cx - 90, 0, cx + 90, 0);
    grad.addColorStop(0, 'rgba(0, 255, 170, 0)');
    grad.addColorStop(0.5, 'rgba(0, 255, 170, 0.25)');
    grad.addColorStop(1, 'rgba(0, 255, 170, 0)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(cx - 90, 0, 180, CANVAS_HEIGHT);

    this.ctx.strokeStyle = 'rgba(0, 255, 170, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([8, 8]);
    this.ctx.strokeRect(cx - 90, 0, 180, CANVAS_HEIGHT);
    this.ctx.setLineDash([]);

    this.ctx.fillStyle = '#00ffaa';
    this.ctx.font = '10px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('⏳ BULLET TIME', cx, 40);
    this.ctx.restore();
  }

  renderLightningRails() {
    this.ctx.save();
    this.ctx.strokeStyle = '#ffff00';
    this.ctx.shadowColor = '#ffff00';
    this.ctx.shadowBlur = 20;
    this.ctx.lineWidth = 3;

    this.ctx.beginPath();
    this.ctx.moveTo(0, 8);
    this.ctx.lineTo(CANVAS_WIDTH, 8);
    this.ctx.moveTo(0, CANVAS_HEIGHT - 8);
    this.ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 8);
    this.ctx.stroke();

    if (Math.random() < 0.3) {
      const sparkX = Math.random() * CANVAS_WIDTH;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(sparkX, 5, 12, 6);
      this.ctx.fillRect(sparkX, CANVAS_HEIGHT - 11, 12, 6);
    }
    this.ctx.restore();
  }

  renderAsteroids() {
    this.asteroids.forEach(ast => {
      this.ctx.save();
      this.ctx.translate(ast.x, ast.y);
      this.ctx.rotate(ast.rot);

      this.ctx.shadowColor = '#d488ff';
      this.ctx.shadowBlur = 12;

      this.ctx.fillStyle = '#4a2277';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, ast.r, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#d488ff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '8px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('☄️', 0, 3);
      this.ctx.restore();
    });
  }

  renderFireRing() {
    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2;
    const time = Date.now() * 0.003;
    this.ctx.save();
    
    this.ctx.shadowColor = '#ff3300';
    this.ctx.shadowBlur = 25;
    this.ctx.strokeStyle = 'rgba(255, 80, 0, 0.85)';
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 68 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.strokeStyle = 'rgba(255, 230, 0, 0.95)';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 62, 0, Math.PI * 2);
    this.ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const angle = time * 2 + (i * Math.PI / 4);
      const fx = cx + Math.cos(angle) * 72;
      const fy = cy + Math.sin(angle) * 72;
      this.ctx.fillStyle = i % 2 === 0 ? '#ffea00' : '#ff3300';
      this.ctx.beginPath();
      this.ctx.arc(fx, fy, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  renderBumpers() {
    this.bumpers.forEach(b => {
      this.ctx.save();
      const r = b.r + (b.pulse > 0 ? b.pulse * 10 : 0);
      
      this.ctx.shadowColor = '#00ffaa';
      this.ctx.shadowBlur = b.pulse > 0 ? 30 : 15;

      this.ctx.fillStyle = b.pulse > 0 ? '#ffffff' : '#00ffaa';
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#06062a';
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, r * 0.65, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#00ffaa';
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, r * 0.3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  renderGravityWell() {
    this.gravityWells.forEach((gw, idx) => {
      this.ctx.save();
      this.ctx.translate(gw.x, gw.y);
      this.ctx.rotate(gw.angle);

      this.ctx.shadowColor = '#b026ff';
      this.ctx.shadowBlur = 25;

      const time = Date.now() * 0.003;
      const pulseR = gw.r + Math.sin(time * 4 + idx) * 4;

      this.ctx.fillStyle = '#020215';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, pulseR * 0.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#e066ff';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      this.ctx.strokeStyle = '#a855f7';
      this.ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, pulseR - i * 8, i * 1.3, i * 1.3 + 2.4);
        this.ctx.stroke();
      }

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  renderSecretWall() {
    if (!this.secretWall) return;
    const sw = this.secretWall;
    this.ctx.save();
    
    if (sw.flash > 0) {
      this.ctx.shadowColor = '#ff007f';
      this.ctx.shadowBlur = 30;
      this.ctx.fillStyle = `rgba(255, 0, 127, ${sw.flash})`;
      this.ctx.fillRect(sw.x - 6, sw.y, sw.width + 12, sw.height);
    } else {
      const pulseAlpha = 0.08 + Math.sin(sw.pulseAnim * 3) * 0.05;
      this.ctx.fillStyle = `rgba(255, 0, 127, ${pulseAlpha})`;
      this.ctx.fillRect(sw.x, sw.y, sw.width, sw.height);

      this.ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha * 2})`;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(sw.x, sw.y, sw.width, sw.height);
    }
    this.ctx.restore();
  }

  renderFogZone() {
    const width = 230;
    const x = CANVAS_WIDTH / 2 - width / 2;
    
    const grad = this.ctx.createLinearGradient(x, 0, x + width, 0);
    grad.addColorStop(0, 'rgba(4, 4, 30, 0)');
    grad.addColorStop(0.25, 'rgba(30, 30, 80, 0.96)');
    grad.addColorStop(0.75, 'rgba(30, 30, 80, 0.96)');
    grad.addColorStop(1, 'rgba(4, 4, 30, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(x, 0, width, CANVAS_HEIGHT);

    this.fogParticles.forEach(fp => {
      this.ctx.fillStyle = `rgba(170, 170, 240, ${fp.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(fp.x, fp.y, fp.r, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    this.ctx.font = '12px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🌫️ FOG ZONE', CANVAS_WIDTH / 2, 45);
  }

  renderKitty() {
    if (!this.kitty) return;
    const k = this.kitty;
    this.ctx.save();
    this.ctx.translate(k.x, k.y);

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 14, 16, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#ffaa33';
    this.ctx.fillRect(-14, -10, 28, 20);

    this.ctx.fillRect(-16, -18, 10, 10);
    this.ctx.fillRect(6, -18, 10, 10);
    this.ctx.fillStyle = '#ff6688';
    this.ctx.fillRect(-14, -16, 6, 6);
    this.ctx.fillRect(8, -16, 6, 6);

    if (k.blink || k.surprised > 0) {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(-10, -5, 6, 2);
      this.ctx.fillRect(4, -5, 6, 2);
    } else {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(-10, -6, 6, 6);
      this.ctx.fillRect(4, -6, 6, 6);
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(-8, -4, 4, 4);
      this.ctx.fillRect(6, -4, 4, 4);
    }

    this.ctx.fillStyle = '#ff4466';
    this.ctx.fillRect(-2, -1, 4, 3);

    const tailY = Math.sin(k.frame * 2) * 6;
    this.ctx.fillStyle = '#ffaa33';
    this.ctx.fillRect(14, -4 + tailY, 8, 5);

    const heart1 = k.p1Hits === 0 ? '❤️' : '💔';
    const heart2 = k.p2Hits === 0 ? '❤️' : '💔';
    this.ctx.font = '10px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`P1:${heart1} P2:${heart2}`, 0, -26);

    this.ctx.restore();
  }

  renderLasers() {
    this.lasers.forEach(l => {
      this.ctx.save();
      this.ctx.shadowColor = l.owner === 'p1' ? '#00f0ff' : '#ff0055';
      this.ctx.shadowBlur = 14;

      this.ctx.fillStyle = l.owner === 'p1' ? '#00f0ff' : '#ff0055';
      this.ctx.fillRect(l.x, l.y - l.height / 2, l.width, l.height);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(l.x + 3, l.y - 1, l.width - 6, 2);
      this.ctx.restore();
    });
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

  renderParticles() {
    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    this.ctx.globalAlpha = 1.0;
  }

  renderShields() {
    (this.shields1 || []).forEach(s => {
      if (!s.active) return;
      this.ctx.save();
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 15;
      this.ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      this.ctx.fillRect(s.x, s.y, s.w, s.h);
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(s.x, s.y, s.w, s.h);
      this.ctx.restore();
    });
    (this.shields2 || []).forEach(s => {
      if (!s.active) return;
      this.ctx.save();
      this.ctx.shadowColor = '#ff007f';
      this.ctx.shadowBlur = 15;
      this.ctx.fillStyle = 'rgba(255, 0, 127, 0.4)';
      this.ctx.fillRect(s.x, s.y, s.w, s.h);
      this.ctx.strokeStyle = '#ff007f';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(s.x, s.y, s.w, s.h);
      this.ctx.restore();
    });
  }

  renderBlackHole() {
    if (!this.blackHole) return;
    const bh = this.blackHole;
    this.ctx.save();
    this.ctx.translate(bh.x, bh.y);
    this.ctx.rotate(bh.rot);

    const grad = this.ctx.createRadialGradient(0, 0, 8, 0, 0, 52);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.5, '#b026ff');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 52, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#000000';
    this.ctx.shadowColor = '#b026ff';
    this.ctx.shadowBlur = 22;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, bh.r, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = '#e066ff';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, bh.r + 2, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  renderMagnets() {
    (this.magnets || []).forEach(m => {
      this.ctx.save();
      this.ctx.translate(m.x, m.y);
      this.ctx.rotate(m.rot);
      this.ctx.shadowColor = m.color;
      this.ctx.shadowBlur = 18;

      this.ctx.strokeStyle = m.color;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, m.r, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = m.type === 'attract' ? '#ff0055' : '#00d4ff';
      this.ctx.font = '14px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(m.type === 'attract' ? 'S' : 'N', 0, 5);
      this.ctx.restore();
    });
  }
}

window.retroPingPong = new RetroPingPong();
