/* @flow */

if (process.env.BROWSER) {
  throw new Error('Do not import `config.js` from inside the client-side code.');
}

export const PORT = process.env.PORT || 3000;
export const WS_PORT = (__DEV__) ? 3001 : 8080;
// they should be public address
export const WS_HOSTNAMES = process.env.WS_HOSTNAMES
  ? JSON.parse(process.env.WS_HOSTNAMES)
  : ['192.168.1.131'];
export const WS_HOSTS = WS_HOSTNAMES.map(hostname => `${hostname}:${WS_PORT}`);


// CANVAS
export const CANVAS_WIDTH = parseInt(process.env.CANVAS_WIDTH, 10) || 1000;
export const CANVAS_HEIGHT = parseInt(process.env.CANVAS_HEIGHT, 10) || 1000;
export const CANVAS_MIN_X = parseInt(process.env.CANVAS_MIN_X, 10) || 0;
export const CANVAS_MIN_Y = parseInt(process.env.CANVAS_MIN_Y, 10) || 0;
export const CANVAS_MAX_X = CANVAS_MIN_X + (CANVAS_WIDTH - 1);
export const CANVAS_MAX_Y = CANVAS_MIN_Y + (CANVAS_HEIGHT - 1);
export const CANVAS_CENTER_X = Math.round((CANVAS_MIN_X + CANVAS_MAX_X) / 2);
export const CANVAS_CENTER_Y = Math.round((CANVAS_MIN_Y + CANVAS_MAX_Y) / 2);
export const CANVAS_AREA = CANVAS_WIDTH * CANVAS_HEIGHT;

// CHUNK
// export const CHNUK_MIN_X = Math.floor(CANVAS_MIN_X / CHUNK_SIZE);
// export const CHNUK_MIN_Y = Math.floor(CANVAS_MIN_Y / CHUNK_SIZE);
// export const CHNUK_MAX_X = Math.floor(CANVAS_MAX_X / CHUNK_SIZE);
// export const CHNUK_MAX_Y = Math.floor(CANVAS_MAX_Y / CHUNK_SIZE);
// export const CHUNK_BIT_SIZE = 6;

export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const amqp = {

  url: process.env.AMQP_URL || 'amqp://localhost',

  exchange: {
    broadcast: 'sutro',
    status: 'pixel_exchange',
  },

};

// Database
export const databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

};

/**
 * https://auth0.com/docs/connections/social/google
 *
 */
export const auth = {

  // https://developers.facebook.com/
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID || '760672607424544',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '73520727ad89af439fede1f5ee4929b6',
  },

  // https://discordapp.com/developers/applications/me
  discord: {
    clientID: process.env.DISCORD_CLIENT_ID || '316643790293172224',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || 'Atuqc3_jvU6S1X6BOehhyeMskdGtl9vR',
  },

  // https://www.reddit.com/prefs/apps
  reddit: {
    clientID: process.env.REDDIT_CLIENT_ID || 'FgoYAAvOaEAtww',
    clientSecret: process.env.REDDIT_CLIENT_SECRET || 'UdC_efABjTSO9GFfewNKwpaQ3kY',
  },

  // https://cloud.google.com/console/project
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || '292978616912-mcb47r362un8gb1oedv6qipqu1qaqqv4.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'EcGrlTZ9sE_Mudi-kOzRB_-Z',
  },

};


export const ads = {

  adsense: {
    id: 'ca-pub-4111661129974554',
  },

};

export const recaptcha = {
  secret: process.env.RECAPTCHA_SECRET,
};

export const SESSION_SECRET = process.env.SESSION_SECRET || 'cat';

export const forest = {
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
};

export const PROXY_CHECK_SECRET = process.env.PROXY_CHECK_SECRET || '';
