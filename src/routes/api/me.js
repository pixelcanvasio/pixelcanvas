/**
 * Created by arkeros
 *
 * @flow
 */

import type { Request, Response } from 'express';

import { getIPFromProxiedRequest } from '../../utils/ip';
import getFingerprint from '../../utils/fingerprint';
import { User } from '../../data/models';


export default async (req: Request, res: Response) => {
  // validation
  // TODO more validation on fingerprint, like characters and so
  req.checkBody('fingerprint', 'fingerprint not valid')
    .notEmpty()
    .isLength({ min: 32, max: 32 });

  const validationResult = await req.getValidationResult();
  if (!validationResult.isEmpty()) {
    res.status(400).json({ errors: validationResult.array() });
    return;
  }

  const ip = await getIPFromProxiedRequest(req);
  if (!ip) {
    res.status(403).json({ errors: ['You are using a proxy!'] });
    return;
  }

  const user = req.user || new User(`ip:${ip}`);
  user.ip = ip;
  user.fingerprint = getFingerprint(req);

  await user.linkFingerprint();

  await user.getWait();
  const { id } = user;
  const name = user.getName();
  const center = await user.getCenter();
  const waitSeconds = user.getWaitSeconds();

  // https://stackoverflow.com/questions/49547/how-to-control-web-page-caching-across-all-browsers
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });
  res.json({ id, name, center, waitSeconds });
};
