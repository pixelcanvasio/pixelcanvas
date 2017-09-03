/**
 * Created by arkeros on 11/7/17.
 *
 * @flow
 */

import path from 'path';
import Liana from 'forest-express-sequelize';

import sequelize from './sequelize';
import {
  forest,
} from '../config';


const liana = Liana.init({
  modelsDir: path.join(__dirname, '../src/data/models'), // Your models directory.
  configDir: path.join(__dirname, '../src/data/forest'),  // Your Forest Smart implementation directory.
  ...forest,
  sequelize, // The sequelize database connection.
});

export default liana;
