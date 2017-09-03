/* @flow */

import Tone from 'tone';
import StartAudioContext from 'startaudiocontext';


// create a synth and connect it to the master output (your speakers)
const synth = new Tone.Synth({
  oscillator: {
    type: 'sine',
  },
  envelope: {
    attack: 0.01,
    decay: 0,
    sustain: 1,
    release: 0.01,
  },
}).toMaster();


export default store => next => action => {
  const { mute } = store.getState().audio;
  if (mute) return next(action);

  const volume = 0.25;

  switch (action.type) {

    case 'PLACE_PIXEL': {
      // play audio
      // TODO im playing with +0.1 of delay because i dont know how to do 0 delay :(
      synth.triggerAttack('G4', '+0.1', volume);
      synth.setNote('E4', '+0.15');
      synth.setNote('C5', '+0.2');
      synth.triggerRelease('+0.3');
      break;
    }

    case 'SELECT_COLOR' : {
      // play audio
      // TODO im playing with +0.1 of delay because i dont know how to do 0 delay :(
      synth.triggerAttack('C4', '+0.1', volume);
      synth.setNote('E4', '+0.15');
      synth.setNote('G5', '+0.2');
      synth.triggerRelease('+0.3');
      break;
    }

    // different sound for stop_wait
    case 'COOLDOWN_END' : {
      // play audio
      // TODO im playing with +0.1 of delay because i dont know how to do 0 delay :(
      synth.triggerAttack('G4', '+0.1', volume);
      synth.setNote('E4', '+0.15');
      synth.setNote('C5', '+0.2');
      synth.triggerRelease('+0.3');
      break;
    }

    default:
      // nothing
  }

  return next(action);
};

/**
 * This fixes audio on iOS
 * https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
 * https://github.com/Tonejs/Tone.js/issues/167
 */
export function startAudioContext() {
  StartAudioContext(Tone.context, ['canvas', '#colors']);
}
