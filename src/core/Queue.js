/* @flow */

/**
 * Created by http://code.stephenmorley.org/javascript/queues/
 */

class Queue<T> {

  array: Array<T>;
  offset: number;

  constructor() {
    this.array = [];
    this.offset = 0;
  }

  /**
   *
   * @returns {number} the length of the queue.
   */
  getLength(): number {
    return this.array.length - this.offset;
  }

  /**
   * Returns true if the queue is empty, and false otherwise.
   * @returns {boolean}
   */
  isEmpty(): boolean {
    return this.array.length === 0;
  }

  /**
   * Enqueues the specified item. The parameter is:
   * @param item the item to enqueue
   */
  enqueue(item: T) {
    this.array.push(item);
  }

  /**
   *  Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  dequeue(): ?T {
    // if the queue is empty, return immediately
    if (this.isEmpty()) return null;

    // store the item at the front of the queue
    const item = this.array[this.offset];

    // increment the first and remove the free space if necessary
    this.offset += 1;
    if (this.offset * 2 >= this.array.length) {
      this.array = this.array.slice(this.offset);
      this.offset = 0;
    }

    // return the dequeued item
    return item;
  }

  /**
   * Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   * @returns {*}
   */
  peek(): ?T {
    if (this.isEmpty()) return null;

    return this.array[this.offset];
  }
}

export default Queue;
