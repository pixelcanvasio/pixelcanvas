/* @flow */

import http from 'http';
import express from 'express';

import SocketServer from './socket/SocketServer';
import { consumer } from './socket/service';
import forceGC from './core/forceGC';
import logger from './core/logger';
import { SECOND } from './core/constants';
import { WS_PORT } from './config';


const app = express();
const httpServer = http.createServer(app);
const socket = new SocketServer(httpServer);

app.get('/api', async (req, res) => {
  const clients = socket.getConnections();
  const status = 'OK';
  res.json({ status, clients });
});

consumer.on('message', (message: Buffer) => {
  socket.broadcast(message);
});


httpServer.listen(WS_PORT, () => {
  logger.info(`websockets/api is running at http://localhost:${WS_PORT}/`);
});


// Call Garbage Collector every 30 seconds
setInterval(forceGC, 30 * SECOND);
