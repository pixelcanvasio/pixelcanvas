/**
 * Created by arkeros on 11/7/17.
 *
 * @flow
 */

'use strict';
const Liana = require('forest-express-sequelize');
const nodeIp = require('ip');


Liana.collection('Pixel', {

  fields: [
    {
      field: 'ip',
      type: 'String',
      get(pixel) {
        if (!pixel.numIp) return '';

        return nodeIp.fromLong(pixel.numIp);
      },
    },
  ],

});
