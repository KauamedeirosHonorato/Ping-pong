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

  const clients = room.clients || [room.hostWs, room.guestWs, room.p3Ws, room.p4Ws].filter(Boolean);
  for (const client of clients) {
    if (client && client.readyState === WebSocket.OPEN && client !== senderWs) {
      if (client.bufferedAmount < 65536) {
        client.send(msgStr);
      }
    }
  }
}

wss.on('connection', (ws) => {
  let currentRoomId = null;
  let playerRole = null; // 'host' (p1), 'guest' (p2), 'p3', 'p4'

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      switch (data.type) {
        case 'CREATE_ROOM': {
          const roomId = generateRoomCode();
          currentRoomId = roomId;
          playerRole = 'host';
          const maxPlayers = data.maxPlayers || (data.modeType === '4p' || data.gameType === '4p_lan' ? 4 : 2);
          
          rooms.set(roomId, {
            id: roomId,
            maxPlayers,
            hostWs: ws,
            guestWs: null,
            p3Ws: null,
            p4Ws: null,
            clients: [ws],
            playerRoles: new Map([[ws, 'host']]),
            readyMap: new Map([['host', false]]),
            gameMode: data.gameMode || 'action',
            actionSubmode: data.actionSubmode || 'random',
            is4P: maxPlayers === 4
          });

          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            roomId,
            role: 'host',
            gameMode: data.gameMode || 'action',
            maxPlayers
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

          // Atribuir slot disponível
          let assignedRole = null;
          if (!room.guestWs || room.guestWs.readyState !== WebSocket.OPEN) {
            assignedRole = 'guest'; // P2
            room.guestWs = ws;
          } else if (room.is4P && (!room.p3Ws || room.p3Ws.readyState !== WebSocket.OPEN)) {
            assignedRole = 'p3'; // P3 (Equipe P1)
            room.p3Ws = ws;
          } else if (room.is4P && (!room.p4Ws || room.p4Ws.readyState !== WebSocket.OPEN)) {
            assignedRole = 'p4'; // P4 (Equipe P2)
            room.p4Ws = ws;
          } else {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: `Esta sala já está cheia (${room.maxPlayers}/${room.maxPlayers} jogadores).`
            }));
            return;
          }

          currentRoomId = requestedId;
          playerRole = assignedRole;
          if (!room.clients.includes(ws)) room.clients.push(ws);
          room.playerRoles.set(ws, assignedRole);
          room.readyMap.set(assignedRole, false);

          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            roomId: currentRoomId,
            role: assignedRole,
            gameMode: room.gameMode,
            actionSubmode: room.actionSubmode,
            is4P: room.is4P,
            maxPlayers: room.maxPlayers
          }));

          // Notificar demais participantes
          broadcastToRoom(currentRoomId, {
            type: 'OPPONENT_JOINED',
            roomId: currentRoomId,
            role: assignedRole,
            playerCount: room.clients.filter(c => c && c.readyState === WebSocket.OPEN).length,
            maxPlayers: room.maxPlayers
          }, ws);
          break;
        }

        case 'PLAYER_READY': {
          const room = rooms.get(currentRoomId);
          if (!room) return;
          
          room.readyMap.set(playerRole, true);

          const readyStatusObj = {
            type: 'READY_STATUS',
            readyMap: Object.fromEntries(room.readyMap),
            hostReady: !!room.readyMap.get('host'),
            guestReady: !!room.readyMap.get('guest'),
            p3Ready: !!room.readyMap.get('p3'),
            p4Ready: !!room.readyMap.get('p4')
          };

          broadcastToRoom(currentRoomId, readyStatusObj);

          // Verificar se todos os players conectados estão prontos
          const activePlayers = [];
          if (room.hostWs && room.hostWs.readyState === WebSocket.OPEN) activePlayers.push('host');
          if (room.guestWs && room.guestWs.readyState === WebSocket.OPEN) activePlayers.push('guest');
          if (room.is4P) {
            if (room.p3Ws && room.p3Ws.readyState === WebSocket.OPEN) activePlayers.push('p3');
            if (room.p4Ws && room.p4Ws.readyState === WebSocket.OPEN) activePlayers.push('p4');
          }

          const minPlayers = room.is4P ? 4 : 2;
          const allReady = activePlayers.length >= minPlayers && activePlayers.every(r => room.readyMap.get(r) === true);

          if (allReady) {
            broadcastToRoom(currentRoomId, {
              type: 'MATCH_START',
              gameMode: room.gameMode,
              actionSubmode: room.actionSubmode,
              is4P: room.is4P
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
              state: data.state,
              d: data.d,
              t: data.t || Date.now()
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
              vy: data.vy,
              t: data.t || Date.now()
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
              for (let key of room.readyMap.keys()) {
                room.readyMap.set(key, false);
              }
              broadcastToRoom(currentRoomId, {
                type: 'REMATCH_REQUESTED',
                by: playerRole
              }, ws);
            }
          }
          break;
        }

        case 'RACE_SYNC': {
          if (currentRoomId && playerRole === 'host') {
            broadcastToRoom(currentRoomId, {
              type: 'RACE_SYNC',
              state: data.state,
              t: data.t || Date.now()
            }, ws);
          }
          break;
        }

        case 'RACE_MOVE': {
          if (currentRoomId) {
            broadcastToRoom(currentRoomId, {
              type: 'RACE_MOVE',
              role: playerRole,
              kartData: data.kartData
            }, ws);
          }
          break;
        }

        case 'RACE_USE_ITEM': {
          if (currentRoomId) {
            broadcastToRoom(currentRoomId, {
              type: 'RACE_USE_ITEM',
              role: playerRole,
              itemData: data.itemData
            }, ws);
          }
          break;
        }

        case 'RACE_DAMAGE': {
          if (currentRoomId) {
            broadcastToRoom(currentRoomId, {
              type: 'RACE_DAMAGE',
              role: playerRole,
              targetId: data.targetId,
              damage: data.damage,
              attackerId: data.attackerId
            }, ws);
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
        broadcastToRoom(currentRoomId, {
          type: 'OPPONENT_DISCONNECTED',
          message: 'O anfitrião encerrou a sala.',
          role: 'host'
        }, ws);
        rooms.delete(currentRoomId);
      } else {
        if (room.playerRoles) room.playerRoles.delete(ws);
        if (room.readyMap) room.readyMap.delete(playerRole);
        if (room.clients) room.clients = room.clients.filter(c => c !== ws);

        if (playerRole === 'guest') room.guestWs = null;
        if (playerRole === 'p3') room.p3Ws = null;
        if (playerRole === 'p4') room.p4Ws = null;

        broadcastToRoom(currentRoomId, {
          type: 'OPPONENT_DISCONNECTED',
          message: `Um jogador (${playerRole ? playerRole.toUpperCase() : 'desconhecido'}) desconectou.`,
          role: playerRole
        }, ws);
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
