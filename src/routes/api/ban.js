/**
 * Created by arkeros
 *
 * @flow
 */

import nodeIp from 'ip';
import type { Request, Response } from 'express';

import { drawUnsafe } from '../../core/draw';
import { Blacklist, Pixel } from '../../data/models';


export default async (req: Request, res: Response) => {
  // validation
  req.checkQuery('ip', 'not valid ip').notEmpty().isIP();

  const validationResult = await req.getValidationResult();
  if (!validationResult.isEmpty()) {
    res.status(400).json({ errors: validationResult.array() });
    return;
  }

  const user = req.user;
  if (!user || !user.isAdmin()) {
    res.status(403).json({ errors: ['nice try'] });
    return;
  }

  const { ip } = req.query;
  const numIp = nodeIp.toLong(ip);

  user.ip = ip;
  user.fingerprint = 'BANBANBANBANBANBANBANBANBANBANv0';

  await Blacklist.findOrCreate({
    where: { numIp },
  });

  const dbPixels = await Pixel.findAll({
    where: {
      numIp,
    },
  });

  const pixels = dbPixels.map((pixel) => {
    const { x, y, color, fingerprint } = pixel;
    return { x, y, color, fingerprint };
  });

  await Promise.all(
    pixels
    .filter(({ fingerprint, color }) =>
      !(fingerprint.startsWith('BANBANBAN') && color === 0))
    .map(({ x, y }) => drawUnsafe(user, x, y, 0))
  );

  const count = pixels.length;
  res.json({ numIp, pixels, count });
};
