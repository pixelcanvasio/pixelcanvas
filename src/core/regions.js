/**
 * Created by arkeros on 20/5/17.
 * @flow
 */

import logger from './logger';


/**
 *
 * @param r radius
 * @param phi angle
 */
function computeCenter(r, phi) {
  // TODO (remember) the coordinate y is inverted!
  return [r * Math.cos(phi), -r * Math.sin(phi)].map(Math.round);
}

const RADIUS = 2000;
// 60 degrees
const HEX = Math.PI / 3;
// 30 degrees
const ANGLE_OFFSET = Math.PI / 6;


const latinAmerica = computeCenter(RADIUS, ANGLE_OFFSET);
const asia = computeCenter(RADIUS, ANGLE_OFFSET + HEX);
const northAmerica = computeCenter(RADIUS, ANGLE_OFFSET + (2 * HEX));
const oceania = computeCenter(RADIUS, ANGLE_OFFSET + (3 * HEX));
const europe = computeCenter(RADIUS, ANGLE_OFFSET + (4 * HEX));
const africa = computeCenter(RADIUS, ANGLE_OFFSET + (5 * HEX));


export const centers = {
  NA: northAmerica,
  LATAM: latinAmerica,
  EU: europe,
  AF: africa,
  AS: asia,
  OC: oceania,
  XX: africa,
};

logger.debug('REGION_CENTERS', centers);
