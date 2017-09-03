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

import 'url-search-params-polyfill';

let adsController;
let available = false;
let fetching = false;
let play = false;
let outstreamContainer;

const adTagParams = new URLSearchParams();
adTagParams.set('ad_type', 'video_image_text');
adTagParams.set('client', 'ca-games-pub-4111661129974554');
adTagParams.set('videoad_start_delay', 0);
adTagParams.set('description_url', 'http://pixelcanvas.io/');
adTagParams.set('max_ad_duration', 20000);
if (__DEV__) adTagParams.set('adtest', 'on');
const adTagUrl = `https://googleads.g.doubleclick.net/pagead/ads?${adTagParams.toString()}`;

/**
 * Request ad. Must be invoked by a user action for mobile devices.
 */
export function requestAds() {
  if (!adsController) return;
  if (available || fetching) return;

  fetching = true;

  adsController.initialize();

  // Request ads
  adsController.requestAds(adTagUrl);
}

/**
 * Allow resizing of the current ad.
 */
function resize() {
  if (adsController) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    adsController.resize(width, height);
  }
}

export function playAd() {
  if (available) {
    play = false;
    available = false;
    outstreamContainer.style.display = 'block';
    adsController.showAd();
  } else {
    play = true;
  }
}

/**
 * Callback for when ad has completed loading.
 */
function onAdLoaded() {
  // Play ad
  available = true;
  fetching = false;
  if (play) playAd();
}

/**
 * Callback for when ad has completed playback.
 */
function onDone() {
  // Show content
  outstreamContainer.style.display = 'none';
}

function init() {
  if (typeof google === 'undefined') return;
  outstreamContainer = document.getElementById('outstreamContainer');

  adsController = new google.outstream.AdsController(
    outstreamContainer,
    onAdLoaded,
    onDone,
  );
}

export default init;

window.addEventListener('resize', resize);
