/**
 * Created by arkeros on 9/6/17.
 *
 * @flow
 */


function getFingerprint(req) {
  const { fingerprint: browserFingerprint } = req.body;
  return `${browserFingerprint}`;
}

export default getFingerprint;
