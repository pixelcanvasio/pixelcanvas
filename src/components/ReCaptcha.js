/**
 * Created by arkeros on 9/6/17.
 *
 * @flow
 */

import React from 'react';

import type { State } from '../reducers';
import store from '../ui/store';
import { requestPlacePixel } from '../actions';
import { RECAPTCHA_SITEKEY } from '../core/constants';


function onCaptcha(token: string) {
  console.log('token', token);

  const { coordinates, color } = window.pixel;

  store.dispatch(requestPlacePixel(coordinates, color, token));
  grecaptcha.reset();
}
// https://stackoverflow.com/questions/41717304/recaptcha-google-data-callback-with-angularjs
window.onCaptcha = onCaptcha;


const ReCaptcha = () => (
  <div
    className="g-recaptcha"
    data-sitekey={RECAPTCHA_SITEKEY}
    data-callback="onCaptcha"
    data-size="invisible"
  />
);

export default ReCaptcha;
