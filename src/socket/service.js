/**
 * Created by arkeros on 17/5/17.
 *
 * https://www.cloudamqp.com/blog/2015-05-19-part2-2-rabbitmq-for-beginners_example-and-sample-code-node-js.html
 * https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
 * https://github.com/reddit/reddit-service-websockets/blob/330ade0c2060487beaf70a5b0ffd828089fe03a3/reddit_service_websockets/source.py
 *
 * @flow
 */

import EventEmitter from 'events';
import amqplib from 'amqplib';

import Queue from '../utils/Queue';
import logger from '../core/logger';
import { amqp } from '../config';


let amqpConn;
const RECONNECT_INTERVAL = 1000;
const BROADCAST_EXCHANGE = amqp.exchange.broadcast;
const durable = false;


function closeOnError(error) {
  if (!error) return false;
  logger.error('[AMQP] error', error);
  amqpConn.close();
  return true;
}

class Publisher {

  channel: Objet;
  offline: Queue<Array>;

  constructor() {
    this.offline = new Queue();
  }

  async start() {
    try {
      const channel = await amqpConn.createConfirmChannel();
      channel.on('error', (error) => {
        logger.error('[AMQP] channel error', error.message);
      });
      channel.on('close', () => {
        logger.warn('[AMQP] channel closed');
      });

      await channel.assertExchange(BROADCAST_EXCHANGE, 'fanout', { durable });
      this.channel = channel;
      let message;
      while (true) {
        message = this.offline.dequeue();
        if (!message) break;
        this.publish(...message);
      }
    } catch (e) {
      closeOnError(e);
    }
  }

  setUpChannel() {

  }

  publish(exchange, routingKey, buffer: Buffer) {
    try {
      this.channel.publish(exchange, routingKey, buffer, { persistent: true });
    } catch (e) {
      logger.info('[AMQP] publish', e.message);
      this.offline.push([exchange, routingKey, buffer]);
      this.channel.connection.close();
    }
  }

}

class Consumer extends EventEmitter {

  constructor() {
    super();
    this.onMessage = this.onMessage.bind(this);
  }

  async start() {
    try {
      const channel = await amqpConn.createChannel();
      channel.on('error', (error) => {
        logger.error('[AMQP] channel error', error.message || error);
      });
      channel.on('close', () => {
        logger.warn('[AMQP] channel closed');
      });

      channel.prefetch(10);
      await channel.assertExchange(BROADCAST_EXCHANGE, 'fanout', { durable });
      const { queue } = await channel.assertQueue('', {
        exclusive: true,
        autoDelete: true,
        durable,
      });
      await channel.bindQueue(queue, BROADCAST_EXCHANGE, '');
      channel.consume(queue, this.onMessage, { noAck: true });
    } catch (e) {
      closeOnError(e);
    }
  }

  onMessage(message) {
    // console.log('message', message);
    this.emit('message', message.content);
  }
}

const publisher = new Publisher();
export const consumer = new Consumer();
function whenConnected() {
  publisher.start();
  consumer.start();
}

async function start() {
  try {
    const connection = await amqplib.connect(amqp.url);
    connection.on('error', (error) => {
      if (error.message !== 'Connection closing') {
        logger.error('[AMQP] connection error', error.message || error);
      }
    });
    connection.on('close', () => {
      logger.warn('[AMQP] reconnecting');
      return setTimeout(start, RECONNECT_INTERVAL);
    });

    logger.info('[AMQP] connected');
    amqpConn = connection;
    whenConnected();
  } catch (e) {
    logger.error('[AMQP]', e.message || e);
    return setTimeout(start, RECONNECT_INTERVAL);
  }
}

start();

export function broadcast(buffer: Buffer) {
  publisher.publish(BROADCAST_EXCHANGE, '', buffer);
}
