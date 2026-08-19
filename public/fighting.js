// =============================================================================
// RETRO STREET FIGHTER ARCADE (SUPER RETRO FIGHTER 2D)
// Motor de Luta Arcade Clássico com Hadouken, Shoryuken, Combos, Super Especial e Efeitos
// =============================================================================
'use strict';

const FIGHT_VIEW_W = 800;
const FIGHT_VIEW_H = 600;
const FLOOR_Y = 480;

const FIGHTER_ROSTER = [
  {
    id: 'ryu',
    name: 'RYU (DRAGON MASTER)',
    avatar: '🥋',
    color: '#ffffff',
    beltColor: '#000000',
    headband: '#ff0033',
    maxHp: 100,
    speed: 5.2,
    power: 1.0,
    specialName: 'HADOUKEN! 💥',
    specialColor: '#00f0ff',
    superName: 'SHINKU HADOUKEN! 🔥'
  },
  {
    id: 'ken',
    name: 'KEN (FLAME MASTER)',
    avatar: '🥊',
    color: '#ff0033',
    beltColor: '#000000',
    headband: '#ffea00',
    maxHp: 95,
    speed: 5.8,
    power: 1.1,
    specialName: 'SHORYUKEN! 🔥',
    specialColor: '#ff7700',
    superName: 'SHINRYUKEN! ⚡'
  },
  {
    id: 'guile',
    name: 'COMMANDER TIGER',
    avatar: '🎖️',
    color: '#39ff14',
    beltColor: '#121226',
    headband: '#39ff14',
    maxHp: 110,
    speed: 4.8,
    power: 1.25,
    specialName: 'SONIC BOOM! 🌀',
    specialColor: '#39ff14',
    superName: 'FLASH KICK BARRAGE! ⚡'
  },
  {
    id: 'akuma',
    name: 'SHADOW SHINOBI',
    avatar: '👹',
    color: '#4a0e4e',
    beltColor: '#ff0055',
    headband: '#ff0055',
    maxHp: 90,
    speed: 6.2,
    power: 1.35,
    specialName: 'GOHADOU! 💀',
    specialColor: '#b026ff',
    superName: 'METSU HADOU! 🌌'
  }
];

const FIGHT_ARENAS = [
  {
    id: 'dojo',
    name: 'DOJO DO DRAGÃO',
    skyTop: '#0a0a24',
    skyBottom: '#281440',
    floorColor: '#3a2010',
    floorDetail: '#5a341a',
    props: '🏮 LANTERNAS DE FOGO'
  },
  {
    id: 'temple',
    name: 'TEMPLO NEON CHINATOWN',
    skyTop: '#050518',
    skyBottom: '#4a0832',
    floorColor: '#1a1828',
    floorDetail: '#ff007f',
    props: '⚡ NEON LIGHTS'
  },
  {
    id: 'airbase',
    name: 'BASE MILITAR NOTURNA',
    skyTop: '#041018',
    skyBottom: '#0d3248',
    floorColor: '#222830',
    floorDetail: '#00e5ff',
    props: '✈️ JATO DE COMBATE'
  }
];

class RetroStreetFighterEngine {
  constructor() {
    this.canvas = document.getElementById('fightCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.state = 'idle'; // idle | countdown | fighting | ko
    this.gameMode = '1p'; // 1p | 2p_local | online
    this.selectedStage = FIGHT_ARENAS[0];

    this.p1 = null;
    this.p2 = null;
    this.projectiles = [];
    this.hitSparks = [];
    this.shockwaves = [];
    this.floatTexts = [];

    this.round = 1;
    this.p1Wins = 0;
    this.p2Wins = 0;
    this.roundTimer = 99;
    this.timerCountdown = 0;

    this.screenShake = 0;
    this.hitFreeze = 0; // Hit-stop para impacto arcade
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

  startFight(mode = '1p', char1Idx = 0, char2Idx = 1, arenaIdx = 0) {
    if (!this.canvas) {
      this.canvas = document.getElementById('fightCanvas');
      if (this.canvas) this.ctx = this.canvas.getContext('2d');
    }

    this.gameMode = mode;
    this.selectedStage = FIGHT_ARENAS[arenaIdx % FIGHT_ARENAS.length];

    const f1 = FIGHTER_ROSTER[char1Idx % FIGHTER_ROSTER.length];
    const f2 = FIGHTER_ROSTER[char2Idx % FIGHTER_ROSTER.length];

    this.p1 = this.createFighter(1, f1, 180, true);
    this.p2 = this.createFighter(2, f2, 620, mode === '2p_local');

    this.projectiles = [];
    this.hitSparks = [];
    this.shockwaves = [];
    this.floatTexts = [];

    this.round = 1;
    this.p1Wins = 0;
    this.p2Wins = 0;
    this.roundTimer = 99;
    this.timerCountdown = Date.now();

    const menu = document.getElementById('main-menu');
    const screen = document.getElementById('fighting-screen');
    const over = document.getElementById('fight-game-over-screen');
    if (menu) menu.classList.remove('active');
    if (over) over.classList.remove('active');
    if (screen) screen.classList.add('active');

    this.startRoundCountdown();
  }

  createFighter(playerNum, profile, startX, isHuman) {
    return {
      playerNum,
      profile,
      isHuman,
      x: startX,
      y: FLOOR_Y,
      vx: 0,
      vy: 0,
      facing: playerNum === 1 ? 1 : -1,
      width: 50,
      height: 110,
      state: 'idle', // idle | walking | jumping | crouching | punch | kick | special | super | hurt | block | ko
      stateTimer: 0,
      hp: profile.maxHp,
      maxHp: profile.maxHp,
      superMeter: 0, // 0 a 100
      maxSuper: 100,
      comboCount: 0,
      comboTimer: 0,
      isGrounded: true,
      lastAttack: null,
      aiTimer: 0
    };
  }

  startRoundCountdown() {
    this.state = 'countdown';
    this.countdown = 3;
    this.countdownTimer = Date.now();
    this.addFloatText(FIGHT_VIEW_W / 2, 240, `ROUND ${this.round}!`, '#ffea00', 42);
    if (window.retroAudio) window.retroAudio.playCountdown(false);
  }

  returnToMenu() {
    this.state = 'idle';
    const menu = document.getElementById('main-menu');
    const screen = document.getElementById('fighting-screen');
    const over = document.getElementById('fight-game-over-screen');
    if (screen) screen.classList.remove('active');
    if (over) over.classList.remove('active');
    if (menu) menu.classList.add('active');
  }

  loop() {
    try {
      this.update();
      this.render();
    } catch (e) {
      console.warn('Fighter safe loop:', e);
    }
    requestAnimationFrame(this.loop);
  }

  update() {
    // Hit stop para dar sensação de peso ao golpe
    if (this.hitFreeze > 0) {
      this.hitFreeze--;
      return;
    }

    if (this.screenShake > 0) this.screenShake = Math.max(0, this.screenShake - 0.5);

    // Contagem Inicial
    if (this.state === 'countdown') {
      const elapsed = Date.now() - this.countdownTimer;
      if (elapsed > 1800) {
        this.state = 'fighting';
        this.addFloatText(FIGHT_VIEW_W / 2, 240, 'FIGHT! 🥊', '#ff0033', 48);
        if (window.retroAudio) window.retroAudio.playCountdown(true);
      }
      return;
    }

    if (this.state !== 'fighting') return;

    // Timer de 99 Segundos do Round
    if (Date.now() - this.timerCountdown >= 1000) {
      this.timerCountdown = Date.now();
      this.roundTimer = Math.max(0, this.roundTimer - 1);
      if (this.roundTimer <= 0) {
        this.handleTimeOver();
      }
    }

    // Atualiza Lutadores
    this.updateFighter(this.p1, this.p2);
    this.updateFighter(this.p2, this.p1);

    // Orientação Automática (Face to Face)
    if (this.p1.state !== 'hurt' && this.p2.state !== 'hurt') {
      this.p1.facing = this.p1.x < this.p2.x ? 1 : -1;
      this.p2.facing = this.p2.x < this.p1.x ? 1 : -1;
    }

    // Projéteis (Hadouken)
    this.updateProjectiles();

    // Partículas & Efeitos
    for (let i = this.hitSparks.length - 1; i >= 0; i--) {
      const sp = this.hitSparks[i];
      sp.x += sp.vx; sp.y += sp.vy;
      sp.life -= 0.05;
      if (sp.life <= 0) this.hitSparks.splice(i, 1);
    }

    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y -= 1.2; ft.alpha -= 0.02;
      if (ft.alpha <= 0) this.floatTexts.splice(i, 1);
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += 3.5; sw.alpha -= 0.04;
      if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
    }

    this.updateHUD();
  }

  updateFighter(f, opponent) {
    if (f.state === 'ko') return;

    // Gravidade e Pulo
    f.y += f.vy;
    if (!f.isGrounded) {
      f.vy += 0.98; // Gravidade
      if (f.y >= FLOOR_Y) {
        f.y = FLOOR_Y;
        f.vy = 0;
        f.isGrounded = true;
        if (f.state === 'jumping') f.state = 'idle';
      }
    }

    // Timer de Estado do Ataque
    if (f.stateTimer > 0) {
      f.stateTimer--;
      if (f.stateTimer <= 0) {
        f.state = f.isGrounded ? 'idle' : 'jumping';
        f.lastAttack = null;
      }
    }

    // Decaimento de Combo
    if (f.comboTimer > 0) {
      f.comboTimer--;
      if (f.comboTimer <= 0) f.comboCount = 0;
    }

    // Controles do Jogador ou IA
    if (f.isHuman) {
      this.handleHumanInput(f, opponent);
    } else {
      this.handleAIInput(f, opponent);
    }

    // Limites de Tela
    f.x = Math.max(40, Math.min(FIGHT_VIEW_W - 40, f.x));
  }

  handleHumanInput(f, opp) {
    if (f.state === 'hurt' || f.state === 'ko') return;

    const isP1 = f.playerNum === 1;

    // Teclas P1 (WASD / Espaço / J / K / L) | P2 (Setas / Numpad 1,2,3)
    const left  = isP1 ? (this.keys['KeyA'] || this.keys['a']) : (this.keys['ArrowLeft']);
    const right = isP1 ? (this.keys['KeyD'] || this.keys['d']) : (this.keys['ArrowRight']);
    const up    = isP1 ? (this.keys['KeyW'] || this.keys['w']) : (this.keys['ArrowUp']);
    const down  = isP1 ? (this.keys['KeyS'] || this.keys['s']) : (this.keys['ArrowDown']);

    const punch   = isP1 ? (this.keys['KeyJ'] || this.keys['j'] || this.keys['Space']) : (this.keys['Numpad1'] || this.keys['KeyU']);
    const kick    = isP1 ? (this.keys['KeyK'] || this.keys['k'] || this.keys['KeyE'])   : (this.keys['Numpad2'] || this.keys['KeyI']);
    const special = isP1 ? (this.keys['KeyL'] || this.keys['l'] || this.keys['KeyQ'])   : (this.keys['Numpad3'] || this.keys['KeyO']);
    const superAtk= isP1 ? (this.keys['KeyF'] || this.keys['f'] || this.keys['ShiftLeft']) : (this.keys['NumpadEnter'] || this.keys['KeyP']);

    // Movimentação
    if (f.state === 'idle' || f.state === 'walking' || f.state === 'crouching') {
      if (up && f.isGrounded) {
        f.vy = -16.5;
        f.isGrounded = false;
        f.state = 'jumping';
        if (window.retroAudio) window.retroAudio.playPaddleHit(false);
      } else if (down && f.isGrounded) {
        f.state = 'crouching';
      } else if (left) {
        f.x -= f.profile.speed;
        f.state = f.facing === 1 ? 'block' : 'walking'; // Andar para trás = Defesa
      } else if (right) {
        f.x += f.profile.speed;
        f.state = f.facing === -1 ? 'block' : 'walking';
      } else {
        f.state = 'idle';
      }

      // Execução de Golpes
      if (superAtk && f.superMeter >= 100) {
        this.performSuper(f, opp);
      } else if (special) {
        this.performSpecial(f, opp);
      } else if (punch) {
        this.performPunch(f, opp);
      } else if (kick) {
        this.performKick(f, opp);
      }
    }
  }

  handleAIInput(f, opp) {
    if (f.state === 'hurt' || f.state === 'ko') return;

    const dist = Math.abs(f.x - opp.x);
    f.aiTimer++;

    if (f.aiTimer % 6 === 0) {
      // Reação da IA a projéteis
      const incomingHadouken = this.projectiles.find(p => p.owner !== f.playerNum && Math.abs(p.x - f.x) < 220);
      if (incomingHadouken) {
        if (f.isGrounded && Math.random() < 0.65) {
          f.vy = -16;
          f.isGrounded = false;
          f.state = 'jumping';
          return;
        } else {
          f.state = 'block';
          return;
        }
      }

      // Ataque de Super quando carregado
      if (f.superMeter >= 100 && dist < 220) {
        this.performSuper(f, opp);
        return;
      }

      // Combate de Curta e Longa Distância
      if (dist < 90) {
        // Perto: Alterna Soco, Chute e Shoryuken
        const r = Math.random();
        if (r < 0.35) this.performPunch(f, opp);
        else if (r < 0.70) this.performKick(f, opp);
        else if (r < 0.90) this.performSpecial(f, opp);
        else f.state = 'block';
      } else if (dist > 280) {
        // Longe: Solta Hadouken ou avança
        if (Math.random() < 0.45) {
          this.performSpecial(f, opp);
        } else {
          f.x += (opp.x > f.x ? f.profile.speed : -f.profile.speed);
          f.state = 'walking';
        }
      } else {
        // Média distância: Pula ou se aproxima
        if (Math.random() < 0.35 && f.isGrounded) {
          f.vy = -16;
          f.isGrounded = false;
          f.state = 'jumping';
        } else {
          f.x += (opp.x > f.x ? f.profile.speed : -f.profile.speed);
          f.state = 'walking';
        }
      }
    }
  }

  performPunch(f, opp) {
    f.state = 'punch';
    f.stateTimer = 16;
    f.lastAttack = 'punch';
    if (window.retroAudio) window.retroAudio.playPaddleHit(false);

    const hitDist = Math.abs(f.x - opp.x);
    const facingOpponent = (f.facing === 1 && opp.x > f.x) || (f.facing === -1 && opp.x < f.x);

    if (hitDist < 85 && facingOpponent) {
      this.applyHit(f, opp, 8 * f.profile.power, '💥 SOCO RÁPIDO!', '#00f0ff', 12);
    }
  }

  performKick(f, opp) {
    f.state = 'kick';
    f.stateTimer = 22;
    f.lastAttack = 'kick';
    if (window.retroAudio) window.retroAudio.playPaddleHit(false);

    const hitDist = Math.abs(f.x - opp.x);
    const facingOpponent = (f.facing === 1 && opp.x > f.x) || (f.facing === -1 && opp.x < f.x);

    if (hitDist < 105 && facingOpponent) {
      this.applyHit(f, opp, 14 * f.profile.power, '⚡ CHUTE FORTE!', '#ffea00', 16);
    }
  }

  performSpecial(f, opp) {
    f.state = 'special';
    f.stateTimer = 30;
    f.lastAttack = 'special';

    if (f.profile.id === 'ken') {
      // Shoryuken (Dragon Punch)
      f.vy = -17;
      f.isGrounded = false;
      f.x += f.facing * 35;
      if (window.retroAudio) window.retroAudio.playBlaster();
      this.addFloatText(f.x, f.y - 40, f.profile.specialName, f.profile.specialColor);

      const hitDist = Math.abs(f.x - opp.x);
      if (hitDist < 95) {
        this.applyHit(f, opp, 22 * f.profile.power, '🔥 SHORYUKEN!', '#ff7700', 25);
        opp.vy = -12;
        opp.isGrounded = false;
      }
    } else {
      // Hadouken / Sonic Boom (Projetil)
      if (window.retroAudio) window.retroAudio.playPortal();
      this.addFloatText(f.x, f.y - 40, f.profile.specialName, f.profile.specialColor);
      this.projectiles.push({
        x: f.x + f.facing * 45,
        y: f.y - 45,
        vx: f.facing * 9.5,
        owner: f.playerNum,
        color: f.profile.specialColor,
        dmg: 18 * f.profile.power,
        name: f.profile.specialName,
        r: 22,
        life: 140
      });
    }
  }

  performSuper(f, opp) {
    f.superMeter = 0;
    f.state = 'super';
    f.stateTimer = 45;
    this.screenShake = 14;
    this.hitFreeze = 8;

    if (window.retroAudio) window.retroAudio.playScore(true);
    this.addShockwave(f.x, f.y - 40, '#ffea00', 90);
    this.addFloatText(FIGHT_VIEW_W / 2, 220, `💥 ${f.profile.superName} 💥`, '#ffea00', 32);

    // Multi Hadouken Devastador
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.projectiles.push({
          x: f.x + f.facing * 50,
          y: f.y - 45 + (i * 12 - 12),
          vx: f.facing * 14.0,
          owner: f.playerNum,
          color: '#ffea00',
          dmg: 16 * f.profile.power,
          name: 'SUPER BEAM',
          r: 30,
          life: 160
        });
      }, i * 110);
    }
  }

  applyHit(attacker, target, rawDmg, text, sparkColor, meterGain) {
    const isBlocking = target.state === 'block';
    const finalDmg = isBlocking ? Math.floor(rawDmg * 0.18) : rawDmg;

    target.hp = Math.max(0, target.hp - finalDmg);
    attacker.superMeter = Math.min(attacker.maxSuper, attacker.superMeter + meterGain);
    target.superMeter = Math.min(target.maxSuper, target.superMeter + Math.floor(meterGain * 0.7));

    this.hitFreeze = isBlocking ? 3 : 6;
    this.screenShake = isBlocking ? 3 : 8;

    if (!isBlocking) {
      target.state = 'hurt';
      target.stateTimer = 18;
      target.x += attacker.facing * 18;
      attacker.comboCount++;
      attacker.comboTimer = 65;

      if (attacker.comboCount > 1) {
        this.addFloatText(attacker.x, attacker.y - 70, `⚡ ${attacker.comboCount} HITS COMBO!`, '#ffea00', 16);
      }
    }

    this.createSparks(target.x, target.y - 45, isBlocking ? '#ffffff' : sparkColor);
    this.addShockwave(target.x, target.y - 45, isBlocking ? '#ffffff' : sparkColor, isBlocking ? 25 : 45);
    this.addFloatText(target.x, target.y - 30, isBlocking ? '🛡️ GUARD!' : text, isBlocking ? '#ffffff' : sparkColor);

    if (target.hp <= 0) {
      this.handleKO(attacker, target);
    }
  }

  updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx;
      p.life--;

      const target = p.owner === 1 ? this.p2 : this.p1;
      const dist = Math.hypot(p.x - target.x, p.y - (target.y - 45));

      if (dist < p.r + 35) {
        const attacker = p.owner === 1 ? this.p1 : this.p2;
        this.applyHit(attacker, target, p.dmg, p.name, p.color, 15);
        p.life = 0;
      }

      if (p.x < 0 || p.x > FIGHT_VIEW_W || p.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  createSparks(x, y, color) {
    for (let i = 0; i < 14; i++) {
      this.hitSparks.push({
        x, y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 0.6,
        color
      });
    }
  }

  addShockwave(x, y, color, maxR) {
    this.shockwaves.push({ x, y, color, r: 10, maxR, alpha: 0.8 });
  }

  addFloatText(x, y, text, color = '#ffea00', size = 14) {
    this.floatTexts.push({ x, y, text, color, size, alpha: 1.0 });
  }

  handleKO(winner, loser) {
    loser.state = 'ko';
    this.state = 'ko';
    this.screenShake = 16;
    this.hitFreeze = 12;

    if (winner.playerNum === 1) this.p1Wins++;
    else this.p2Wins++;

    if (window.retroAudio) window.retroAudio.playScore(true);
    this.addFloatText(FIGHT_VIEW_W / 2, 220, 'K.O.! 💀', '#ff0033', 54);

    setTimeout(() => {
      if (this.p1Wins >= 2 || this.p2Wins >= 2) {
        this.showFightGameOver(winner.playerNum);
      } else {
        this.round++;
        this.p1.hp = this.p1.maxHp;
        this.p2.hp = this.p2.maxHp;
        this.p1.x = 180;
        this.p2.x = 620;
        this.p1.state = 'idle';
        this.p2.state = 'idle';
        this.roundTimer = 99;
        this.startRoundCountdown();
      }
    }, 2500);
  }

  handleTimeOver() {
    this.state = 'ko';
    const winner = this.p1.hp > this.p2.hp ? 1 : (this.p2.hp > this.p1.hp ? 2 : 0);
    this.addFloatText(FIGHT_VIEW_W / 2, 220, 'TIME OVER!', '#ffea00', 44);
    setTimeout(() => {
      this.showFightGameOver(winner);
    }, 2000);
  }

  showFightGameOver(winnerNum) {
    const modal = document.getElementById('fight-game-over-screen');
    const msg = document.getElementById('fight-winner-msg');
    if (msg) {
      if (winnerNum === 1) msg.innerText = `👑 PLAYER 1 (${this.p1.profile.name}) VENCEU!`;
      else if (winnerNum === 2) msg.innerText = `👑 PLAYER 2 (${this.p2.profile.name}) VENCEU!`;
      else msg.innerText = '⚔️ EMPATE DUPLO!';
    }
    if (modal) modal.classList.add('active');
  }

  updateHUD() {
    const p1HpBar = document.getElementById('fight-p1-hp');
    const p2HpBar = document.getElementById('fight-p2-hp');
    const p1SpBar = document.getElementById('fight-p1-super');
    const p2SpBar = document.getElementById('fight-p2-super');
    const timerEl = document.getElementById('fight-timer');

    if (p1HpBar) p1HpBar.style.width = `${Math.max(0, (this.p1.hp / this.p1.maxHp) * 100)}%`;
    if (p2HpBar) p2HpBar.style.width = `${Math.max(0, (this.p2.hp / this.p2.maxHp) * 100)}%`;
    if (p1SpBar) p1SpBar.style.width = `${Math.max(0, (this.p1.superMeter / this.p1.maxSuper) * 100)}%`;
    if (p2SpBar) p2SpBar.style.width = `${Math.max(0, (this.p2.superMeter / this.p2.maxSuper) * 100)}%`;
    if (timerEl) timerEl.innerText = this.roundTimer;
  }

  // ---------------------------------------------------------------------------
  // MOTOR DE RENDERIZAÇÃO RETRÔ ARCADE 2D FIGHTER
  // ---------------------------------------------------------------------------
  render() {
    if (!this.ctx) return;
    const cw = this.canvas.width = this.canvas.clientWidth || FIGHT_VIEW_W;
    const ch = this.canvas.height = this.canvas.clientHeight || FIGHT_VIEW_H;

    this.ctx.clearRect(0, 0, cw, ch);

    // 1. Cenário Retrô (Dojo / Templo / Base)
    this.renderStage(cw, ch);

    // 2. Chão com Perspectiva e Iluminação
    this.renderFloor(cw, ch);

    // 3. Lutadores com Sprites Vetoriais Dinâmicos
    if (this.p1) this.renderFighter(this.p1);
    if (this.p2) this.renderFighter(this.p2);

    // 4. Projéteis (Hadouken com Glow)
    this.renderProjectiles();

    // 5. Faíscas & Ondas de Choque
    this.renderEffects();

    // 6. Textos Flutuantes
    this.renderFloatTexts();
  }

  renderStage(cw, ch) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, FLOOR_Y);
    grad.addColorStop(0, this.selectedStage.skyTop);
    grad.addColorStop(1, this.selectedStage.skyBottom);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, cw, FLOOR_Y);

    // Lua Cheia Neon de Fundo
    this.ctx.fillStyle = 'rgba(255, 234, 0, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(cw / 2, 140, 75, 0, Math.PI * 2);
    this.ctx.fill();

    // Templo / Montanhas Silhueta
    this.ctx.fillStyle = 'rgba(10, 10, 30, 0.7)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, FLOOR_Y);
    this.ctx.lineTo(160, 240);
    this.ctx.lineTo(340, FLOOR_Y);
    this.ctx.lineTo(520, 260);
    this.ctx.lineTo(cw, FLOOR_Y);
    this.ctx.fill();
  }

  renderFloor(cw, ch) {
    this.ctx.fillStyle = this.selectedStage.floorColor;
    this.ctx.fillRect(0, FLOOR_Y, cw, ch - FLOOR_Y);

    this.ctx.strokeStyle = this.selectedStage.floorDetail;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, FLOOR_Y);
    this.ctx.lineTo(cw, FLOOR_Y);
    this.ctx.stroke();

    // Linhas de perspectiva do tatame/asfalto
    this.ctx.lineWidth = 1;
    for (let x = -100; x < cw + 200; x += 90) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, FLOOR_Y);
      this.ctx.lineTo(x + (x - cw / 2) * 0.45, ch);
      this.ctx.stroke();
    }
  }

  renderFighter(f) {
    this.ctx.save();
    this.ctx.translate(f.x, f.y);
    this.ctx.scale(f.facing, 1);

    // Sombra no chão
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 35, 10, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Animação de Postura (Idle Breathing)
    const breath = f.state === 'idle' ? Math.sin(Date.now() * 0.008) * 3 : 0;

    // Pernas (Quimono / Calça)
    this.ctx.fillStyle = f.profile.color;
    this.ctx.strokeStyle = '#050510';
    this.ctx.lineWidth = 2;

    if (f.state === 'kick') {
      // Perna esticada para frente (Chute)
      this.ctx.fillRect(-15, -45, 16, 45);
      this.ctx.fillRect(-5, -60, 55, 18);
    } else if (f.state === 'crouching') {
      this.ctx.fillRect(-22, -35, 20, 35);
      this.ctx.fillRect(4, -35, 20, 35);
    } else {
      this.ctx.fillRect(-18, -48, 16, 48);
      this.ctx.fillRect(4, -48, 16, 48);
    }

    // Tronco / Quimono
    const bodyY = f.state === 'crouching' ? -65 : -90 + breath;
    this.ctx.fillStyle = f.profile.color;
    this.ctx.fillRect(-18, bodyY, 36, 46);

    // Faixa Preta / Vermelha
    this.ctx.fillStyle = f.profile.beltColor;
    this.ctx.fillRect(-20, bodyY + 40, 40, 7);

    // Braços
    this.ctx.fillStyle = f.profile.color;
    if (f.state === 'punch') {
      // Braço esticado com soco potente
      this.ctx.fillRect(0, bodyY + 8, 48, 14);
      this.ctx.fillStyle = '#ffccaa'; // Mão
      this.ctx.fillRect(44, bodyY + 6, 16, 18);
    } else if (f.state === 'block') {
      this.ctx.fillRect(6, bodyY + 2, 14, 38);
    } else {
      this.ctx.fillRect(-10, bodyY + 10, 24, 28);
    }

    // Cabeça
    this.ctx.fillStyle = '#ffccaa';
    this.ctx.fillRect(-12, bodyY - 24, 24, 24);

    // Faixa de Cabeça (Headband)
    this.ctx.fillStyle = f.profile.headband;
    this.ctx.fillRect(-14, bodyY - 20, 28, 6);

    // Cabelo / Avatar
    this.ctx.font = '22px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(f.profile.avatar, 0, bodyY - 14);

    this.ctx.restore();
  }

  renderProjectiles() {
    this.projectiles.forEach(p => {
      this.ctx.save();
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 24;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fill();

      // Núcleo branco incandescente
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  renderEffects() {
    this.hitSparks.forEach(sp => {
      this.ctx.save();
      this.ctx.fillStyle = sp.color;
      this.ctx.shadowColor = sp.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fillRect(sp.x, sp.y, 4, 4);
      this.ctx.restore();
    });

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

  renderFloatTexts() {
    this.floatTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.font = `${ft.size || 14}px "Press Start 2P"`;
      this.ctx.fillStyle = ft.color;
      this.ctx.shadowColor = ft.color;
      this.ctx.shadowBlur = 12;
      this.ctx.globalAlpha = ft.alpha;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });
  }
}

// Instância Global
window.retroStreetFighter = new RetroStreetFighterEngine();
