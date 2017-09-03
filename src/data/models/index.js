/* @flow */

import sequelize from '../sequelize';
import Blacklist from './Blacklist';
import Human from './Human';
import Pixel from './Pixel';
import User from './User';


function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { Blacklist, Human, Pixel, User };
