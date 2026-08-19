// Network Client for LAN Wi-Fi Multiplayer
class NetworkManager {
  constructor() {
    this.ws = null;
    this.roomId = null;
    this.role = null; // 'host' (P1) ou 'guest' (P2)
    this.isConnected = false;
    this.lanInfo = null;
    this.ping = 0;
    this.onOpponentMove = null;
    this.onStateSync = null;
    this.onMatchStart = null;
    this.onRoundStart = null;
    this.onRoundEvent = null;
    this.onBlasterFired = null;
    this.onOpponentLeft = null;
    this.onRematch = null;
    this.onError = null;
  }

  async fetchNetworkInfo() {
    try {
      const res = await fetch('/api/network-info');
      this.lanInfo = await res.json();
      return this.lanInfo;
    } catch (e) {
      console.warn('Não foi possível carregar info de rede:', e);
      return null;
    }
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isConnected = true;
      this.startPingLoop();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (err) {
        console.error('Erro ao ler mensagem WS:', err);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket erro:', err);
    };
  }

  startPingLoop() {
    setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'PING', time: Date.now() }));
      }
    }, 3000);
  }

  createRoom(gameMode, actionSubmode, maxPlayers = 2) {
    this.connect();
    const sendCreate = () => {
      this.ws.send(JSON.stringify({
        type: 'CREATE_ROOM',
        gameMode,
        actionSubmode,
        maxPlayers
      }));
    };

    if (this.ws.readyState === WebSocket.OPEN) {
      sendCreate();
    } else {
      this.ws.addEventListener('open', sendCreate, { once: true });
    }
  }

  joinRoom(roomId) {
    this.connect();
    const sendJoin = () => {
      this.ws.send(JSON.stringify({
        type: 'JOIN_ROOM',
        roomId
      }));
    };

    if (this.ws.readyState === WebSocket.OPEN) {
      sendJoin();
    } else {
      this.ws.addEventListener('open', sendJoin, { once: true });
    }
  }

  setReady() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'PLAYER_READY' }));
    }
  }

  sendPaddleMove(y, vy) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      if (this.ws.bufferedAmount < 16384) {
        this.ws.send(JSON.stringify({
          type: 'PADDLE_MOVE',
          y: Math.round(y * 10) / 10,
          vy: Math.round((vy || 0) * 10) / 10,
          t: Date.now()
        }));
      }
    }
  }

  sendBlasterFire(y) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      this.ws.send(JSON.stringify({
        type: 'FIRE_BLASTER',
        y: Math.round(y * 10) / 10
      }));
    }
  }

  sendRoundStart(actionId, score1, score2) {
    if (this.role === 'host' && this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      this.ws.send(JSON.stringify({
        type: 'ROUND_START',
        actionId,
        score1,
        score2
      }));
    }
  }

  sendGameState(state, isDelta = false) {
    if (this.role === 'host' && this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      if (this.ws.bufferedAmount < 16384) {
        this.ws.send(JSON.stringify({
          type: 'SYNC_GAME_STATE',
          d: isDelta ? 1 : 0,
          state,
          t: Date.now()
        }));
      }
    }
  }

  sendRoundEvent(event, score1, score2, actionSubmode) {
    if (this.role === 'host' && this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      this.ws.send(JSON.stringify({
        type: 'ROUND_EVENT',
        event,
        score1,
        score2,
        actionSubmode
      }));
    }
  }

  sendRematch() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      this.ws.send(JSON.stringify({
        type: 'REMATCH_REQUEST'
      }));
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'ROOM_CREATED':
        this.roomId = data.roomId;
        this.role = 'host';
        this.is4P = !!data.is4P;
        if (this.onRoomCreated) this.onRoomCreated(data.roomId, data);
        break;

      case 'ROOM_JOINED':
        this.roomId = data.roomId;
        this.role = data.role;
        this.is4P = !!data.is4P;
        if (this.onRoomJoined) this.onRoomJoined(data);
        break;

      case 'OPPONENT_JOINED':
        if (this.onOpponentJoined) this.onOpponentJoined(data);
        break;

      case 'READY_STATUS':
        if (this.onReadyStatus) this.onReadyStatus(data);
        break;

      case 'MATCH_START':
        if (this.onMatchStart) this.onMatchStart(data);
        break;

      case 'ROUND_START':
        if (this.onRoundStart) this.onRoundStart(data);
        break;

      case 'PADDLE_MOVE':
        if (this.onOpponentMove) this.onOpponentMove(data);
        break;

      case 'FIRE_BLASTER':
        if (this.onBlasterFired) this.onBlasterFired(data);
        break;

      case 'SYNC_GAME_STATE':
        if (this.onStateSync) this.onStateSync(data.state, data.t, data.d);
        break;

      case 'ROUND_EVENT':
        if (this.onRoundEvent) this.onRoundEvent(data);
        break;

      case 'REMATCH_REQUESTED':
        if (this.onRematch) this.onRematch(data);
        break;

      case 'OPPONENT_DISCONNECTED':
        if (this.onOpponentLeft) this.onOpponentLeft(data.message, data.role);
        break;

      case 'ERROR':
        if (this.onError) this.onError(data.message);
        break;

      case 'RACE_SYNC':
        if (this.onRaceSync) this.onRaceSync(data.state);
        break;

      case 'RACE_MOVE':
        if (this.onRaceMove) this.onRaceMove(data);
        break;

      case 'RACE_USE_ITEM':
        if (this.onRaceUseItem) this.onRaceUseItem(data);
        break;

      case 'RACE_DAMAGE':
        if (this.onRaceDamage) this.onRaceDamage(data);
        break;

      case 'PONG':
        this.ping = Date.now() - data.time;
        break;
    }
  }

  sendRaceSync(state) {
    if (this.role === 'host' && this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      if (this.ws.bufferedAmount < 16384) {
        this.ws.send(JSON.stringify({
          type: 'RACE_SYNC',
          state
        }));
      }
    }
  }

  sendRaceMove(kartData) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      this.ws.send(JSON.stringify({
        type: 'RACE_MOVE',
        kartData
      }));
    }
  }

  sendRaceUseItem(itemData) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      this.ws.send(JSON.stringify({
        type: 'RACE_USE_ITEM',
        itemData
      }));
    }
  }

  sendRaceDamage(targetId, damage, attackerId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId) {
      this.ws.send(JSON.stringify({
        type: 'RACE_DAMAGE',
        targetId,
        damage,
        attackerId
      }));
    }
  }
}

window.networkManager = new NetworkManager();
