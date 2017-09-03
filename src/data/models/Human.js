/**
 * Created by arkeros on 19/7/17.
 *
 * @flow
 */

import DataType from 'sequelize';
import nodeIp from 'ip';

import Model from '../sequelize';


const Human = Model.define('Human', {

  numIp: {
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
  },

  fingerprint: {
    type: DataType.CHAR(32),
    allowNull: false,
    primaryKey: true,
  },

}, {

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

export default Human;
