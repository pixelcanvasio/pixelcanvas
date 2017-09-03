/* @flow */

export type Index = number; // TODO integer >= 0
export type Cell = [number, number];


// http://math.stackexchange.com/questions/617574/inverse-of-ulams-spiral
export function index2cell(u: Index): Cell {
  // THIS CODE WAS WRONG
}

/**
 * http://stackoverflow.com/questions/3706219/algorithm-for-iterating-over-an-outward-spiral-on-a-discrete-2d-grid-from-the-or
 * @param size
 * @param cb
 */
export function iterateGridSpiral(length: number, cb) {
  // (di, dj) is a vector - direction in which we move right now
  let di: number = 1;
  let dj: number = 0;
  // length of current segment
  let segmentLength: number = 1;

  // current position (i, j) and how much of current segment we passed
  let i: number = 0;
  let j: number = 0;
  let segmentPassed = 0;
  cb([0, 0]);
  for (let k = 0; k < length - 1; k += 1) {
    // make a step, add 'direction' vector (di, dj) to current position (i, j)
    i += di;
    j += dj;
    segmentPassed += 1;
    cb([i, j]);

    if (segmentPassed === segmentLength) {
      // done with current segment
      segmentPassed = 0;

      // 'rotate' directions
      [di, dj] = [-dj, di];

      // increase segment length if necessary
      if (dj === 0) {
        segmentLength += 1;
      }
    }
  }
}

/**
 *
 * @param x first coordinate of cell
 * @param y seconds coordinate of cell
 * @returns {number} time to wait in milliseconds
 */
export function getCoolDown(x: number, y: number, cx: number, cy: number): number {
  // TODO fix chapuza
  return 30*1000;
}
