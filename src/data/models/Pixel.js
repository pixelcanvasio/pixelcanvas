/**
 * Created by arkeros on 5/5/17.
 *
 * https://github.com/sequelize/sequelize/issues/1485#issuecomment-243822779
 *
 * @flow
 */

import DataType from 'sequelize';
import nodeIp from 'ip';

import logger from '../../core/logger';
import Model from '../sequelize';
import RedisCanvas from './RedisCanvas';
import { MIN_COOLDOWN, HOUR } from '../../core/constants';


const Pixel = Model.define('Pixel', {

  x: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  },

  y: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  },

  color: {
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 15 },
  },

  numIp: {
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
  },

  fingerprint: {
    type: DataType.CHAR(32),
    allowNull: false,
    defaultValue: '00000000000000000000000000000000',
  },

}, {

  indexes: [
    { fields: ['numIp'] },
    { fields: ['fingerprint'] },
  ],

  /**
   * http://docs.sequelizejs.com/manual/tutorial/hooks.html
   */
  hooks: {
    afterUpdate(pixel, options) {
      const { x, y, color } = pixel;
      return RedisCanvas.setColor(x, y, color);
    },
  },

  getterMethods: {
    ip(): string {
      return nodeIp.fromLong(this.numIp);
    },
  },

  setterMethods: {
    ip(value: string): number {
      this.setDataValue('numIp', nodeIp.toLong(value));
    },
  },

});

// Instance Method
const AGE_TO_DOUBLE = 24 * HOUR;
function getCoolDown() {
  const now = Date.now();
  const age = now - this.updatedAt;
  logger.info(age);
  const ageFactor = (1 + Math.sqrt(age / AGE_TO_DOUBLE));
  logger.info(ageFactor);
  return Math.floor(MIN_COOLDOWN * ageFactor) | 0;
}
Pixel.prototype.getCoolDown = getCoolDown;

export default Pixel;
