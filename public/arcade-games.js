// Arcade Classics Engine - Coleção 100% Nativa HTML5 Canvas para o Fliperama Retro
// Jogos Nativos: 1. SPACE INVADERS (1978), 2. ASTEROIDS (1979), 3. PAC-MANIA (1980), 4. BRICK BREAKER (1976)

class ArcadeRetroHub {
  constructor() {
    this.canvas = document.getElementById('arcadeHubCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.activeGame = null; // 'invaders' | 'asteroids' | 'pacmaze' | 'breakout'
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.gameLoopRunning = false;
    this.keys = {};

    this.initInputs();
  }

  initInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      this.keys[e.key] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (this.activeGame) e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.keys[e.key] = false;
    });

    const p1Btn1 = document.getElementById('p1-btn-1');
    if (p1Btn1) {
      p1Btn1.addEventListener('mousedown', () => { this.keys['Space'] = true; });
      p1Btn1.addEventListener('mouseup', () => { this.keys['Space'] = false; });
    }
  }

  launchGame(gameId) {
    this.activeGame = gameId;
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;

    const menu = document.getElementById('main-menu');
    const screen = document.getElementById('arcade-games-screen');
    if (menu) menu.classList.remove('active');
    if (screen) screen.classList.add('active');

    if (gameId === 'invaders') this.initInvaders();
    else if (gameId === 'asteroids') this.initAsteroids();
    else if (gameId === 'pacmaze') this.initPacMaze();
    else if (gameId === 'breakout') this.initBreakout();

    if (!this.gameLoopRunning) {
      this.gameLoopRunning = true;
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }
  }

  quitToMenu() {
    this.activeGame = null;
    const menu = document.getElementById('main-menu');
    const screen = document.getElementById('arcade-games-screen');
    if (screen) screen.classList.remove('active');
    if (menu) menu.classList.add('active');
  }

  // ==========================================
  // 1. SPACE INVADERS (1978)
  // ==========================================
  initInvaders() {
    this.invaderPlayer = { x: 380, y: 530, w: 40, h: 20, speed: 6 };
    this.invaderBullets = [];
    this.enemyBullets = [];
    this.invaders = [];
    this.invaderDir = 1;
    this.invaderSpeed = 1.2;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 9; c++) {
        this.invaders.push({
          x: 100 + c * 65,
          y: 70 + r * 45,
          w: 36,
          h: 24,
          type: r,
          alive: true
        });
      }
    }
  }

  updateInvaders() {
    if (this.gameOver) return;

    if ((this.keys['ArrowLeft'] || this.keys['KeyA']) && this.invaderPlayer.x > 30) {
      this.invaderPlayer.x -= this.invaderPlayer.speed;
    }
    if ((this.keys['ArrowRight'] || this.keys['KeyD']) && this.invaderPlayer.x < 730) {
      this.invaderPlayer.x += this.invaderPlayer.speed;
    }

    if (this.keys['Space'] || this.keys['KeyJ']) {
      if (!this.lastInvaderShoot || Date.now() - this.lastInvaderShoot > 250) {
        this.invaderBullets.push({ x: this.invaderPlayer.x + 18, y: this.invaderPlayer.y - 6, speed: 10 });
        this.lastInvaderShoot = Date.now();
        if (window.retroAudio) window.retroAudio.playPaddleHit();
      }
    }

    this.invaderBullets.forEach((b, idx) => {
      b.y -= b.speed;
      if (b.y < 0) this.invaderBullets.splice(idx, 1);
    });

    if (Math.random() < 0.04 && this.invaders.some(i => i.alive)) {
      const living = this.invaders.filter(i => i.alive);
      const shooter = living[Math.floor(Math.random() * living.length)];
      this.enemyBullets.push({ x: shooter.x + 18, y: shooter.y + 24, speed: 4.5 });
    }

    this.enemyBullets.forEach((b, idx) => {
      b.y += b.speed;
      if (b.x > this.invaderPlayer.x && b.x < this.invaderPlayer.x + this.invaderPlayer.w &&
          b.y > this.invaderPlayer.y && b.y < this.invaderPlayer.y + this.invaderPlayer.h) {
        this.enemyBullets.splice(idx, 1);
        this.lives--;
        if (window.retroAudio) window.retroAudio.playScore();
        if (this.lives <= 0) this.gameOver = true;
      }
      if (b.y > 600) this.enemyBullets.splice(idx, 1);
    });

    let hitEdge = false;
    this.invaders.forEach(inv => {
      if (!inv.alive) return;
      inv.x += this.invaderDir * this.invaderSpeed;
      if (inv.x > 740 || inv.x < 30) hitEdge = true;
      if (inv.y + inv.h >= this.invaderPlayer.y) this.gameOver = true;
    });

    if (hitEdge) {
      this.invaderDir *= -1;
      this.invaders.forEach(inv => { inv.y += 18; });
      this.invaderSpeed = Math.min(this.invaderSpeed + 0.15, 4.5);
    }

    this.invaderBullets.forEach((b, bIdx) => {
      this.invaders.forEach(inv => {
        if (inv.alive && b.x > inv.x && b.x < inv.x + inv.w && b.y > inv.y && b.y < inv.y + inv.h) {
          inv.alive = false;
          this.invaderBullets.splice(bIdx, 1);
          this.score += (4 - inv.type) * 100;
          if (window.retroAudio) window.retroAudio.playWallHit();
        }
      });
    });

    if (this.invaders.every(i => !i.alive)) {
      this.invaderSpeed += 0.8;
      this.invaders.forEach(i => { i.alive = true; i.y -= 100; });
    }
  }

  drawInvaders() {
    const ctx = this.ctx;
    ctx.fillStyle = '#000814';
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 35; i++) {
      const sx = (i * 73) % 800;
      const sy = (i * 127 + Date.now() * 0.02) % 600;
      ctx.fillRect(sx, sy, 2, 2);
    }

    ctx.fillStyle = '#39ff14';
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.invaderPlayer.x, this.invaderPlayer.y + 8, this.invaderPlayer.w, 12);
    ctx.fillRect(this.invaderPlayer.x + 14, this.invaderPlayer.y, 12, 10);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffea00';
    this.invaderBullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 12));

    ctx.fillStyle = '#ff0055';
    this.enemyBullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 10));

    this.invaders.forEach(inv => {
      if (!inv.alive) return;
      ctx.fillStyle = inv.type === 0 ? '#ff0055' : inv.type === 1 ? '#00f0ff' : inv.type === 2 ? '#ffea00' : '#39ff14';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.fillRect(inv.x + 4, inv.y + 4, inv.w - 8, inv.h - 8);
      ctx.fillRect(inv.x + 10, inv.y, 6, 4);
      ctx.fillRect(inv.x + inv.w - 16, inv.y, 6, 4);
      ctx.shadowBlur = 0;
    });

    this.drawHUD('SPACE INVADERS 1978');
  }

  // ==========================================
  // 2. ASTEROIDS (1979)
  // ==========================================
  initAsteroids() {
    this.ship = { x: 400, y: 300, vx: 0, vy: 0, angle: 0, r: 14 };
    this.shipBullets = [];
    this.asteroids = [];

    for (let i = 0; i < 6; i++) {
      this.asteroids.push({
        x: Math.random() < 0.5 ? Math.random() * 200 : 600 + Math.random() * 200,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        r: 32 + Math.random() * 12
      });
    }
  }

  updateAsteroids() {
    if (this.gameOver) return;

    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.ship.angle -= 0.08;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.ship.angle += 0.08;

    if (this.keys['ArrowUp'] || this.keys['KeyW']) {
      this.ship.vx += Math.cos(this.ship.angle) * 0.18;
      this.ship.vy += Math.sin(this.ship.angle) * 0.18;
    }

    this.ship.vx *= 0.985;
    this.ship.vy *= 0.985;
    this.ship.x += this.ship.vx;
    this.ship.y += this.ship.vy;

    if (this.ship.x < 0) this.ship.x = 800;
    if (this.ship.x > 800) this.ship.x = 0;
    if (this.ship.y < 0) this.ship.y = 600;
    if (this.ship.y > 600) this.ship.y = 0;

    if (this.keys['Space'] || this.keys['KeyJ']) {
      if (!this.lastAsteroidShoot || Date.now() - this.lastAsteroidShoot > 220) {
        this.shipBullets.push({
          x: this.ship.x + Math.cos(this.ship.angle) * 16,
          y: this.ship.y + Math.sin(this.ship.angle) * 16,
          vx: Math.cos(this.ship.angle) * 11,
          vy: Math.sin(this.ship.angle) * 11,
          life: 45
        });
        this.lastAsteroidShoot = Date.now();
        if (window.retroAudio) window.retroAudio.playPaddleHit();
      }
    }

    this.shipBullets.forEach((b, idx) => {
      b.x += b.vx;
      b.y += b.vy;
      b.life--;
      if (b.x < 0) b.x = 800; if (b.x > 800) b.x = 0;
      if (b.y < 0) b.y = 600; if (b.y > 600) b.y = 0;
      if (b.life <= 0) this.shipBullets.splice(idx, 1);
    });

    this.asteroids.forEach(ast => {
      ast.x += ast.vx;
      ast.y += ast.vy;
      if (ast.x < 0) ast.x = 800; if (ast.x > 800) ast.x = 0;
      if (ast.y < 0) ast.y = 600; if (ast.y > 600) ast.y = 0;

      const dist = Math.hypot(ast.x - this.ship.x, ast.y - this.ship.y);
      if (dist < ast.r + this.ship.r) {
        this.lives--;
        this.ship.x = 400; this.ship.y = 300; this.ship.vx = 0; this.ship.vy = 0;
        if (window.retroAudio) window.retroAudio.playScore();
        if (this.lives <= 0) this.gameOver = true;
      }
    });

    this.shipBullets.forEach((b, bIdx) => {
      this.asteroids.forEach((ast, aIdx) => {
        if (Math.hypot(b.x - ast.x, b.y - ast.y) < ast.r) {
          this.shipBullets.splice(bIdx, 1);
          this.score += Math.floor(1000 / ast.r);
          if (window.retroAudio) window.retroAudio.playWallHit();

          if (ast.r > 18) {
            this.asteroids.push({
              x: ast.x, y: ast.y,
              vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
              r: ast.r / 1.7
            });
            ast.r = ast.r / 1.7;
            ast.vx = (Math.random() - 0.5) * 4;
            ast.vy = (Math.random() - 0.5) * 4;
          } else {
            this.asteroids.splice(aIdx, 1);
          }
        }
      });
    });

    if (this.asteroids.length === 0) {
      this.initAsteroids();
    }
  }

  drawAsteroids() {
    const ctx = this.ctx;
    ctx.fillStyle = '#050210';
    ctx.fillRect(0, 0, 800, 600);

    ctx.save();
    ctx.translate(this.ship.x, this.ship.y);
    ctx.rotate(this.ship.angle);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-12, -10);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#ffea00';
    this.shipBullets.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    this.asteroids.forEach(ast => {
      ctx.beginPath();
      ctx.arc(ast.x, ast.y, ast.r, 0, Math.PI * 2);
      ctx.stroke();
    });

    this.drawHUD('ASTEROIDS VECTOR 1979');
  }

  // ==========================================
  // 3. BRICK BREAKER / BREAKOUT (1976)
  // ==========================================
  initBreakout() {
    this.paddle = { x: 340, y: 550, w: 120, h: 14, speed: 9 };
    this.ball = { x: 400, y: 350, vx: 5, vy: -5, r: 8 };
    this.bricks = [];

    const colors = ['#ff0055', '#ff7700', '#ffea00', '#39ff14', '#00f0ff'];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 10; c++) {
        this.bricks.push({
          x: 40 + c * 72,
          y: 70 + r * 28,
          w: 66,
          h: 22,
          color: colors[r],
          alive: true
        });
      }
    }
  }

  updateBreakout() {
    if (this.gameOver) return;

    if ((this.keys['ArrowLeft'] || this.keys['KeyA']) && this.paddle.x > 20) {
      this.paddle.x -= this.paddle.speed;
    }
    if ((this.keys['ArrowRight'] || this.keys['KeyD']) && this.paddle.x < 780 - this.paddle.w) {
      this.paddle.x += this.paddle.speed;
    }

    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    if (this.ball.x - this.ball.r < 10 || this.ball.x + this.ball.r > 790) {
      this.ball.vx *= -1;
      if (window.retroAudio) window.retroAudio.playWallHit();
    }
    if (this.ball.y - this.ball.r < 10) {
      this.ball.vy *= -1;
      if (window.retroAudio) window.retroAudio.playWallHit();
    }

    if (this.ball.y > 600) {
      this.lives--;
      this.ball.x = 400; this.ball.y = 350; this.ball.vy = -5;
      if (window.retroAudio) window.retroAudio.playScore();
      if (this.lives <= 0) this.gameOver = true;
    }

    if (this.ball.y + this.ball.r >= this.paddle.y &&
        this.ball.x >= this.paddle.x && this.ball.x <= this.paddle.x + this.paddle.w &&
        this.ball.vy > 0) {
      this.ball.vy = -Math.abs(this.ball.vy);
      const hitRatio = (this.ball.x - (this.paddle.x + this.paddle.w / 2)) / (this.paddle.w / 2);
      this.ball.vx = hitRatio * 7.5;
      if (window.retroAudio) window.retroAudio.playPaddleHit();
    }

    this.bricks.forEach(b => {
      if (b.alive && this.ball.x > b.x && this.ball.x < b.x + b.w &&
          this.ball.y > b.y && this.ball.y < b.y + b.h) {
        b.alive = false;
        this.ball.vy *= -1;
        this.score += 150;
        if (window.retroAudio) window.retroAudio.playPaddleHit();
      }
    });

    if (this.bricks.every(b => !b.alive)) {
      this.initBreakout();
    }
  }

  drawBreakout() {
    const ctx = this.ctx;
    ctx.fillStyle = '#100518';
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h);

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    this.bricks.forEach(b => {
      if (!b.alive) return;
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 6;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.shadowBlur = 0;
    });

    this.drawHUD('BRICK BREAKER ARCADE 1976');
  }

  // ==========================================
  // 4. PAC-MANIA MAZE (1980)
  // ==========================================
  initPacMaze() {
    this.pac = { x: 400, y: 440, dirX: 0, dirY: 0, speed: 4 };
    this.ghosts = [
      { x: 360, y: 260, color: '#ff0000', dirX: 1, dirY: 0, speed: 3 },
      { x: 440, y: 260, color: '#00ffff', dirX: -1, dirY: 0, speed: 3 },
      { x: 400, y: 220, color: '#ffb8ff', dirX: 0, dirY: 1, speed: 3 }
    ];
    this.dots = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 13; c++) {
        if ((r % 2 === 0 || c % 2 === 0) && !(r > 3 && r < 6 && c > 4 && c < 8)) {
          this.dots.push({ x: 80 + c * 54, y: 80 + r * 50, eaten: false });
        }
      }
    }
  }

  updatePacMaze() {
    if (this.gameOver) return;

    if (this.keys['ArrowLeft'] || this.keys['KeyA']) { this.pac.dirX = -1; this.pac.dirY = 0; }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) { this.pac.dirX = 1; this.pac.dirY = 0; }
    if (this.keys['ArrowUp'] || this.keys['KeyW']) { this.pac.dirX = 0; this.pac.dirY = -1; }
    if (this.keys['ArrowDown'] || this.keys['KeyS']) { this.pac.dirX = 0; this.pac.dirY = 1; }

    this.pac.x += this.pac.dirX * this.pac.speed;
    this.pac.y += this.pac.dirY * this.pac.speed;

    if (this.pac.x < 30) this.pac.x = 770;
    if (this.pac.x > 770) this.pac.x = 30;
    if (this.pac.y < 50) this.pac.y = 550;
    if (this.pac.y > 550) this.pac.y = 50;

    this.dots.forEach(d => {
      if (!d.eaten && Math.hypot(this.pac.x - d.x, this.pac.y - d.y) < 14) {
        d.eaten = true;
        this.score += 50;
        if (window.retroAudio) window.retroAudio.playPaddleHit();
      }
    });

    this.ghosts.forEach(g => {
      g.x += g.dirX * g.speed;
      g.y += g.dirY * g.speed;

      if (Math.random() < 0.03 || g.x < 50 || g.x > 750 || g.y < 70 || g.y > 530) {
        const dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        const chosen = dirs[Math.floor(Math.random() * dirs.length)];
        g.dirX = chosen.x;
        g.dirY = chosen.y;
      }

      if (Math.hypot(this.pac.x - g.x, this.pac.y - g.y) < 22) {
        this.lives--;
        this.pac.x = 400; this.pac.y = 440; this.pac.dirX = 0; this.pac.dirY = 0;
        if (window.retroAudio) window.retroAudio.playScore();
        if (this.lives <= 0) this.gameOver = true;
      }
    });

    if (this.dots.every(d => d.eaten)) {
      this.initPacMaze();
    }
  }

  drawPacMaze() {
    const ctx = this.ctx;
    ctx.fillStyle = '#000008';
    ctx.fillRect(0, 0, 800, 600);

    ctx.strokeStyle = '#0000ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 50, 720, 500);

    ctx.fillStyle = '#ffb8ae';
    this.dots.forEach(d => {
      if (!d.eaten) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(this.pac.x, this.pac.y, 16, 0.25 * Math.PI, 1.75 * Math.PI);
    ctx.lineTo(this.pac.x, this.pac.y);
    ctx.fill();

    this.ghosts.forEach(g => {
      ctx.fillStyle = g.color;
      ctx.beginPath();
      ctx.arc(g.x, g.y - 4, 14, Math.PI, 0, false);
      ctx.lineTo(g.x + 14, g.y + 12);
      ctx.lineTo(g.x - 14, g.y + 12);
      ctx.closePath();
      ctx.fill();
    });

    this.drawHUD('PAC-MANIA RETRO 1980');
  }

  // ==========================================
  // 5. SNAKE RETRO 1997
  // ==========================================
  initSnake() {
    this.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    this.snakeDir = { x: 1, y: 0 };
    this.nextSnakeDir = { x: 1, y: 0 };
    this.snakeFood = { x: 18, y: 12 };
    this.snakeSpeed = 85;
    this.lastSnakeTick = Date.now();
  }

  updateSnake() {
    if (this.gameOver) return;

    if ((this.keys['ArrowUp'] || this.keys['KeyW']) && this.snakeDir.y === 0) this.nextSnakeDir = { x: 0, y: -1 };
    if ((this.keys['ArrowDown'] || this.keys['KeyS']) && this.snakeDir.y === 0) this.nextSnakeDir = { x: 0, y: 1 };
    if ((this.keys['ArrowLeft'] || this.keys['KeyA']) && this.snakeDir.x === 0) this.nextSnakeDir = { x: -1, y: 0 };
    if ((this.keys['ArrowRight'] || this.keys['KeyD']) && this.snakeDir.x === 0) this.nextSnakeDir = { x: 1, y: 0 };

    if (Date.now() - this.lastSnakeTick > this.snakeSpeed) {
      this.snakeDir = this.nextSnakeDir;
      const head = { x: this.snake[0].x + this.snakeDir.x, y: this.snake[0].y + this.snakeDir.y };

      // Wall wrap
      if (head.x < 0) head.x = 31;
      if (head.x >= 32) head.x = 0;
      if (head.y < 0) head.y = 23;
      if (head.y >= 24) head.y = 0;

      // Self collision
      if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        this.lives--;
        if (window.retroAudio) window.retroAudio.playScore();
        if (this.lives <= 0) this.gameOver = true;
        else this.initSnake();
        return;
      }

      this.snake.unshift(head);

      // Eat Food
      if (head.x === this.snakeFood.x && head.y === this.snakeFood.y) {
        this.score += 100;
        this.snakeFood = {
          x: Math.floor(Math.random() * 30) + 1,
          y: Math.floor(Math.random() * 22) + 1
        };
        if (window.retroAudio) window.retroAudio.playPaddleHit();
      } else {
        this.snake.pop();
      }

      this.lastSnakeTick = Date.now();
    }
  }

  drawSnake() {
    const ctx = this.ctx;
    ctx.fillStyle = '#06180a';
    ctx.fillRect(0, 0, 800, 600);

    // Grid border
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 40, 780, 545);

    // Food
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.snakeFood.x * 24 + 16, this.snakeFood.y * 22 + 48, 18, 18);
    ctx.shadowBlur = 0;

    // Snake Body
    this.snake.forEach((seg, idx) => {
      ctx.fillStyle = idx === 0 ? '#ffea00' : '#39ff14';
      ctx.fillRect(seg.x * 24 + 16, seg.y * 22 + 48, 20, 18);
    });

    this.drawHUD('SNAKE NOSTALGIA 1997');
  }

  // ==========================================
  // 6. FLAPPY ARCADE NEON
  // ==========================================
  initFlappy() {
    this.bird = { x: 180, y: 300, vy: 0, r: 16 };
    this.pipes = [];
    this.pipeSpeed = 4.2;
    this.lastPipeSpawn = Date.now();

    this.pipes.push({ x: 700, topH: 180, bottomY: 340, passed: false });
  }

  updateFlappy() {
    if (this.gameOver) return;

    if (this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['KeyJ']) {
      if (!this.lastFlap || Date.now() - this.lastFlap > 180) {
        this.bird.vy = -7.5;
        this.lastFlap = Date.now();
        if (window.retroAudio) window.retroAudio.playPaddleHit();
      }
    }

    this.bird.vy += 0.42; // Gravity
    this.bird.y += this.bird.vy;

    if (this.bird.y > 580 || this.bird.y < 20) {
      this.lives--;
      if (this.lives <= 0) this.gameOver = true;
      else this.initFlappy();
    }

    // Pipes Spawn & Move
    if (Date.now() - this.lastPipeSpawn > 1400) {
      const topH = Math.floor(Math.random() * 240) + 60;
      this.pipes.push({ x: 800, topH: topH, bottomY: topH + 160, passed: false });
      this.lastPipeSpawn = Date.now();
    }

    this.pipes.forEach((p, idx) => {
      p.x -= this.pipeSpeed;

      // Pass & Score
      if (!p.passed && p.x < this.bird.x) {
        p.passed = true;
        this.score += 200;
        if (window.retroAudio) window.retroAudio.playWallHit();
      }

      // Pipe Collision
      if (this.bird.x + this.bird.r > p.x && this.bird.x - this.bird.r < p.x + 60) {
        if (this.bird.y - this.bird.r < p.topH || this.bird.y + this.bird.r > p.bottomY) {
          this.lives--;
          if (window.retroAudio) window.retroAudio.playScore();
          if (this.lives <= 0) this.gameOver = true;
          else this.initFlappy();
        }
      }

      if (p.x < -80) this.pipes.splice(idx, 1);
    });
  }

  drawFlappy() {
    const ctx = this.ctx;
    ctx.fillStyle = '#0a001a';
    ctx.fillRect(0, 0, 800, 600);

    // Pipes
    this.pipes.forEach(p => {
      ctx.fillStyle = '#39ff14';
      ctx.shadowColor = '#39ff14';
      ctx.shadowBlur = 8;
      ctx.fillRect(p.x, 0, 56, p.topH);
      ctx.fillRect(p.x, p.bottomY, 56, 600 - p.bottomY);
      ctx.shadowBlur = 0;
    });

    // Bird
    ctx.fillStyle = '#ffea00';
    ctx.shadowColor = '#ffea00';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.bird.x, this.bird.y, this.bird.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillRect(this.bird.x + 6, this.bird.y - 6, 4, 4);
    ctx.shadowBlur = 0;

    this.drawHUD('FLAPPY ARCADE NEON');
  }

  // ==========================================
  // HUD & MAIN LOOP
  // ==========================================
  drawHUD(title) {
    const ctx = this.ctx;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Press Start 2P", monospace, sans-serif';
    ctx.fillText(title, 20, 28);
    ctx.fillText(`SCORE: ${this.score}`, 400, 28);
    ctx.fillText(`VIDAS: ${'❤️ '.repeat(Math.max(0, this.lives))}`, 620, 28);

    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#ff0055';
      ctx.font = 'bold 24px "Press Start 2P", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', 400, 270);
      ctx.fillStyle = '#ffea00';
      ctx.font = '12px "Press Start 2P", monospace, sans-serif';
      ctx.fillText(`SCORE FINAL: ${this.score}`, 400, 320);
      ctx.fillText('PRESSIONE ESPAÇO PARA RECOMEÇAR', 400, 360);
      ctx.textAlign = 'left';

      if (this.keys['Space']) {
        this.launchGame(this.activeGame);
      }
    }
  }

  loop() {
    if (this.activeGame === 'invaders') {
      this.updateInvaders();
      this.drawInvaders();
    } else if (this.activeGame === 'asteroids') {
      this.updateAsteroids();
      this.drawAsteroids();
    } else if (this.activeGame === 'breakout') {
      this.updateBreakout();
      this.drawBreakout();
    } else if (this.activeGame === 'pacmaze') {
      this.updatePacMaze();
      this.drawPacMaze();
    } else if (this.activeGame === 'snake') {
      this.updateSnake();
      this.drawSnake();
    } else if (this.activeGame === 'flappy') {
      this.updateFlappy();
      this.drawFlappy();
    }

    requestAnimationFrame(this.loop);
  }
}

window.arcadeRetroHub = new ArcadeRetroHub();

