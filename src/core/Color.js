/* @flow */

import tinycolor from 'tinycolor2';


export type ColorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type Color = string;

export const COLORS: Array<Color> = [
  'rgb(255, 255, 255)',
  'rgb(228, 228, 228)',
  'rgb(136, 136, 136)',
  'rgb(34, 34, 34)',
  'rgb(255, 167, 209)',
  'rgb(229, 0, 0)',
  'rgb(229, 149, 0)',
  'rgb(160, 106, 66)',
  'rgb(229, 217, 0)',
  'rgb(148, 224, 68)',
  'rgb(2, 190, 1)',
  'rgb(0, 211, 221)',
  'rgb(0, 131, 199)',
  'rgb(0, 0, 234)',
  'rgb(207, 110, 228)',
  'rgb(130, 0, 128)',
];

export const COLORS_ABGR: Uint32Array = new Uint32Array(16);

COLORS.forEach((hexString: string, index: number) => {
  const color = tinycolor(hexString);
  const { r, g, b } = color.toRgb();
  COLORS_ABGR[index] = (0xFF000000) | (b << 16) | (g << 8) | (r);
});

export const TRANSPARENT: ColorIndex = 0;
