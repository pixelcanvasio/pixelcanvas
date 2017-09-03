/**
 * Created by arkeros
 *
 * @flow
 */

import type { Request, Response } from 'express';

import { isHosting } from '../../utils/ip';
import {
  getIPIntelWithCache,
  getProxyCheckWithCache,
  getShroomeyWithCache,
} from '../../core/isProxy';


export default async (req: Request, res: Response) => {
  // validation
  req.checkQuery('ip', 'not valid ip').notEmpty().isIP();

  const validationResult = await req.getValidationResult();
  if (!validationResult.isEmpty()) {
    res.status(400).json({ errors: validationResult.array() });
    return;
  }

  const { ip } = req.query;

  const isDataCenter = isHosting(ip);

  const shroomey = await getShroomeyWithCache(ip);
  const getipintel = await getIPIntelWithCache(ip);
  const proxycheck = await getProxyCheckWithCache(ip);
  res.json({ isDataCenter, shroomey, getipintel, proxycheck });
};
