/**
 * Created by arkeros on 25/5/17.
 *
 * @flow
 */

import Sequelize from 'sequelize';

import logging from '../core/logger';
import { databaseUrl } from '../config';


const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mysql',
  pool: {
    min: 5,
    max: 25,
    idle: 10000,
    acquire: 10000,
    logging,
  },
  dialectOptions: {
    connectTimeout: 10000,
  },
});

export default sequelize;
