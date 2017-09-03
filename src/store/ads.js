/**
 * Created by arkeros on 22/5/17.
 *
 * Copyright 2017 Google Inc. All Rights Reserved.
 * You may study, modify, and use this example for any purpose.
 * Note that this example is provided "as is", WITHOUT WARRANTY
 * of any kind either expressed or implied.
 *
 * @flow
 */

import { playAd } from '../ui/ads';


export default store => next => action => {
  switch (action.type) {

    case 'PLACE_PIXEL': {
      // wait 1 second
      setTimeout(playAd, 300);
      break;
    }

    default:
    // nothing
  }

  return next(action);
};
