/* @flow */

import bluebird from 'bluebird';
import redis from 'redis';
import Redlock from 'redlock';

import { REDIS_URL } from '../config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient(REDIS_URL, { return_buffers: true });

export const redlock = new Redlock(
  // you should have one redis for each redis node
  // in your cluster
  [client],
  {
    // the expected clock drift; for more details
    // see http://redis.io/topics/distlock
    driftFactor: 0.01, // time in ms

    // the max number of times Redlock will attempt
    // to lock a resource before erroring
    retryCount: 5,

    // the time in ms between attempts
    retryDelay: 200, // time in ms

    // the max time in ms randomly added to retries
    // to improve performance under high contention
    // see https://www.awsarchitectureblog.com/2015/03/backoff.html
    retryJitter: 200, // time in ms
  },
);

export default client;
