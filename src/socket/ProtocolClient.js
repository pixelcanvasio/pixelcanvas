/**
 * Created by arkeros on 16/03/2017.
 *
 * @flow
 */


import EventEmitter from 'events';

import PixelUpdate from './packets/PixelUpdate';


class ProtocolClient extends EventEmitter {

  url: string;
  ws: WebSocket;
  fingerprint: string;

  async connect() {
    let url;
    try {
      const response = await fetch('/api/ws');
      if (!response.ok) throw new Error('websockets/api: response not ok');
      const data = await response.json();
      url = data.url;
    } catch (e) {
      console.error(e.message || e);
    }

    if (!url) url = 'ws://ws.pixelcanvas.io:8080';

    this.url = url;
    this.ws = new WebSocket(`${url}/?fingerprint=${this.fingerprint}`);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  onOpen() {
    this.emit('open', {});
    // TODO something more?
  }

  onError(err) {
    console.error(`Socket encountered error: ${err.message}. Closing socket`);
    this.ws.close();
  }

  onMessage({ data: buffer }) {
    if (buffer.byteLength === 0) return;
    // console.log('received: ', buffer);
    const data = new DataView(buffer);
    const opcode = data.getUint8(0);
    // console.log(`OPCODE ${opcode}`);

    switch (opcode) {
      case PixelUpdate.OP_CODE:
        this.emit('pixelUpdate', PixelUpdate.hydrate(data));
        break;
      default:
        // console.error(`Unknown op_code ${opcode} received`);
        break;
    }
  }

  onClose(e) {
    console.warn('Socket is closed. ' +
      'Reconnect will be attempted in 1 second.', e.reason);
    this.emit('close');
    // try to reconnect in 1seconds
    // http://stackoverflow.com/questions/22431751/websocket-how-to-automatically-reconnect-after-it-dies
    // TODO fix reconnect trial time is dangerous, double each failure!
    setTimeout(() => this.connect(), 5000);
  }

  close() {
    this.ws.close();
  }
}

export default new ProtocolClient();
