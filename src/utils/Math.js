/**
 * Created by arkeros on 8/7/17.
 *
 * @flow
 */

export function sum(values: Array<number>): number {
  let total = 0;
  // TODO map reduce
  values.forEach(value => total += value);
  return total;
}
