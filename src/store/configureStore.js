/* @flow */

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import localForage from 'localforage';

import ads from './ads';
import audio from './audio';
import analytics from './analytics';
import array from './array';
import promise from './promise';
import notifications from './notifications';
import title from './title';
import reducers from '../reducers';


const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

const logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

const createF8Store = applyMiddleware(
  thunk,
  promise,
  array,
  ads,
  audio,
  notifications,
  title,
  analytics,
  logger,
)(createStore);


export default function configureStore(onComplete: ?() => void) {
  // TODO(frantic): reconsider usage of redux-persist, maybe add cache breaker
  const store = autoRehydrate()(createF8Store)(reducers);
  persistStore(store, {
    storage: localForage,
    // TODO only blacklist chunks
    blacklist: ['user', 'canvas', 'modal'],
  }, onComplete);
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}
