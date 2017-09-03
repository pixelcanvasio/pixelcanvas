/**
 * Created by arkeros on 7/5/17.
 * @flow
 */


/**
 * http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
 * @param a
 * @param b
 * @returns {boolean}
 */
function cellsEquals(a: Cell, b: Cell): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;

  return (a[0] === b[0]) && (a[1] === b[1]);
}

export default cellsEquals;
