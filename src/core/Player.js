/* @flow */


class Player {
  wait: ?number; // date

  constructor() {
    this.wait = null;
  }
  setWait(wait) {
    this.wait = wait;
  }
}

export default Player;
