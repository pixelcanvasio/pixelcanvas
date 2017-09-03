/**
 * Notifications
 *
 * @flow
 */

import Push from 'push.js';


export default store => next => action => {
  if (!Push.isSupported) return next(action);

  switch (action.type) {

    case 'PLACE_PIXEL': {
      // request permission
      Push.Permission.request(null, null);

      // clear notifications
      Push.clear();
      break;
    }

    case 'COOLDOWN_END': {
      Push.create('Your next pixel is now available', {
        icon: '/tile.png',
        silent: true,
        vibrate: [200, 100],
        onClick() {
          parent.focus();
          window.focus();
          Push.clear();
        },
      });
      break;
    }

    default:
      // nothing
  }

  return next(action);
};
