/**
 * Created by arkeros on 31/5/17.
 *
 * @flow
 */


export default class Counter<T> {

  map: Map<T, number>;

  constructor() {
    this.map = new Map();
  }

  get(item: T): number {
    const count = this.map.get(item) || 0;
    return count;
  }

  add(item: T): void {
    const count = this.get(item);
    this.map.set(item, count + 1);
  }

  delete(item: T): void {
    const count = this.get(item);
    this.map.set(item, count - 1);
  }
}
