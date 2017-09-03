/**
 * Created by arkeros on 30/4/17.
 */

// scp root@eu-central-a.pixelcanvas.io:/var/www/players.json .

import dns from 'dns';
import players from '../players.json';

const whitelist = [
  'edu',  // TODO no confiar
  'vodafone.de',
  'telefonica.de',
  'telia.dk',
  'sgsnet.se',
  'comcast.net',
  'vodafone-ip.de',
  'telia.com',
  'telenor.dk',
  'verizon.net',
  'vodafonedsl.it',
  'tele2.se',
  'movistar.cl',
  'skybroadband.com',
  'fibertel.com.ar',
  'wanadoo.fr',
  'telcel.net.ve',
  'telekom.at',
  'telenet.be',
  'kabel-deutschland.de',
  'plus.pl',
  'bolignet.dk',
  'shawcable.net',
  'rt.ru',
  'rr.com',
  'jazztel.es',
  'googlefiber.net',
  'bcube.co.uk',
  'airtel.net',
  'vodafone.pt',
  'monkeybrains.net',
  'telekom.hu',
  'numericable.fr',
  '3.dk',
  'comxnet.dk',
  'plus.net',
  'onsnetstudenten.nl',
  'ono.com',
  't-com.hr',
  'uniovi.es',
  'plus.com',
  'fiber.nl',
  'tpnet.pl',
  't-ipconnect.de',
  'speedy.com.ar',
  'chello.nl',
  'farlep.net',
  'actcorp.in',
  'viettel.vn',
  'telecomitalia.it',
  'cableonline.com.mx',
  'telecom.net.ar',
  'telefonica-ca.net',
  'gu.se',
  'sefiber.dk',
  'InterCable.net',
  'johnabbott.qc.ca',
  'k12.mo.us',
  'orange.es',
  'cantv.net',
  'digiweb.ie',
  'telebucaramanga.net.co',
  'ziggo.nl',
  'comhem.se',
  'tele2.lv',
  'opticon.hu',
  'telia.net',
  'stofanet.dk',
  'chalmers.se',
  'carnet.hr',
  'apogeeetelecom.com',
  'cableone.net',
  'telepac.pt',
  'comcastbusiness.net',
  'online.no',
  'prairiepride.org',
  'herningsholm.dk',
  'ptd.net',
  'telus.net',
  'burlingtontelecom.net',
  'tricom.net',
  'ertelecom.ru',
  'simnet.is',
  'k12.wi.us',
  'globe.com.ph',
  'jyu.fi',
  'gov.ab.ca',
  'cbhs.org',
  'rogers.com',
  'masmovil.com',
];

const blacklist = [

  // host providers
  'linode.com',
  'all.de',
  'voxility.net',
  'scaleway.com',
  'idfnv.net',
  'keymachine.de',
  '.ovh',
  'lusobits.com',
  'iws.co',
  'serverhub.com',
  'dataclub.biz',
  'orionleads.com.br',
  'vultr.com',
  'cloudmosa.com',
  'my-tss.com',
  'voxility.com',
  'lusobits.com',
  'worldstream.nl',
  'raven-hosting.com',
  'nldedicated.com',
  'feralhosting.com',
  'draculaservers.com',

  // tor
  'torservers.net',
  'torreactor.ml',
  'torproxy.org',
  'torworld.org',
  'thvd.net',
  'tor1.modio.se',
  'tor-exit.csail.mit.edu',
  'tor-exit-ca.yui.cat',
  'tor.matou19.me',
  'tor-exit.talyn.se',
  'torsrvq.snydernet.net',
  'tor-exit.hartvoorinternetvrijheid.nl',
  'tor-exit.r1.apx.pub',
  'tor00.telenet.unc.edu',
  'manalyzer.org',
  'tor-exit.calyxinstitute.org',
  'brmlab.cz',
  'kapustik.info',
  'coldhak.com',
  'enn.lu',
  'apnetwork.it',
  'de-rien.fr',

  // vpn
  'zenmate.com',
  'mullvad.net',

  // others
  'openinternet.io',
  'serverssoft.com',
  'brasshorncomms.uk',
  '.ninja',
  '.wtf',
  '.with',
  '.io',
  // is legitimate
  // '.arpa',
  '.company',
  'ctccomputers.co.uk',
  'nos-oignons.net',
  '7nw.eu',
  'armbrust.me',
  'emfme.net',
  'nemours.org',
  'multisec.no',
  'nard.ca',
  'threembb.co.uk',
  'doutreleau.fr',
  'heimarbeit-online.tv',
  'crypto.quebec',
  '1ideaux.net',
  'brianho.sg',
  'demon.nl',
  'vignontrigenos.com',
  'impium.de',
  'testmy.net',
  // 'virginm.net',
  'asi-spb.ru',
  'costentin.nc',
  'cattywhompus.org',
  'underhost.com',
  'proxy-v02.regioit.de',
  'cartradeexchange.com',
  'b-op.com',
  'nwea.org',
  'saveyourprivacy.is',
  'getstared.tech',
  'cyberghost.ro',
  'zpravodajstvi.info',
  'fundament-proekt.com',
  'primeurscvba.be',
  'uihaus.com',
  'tmemccarngwil.com',
  'simplepc.com',
  'krellis.org',
  'brownpapersrags.pw',
  'randomhack.net',
];

function isWhiteListed(hostname) {
  return whitelist.some(white => hostname.endsWith(`.${white}`));
}

function isBlackListed(hostname) {
  hostname = hostname.toLowerCase();
  if (hostname.includes('tor')) return true;
  if (hostname.includes('vpn')) return true;
  return blacklist.some(black => hostname.endsWith(black));
}

function hasNumber(myString) {
  return /\d/.test(myString);
}


function getHostname(ip) {
  if (ip.includes(':')) {
    ip = ip.split(':').pop();
  }
  // console.log(ip);
  return new Promise((resolve, reject) => {
    dns.reverse(ip, (error, domains) => {
      if (error) {
        resolve();
        return;
      }

      if (domains.every(isWhiteListed)) {
        resolve();
        return;
      }

      if (domains.some(isBlackListed)) {
        resolve();
        return;
      }

      if (!domains.some(hasNumber)) console.log(ip, domains);
      //console.log(ip, domains);
      resolve(domains);
    });
  });
}

/**
 * Cleans up the output (build) directory.
 */
function analyze() {
  const ip = players[0][0];

  return Promise.all(players.map((player) => getHostname(player[0])));
}

export default analyze;
