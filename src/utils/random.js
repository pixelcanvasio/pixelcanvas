/**
 * Created by arkeros on 17/5/17.
 * @flow
 */


export function randomChoice<T>(list: Array<T>): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function randomDice(p): boolean {
  return Math.random() < p;
}

/**
 * The maximum is exclusive and the minimum is inclusive
 * @param {*} pmin
 * @param {*} pmax
 */
export function getRandomInt(pmin: number, pmax: number): number {
  const min = Math.ceil(pmin);
  const max = Math.floor(pmax);
  const n = Math.floor(Math.random() * (max - min)) + min;
  return n | 0;
}
