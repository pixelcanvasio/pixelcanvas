/* @flow */

/**
 * Created by arkeros on 15/03/2017.
 */


import EventEmitter from 'events';
import url from 'url';
import WebSocket from 'ws';

import redis from '../data/redis';
import logger from '../core/logger';
import Counter from '../utils/Counter';
import { getIPFromRequest } from '../utils/ip';


const ipCounter: Counter<string> = new Counter();

function heartbeat() {
  this.isAlive = true;
}

async function verifyClient(info, done) {
  const { req } = info;

  const ip = await getIPFromRequest(req);

  // Limiting socket connections per ip
  if (ipCounter.get(ip) > 100) {
    return done(false);
  }

  const location = url.parse(req.url, true);

  // console.log('location', location.query);
  if (!('fingerprint' in location.query)) {
    logger.warn('redis does not send fingerprint', ip);
    return done(false);
  }

  if (location.query.fingerprint.length !== 32) {
    logger.warn('fingerprint length not 32', ip);
    return done(false);
  }

  return done(true);
}

class SocketServer extends EventEmitter {

  wss: WebSocket.Server;

  constructor(server: http.Server) {
    super();

    const wss = new WebSocket.Server({
      perMessageDeflate: false,
      clientTracking: true,
      // suggested by @Blitz
      maxPayload: 16,
      server,
      verifyClient,
    });
    this.wss = wss;

    wss.on('error', logger.error);

    wss.on('connection', async (ws, req) => {
      ws.isAlive = true;
      ws.startDate = Date.now();
      ws.on('pong', heartbeat);

      const ip = await getIPFromRequest(req);
      ipCounter.add(ip);
      ws.on('error', logger.error);
      ws.on('close', () => ipCounter.delete(ip));

      if (!ip) return;

      const location = url.parse(req.url, true);
      const { fingerprint: browserFingerprint } = location.query;

      const userId = `ip:${ip}`;
      const fingerprint = browserFingerprint;
      await redis.setAsync(`wslink:${userId}:${fingerprint}`, 'y', 'EX', 3600);
    });

    this.ping = this.ping.bind(this);
    this.killOld = this.killOld.bind(this);

    setInterval(this.killOld, 10 * 60 * 1000);
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    setInterval(this.ping, 45 * 1000);
  }

  /**
   * https://github.com/websockets/ws/issues/617
   * @param data
   */
  broadcast(data: Buffer) {
    const frame = WebSocket.Sender.frame(data, {
      readOnly: true,
      mask: false,
      rsv1: false,
      opcode: 2,
      fin: true,
    });

    // console.log('broadcast', data, frame);

    this.wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        frame.forEach((buffer) => {
          try {
            ws._socket.write(buffer);
          } catch (error) {
            logger.error('(!) Catched error on write socket:', error);
          }
        });
      }
    });
  }

  getConnections(): number {
    return this.wss.clients.size || 0;
  }

  killOld() {
    const now = Date.now();
    this.wss.clients.forEach((ws) => {
      const lifetime = now - ws.startDate;
      if (lifetime > 30 * 60 * 1000) ws.terminate();
    });
  }

  ping() {
    this.wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();

      ws.isAlive = false;
      ws.ping('', false, true);
    });
  }

}

export default SocketServer;
