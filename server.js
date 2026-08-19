const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

const PORT = process.env.PORT || 3001;

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          name,
          address: iface.address
        });
      }
    }
  }
  return addresses;
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/api/network-info', async (req, res) => {
  const ips = getLocalIpAddresses();
  const wifiIface = ips.find(i => /wi-?fi|wlan|wireless/i.test(i.name));
  const primaryIp = wifiIface ? wifiIface.address : (ips.length > 0 ? ips[0].address : 'localhost');
  
  const hostHeader = req.headers.host || '';
  const isPublicDomain = hostHeader && !hostHeader.includes('localhost') && !hostHeader.includes('127.0.0.1');
  const protocol = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
  const lanUrl = isPublicDomain ? `${protocol}://${hostHeader}` : `http://${primaryIp}:${PORT}`;
  
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(lanUrl, {
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000033',
        light: '#ffffff'
      },
      width: 240
    });
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err);
  }

  res.json({
    port: PORT,
    primaryIp,
    lanUrl,
    allIps: ips,
    qrCodeDataUrl
  });
});

const rooms = new Map();

function generateRoomCode() {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (rooms.has(code));
  return code;
}

function broadcastToRoom(roomId, message, senderWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  const msgStr = typeof message === 'string' ? message : JSON.stringify(message);
  
  if (room.hostWs && room.hostWs.readyState === WebSocket.OPEN && room.hostWs !== senderWs) {
    room.hostWs.send(msgStr);
  }
  if (room.guestWs && room.guestWs.readyState === WebSocket.OPEN && room.guestWs !== senderWs) {
    room.guestWs.send(msgStr);
  }
}

wss.on('connection', (ws) => {
  let currentRoomId = null;
  let playerRole = null;

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      switch (data.type) {
        case 'CREATE_ROOM': {
          const roomId = generateRoomCode();
          currentRoomId = roomId;
          playerRole = 'host';
          
          rooms.set(roomId, {
            id: roomId,
            hostWs: ws,
            guestWs: null,
            hostReady: false,
            guestReady: false,
            gameMode: data.gameMode || 'action', // Default para ACTION se não especificado!
            actionSubmode: data.actionSubmode || 'random'
          });

          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            roomId,
            role: 'host',
            gameMode: data.gameMode || 'action'
          }));
          break;
        }

        case 'JOIN_ROOM': {
          const requestedId = (data.roomId || '').trim();
          const room = rooms.get(requestedId);

          if (!room) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Código inválido! Sala não encontrada.'
            }));
            return;
          }

          if (room.guestWs && room.guestWs.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Esta sala já está cheia (2/2 jogadores).'
            }));
            return;
          }

          currentRoomId = requestedId;
          playerRole = 'guest';
          room.guestWs = ws;

          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            roomId: currentRoomId,
            role: 'guest',
            gameMode: room.gameMode,
            actionSubmode: room.actionSubmode
          }));

          if (room.hostWs && room.hostWs.readyState === WebSocket.OPEN) {
            room.hostWs.send(JSON.stringify({
              type: 'OPPONENT_JOINED',
              roomId: currentRoomId
            }));
          }
          break;
        }

        case 'PLAYER_READY': {
          const room = rooms.get(currentRoomId);
          if (!room) return;
          
          if (playerRole === 'host') room.hostReady = true;
          if (playerRole === 'guest') room.guestReady = true;

          broadcastToRoom(currentRoomId, {
            type: 'READY_STATUS',
            hostReady: room.hostReady,
            guestReady: room.guestReady
          });

          if (room.hostReady && room.guestReady) {
            broadcastToRoom(currentRoomId, {
              type: 'MATCH_START',
              gameMode: room.gameMode,
              actionSubmode: room.actionSubmode
            });
          }
          break;
        }

        case 'ROUND_START': {
          if (currentRoomId && playerRole === 'host') {
            broadcastToRoom(currentRoomId, {
              type: 'ROUND_START',
              actionId: data.actionId,
              score1: data.score1,
              score2: data.score2
            }, ws);
          }
          break;
        }

        case 'SYNC_GAME_STATE': {
          if (currentRoomId && playerRole === 'host') {
            broadcastToRoom(currentRoomId, {
              type: 'SYNC_GAME_STATE',
              state: data.state
            }, ws);
          }
          break;
        }

        case 'PADDLE_MOVE': {
          if (currentRoomId) {
            broadcastToRoom(currentRoomId, {
              type: 'PADDLE_MOVE',
              role: playerRole,
              y: data.y,
              vy: data.vy
            }, ws);
          }
          break;
        }

        case 'FIRE_BLASTER': {
          if (currentRoomId) {
            broadcastToRoom(currentRoomId, {
              type: 'FIRE_BLASTER',
              role: playerRole,
              y: data.y
            }, ws);
          }
          break;
        }

        case 'ROUND_EVENT': {
          if (currentRoomId && playerRole === 'host') {
            broadcastToRoom(currentRoomId, {
              type: 'ROUND_EVENT',
              event: data.event,
              score1: data.score1,
              score2: data.score2,
              actionSubmode: data.actionSubmode
            }, ws);
          }
          break;
        }

        case 'REMATCH_REQUEST': {
          if (currentRoomId) {
            const room = rooms.get(currentRoomId);
            if (room) {
              room.hostReady = false;
              room.guestReady = false;
              broadcastToRoom(currentRoomId, {
                type: 'REMATCH_REQUESTED',
                by: playerRole
              }, ws);
            }
          }
          break;
        }

        case 'PING': {
          ws.send(JSON.stringify({ type: 'PONG', time: data.time }));
          break;
        }
      }
    } catch (err) {
      console.error('Erro ao processar mensagem WS:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && rooms.has(currentRoomId)) {
      const room = rooms.get(currentRoomId);
      if (playerRole === 'host') {
        if (room.guestWs && room.guestWs.readyState === WebSocket.OPEN) {
          room.guestWs.send(JSON.stringify({
            type: 'OPPONENT_DISCONNECTED',
            message: 'O anfitrião saiu da sala.'
          }));
        }
        rooms.delete(currentRoomId);
      } else if (playerRole === 'guest') {
        room.guestWs = null;
        room.guestReady = false;
        if (room.hostWs && room.hostWs.readyState === WebSocket.OPEN) {
          room.hostWs.send(JSON.stringify({
            type: 'OPPONENT_DISCONNECTED',
            message: 'O oponente desconectou.'
          }));
        }
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIpAddresses();
  console.log(`\n======================================================`);
  console.log(`🏓 RETRO PING PONG - COOLMATH STYLE RODANDO!`);
  console.log(`======================================================`);
  console.log(`Local (neste PC):   http://localhost:${PORT}`);
  if (ips.length > 0) {
    console.log(`\nPara jogar no Wi-Fi Local com outra pessoa:`);
    ips.forEach(ip => {
      console.log(` 📲 http://${ip.address}:${PORT}  (${ip.name})`);
    });
  }
  console.log(`======================================================\n`);
});
