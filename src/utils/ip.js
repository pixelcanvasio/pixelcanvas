/**
 * Created by arkeros on 31/5/17.
 *
 * @flow
 */

import dns from 'dns';
import bluebird from 'bluebird';
import isCloudflareIp from 'cloudflare-ip';
import nodeIp from 'ip';

import logger from '../core/logger';
import { getASNOfIP } from './location';


const hostingASN = new Set([
  // Aruba SAS aruba.it
  199653,
  200185,
  // Fishnet
  43317,
  // axarent axarnet.es
  12860,
  // digitalocean
  14061,
  // amazon
  16509,
  // OVH
  16276,
  // webroot.com
  34523,
  // ukfast.co.uk
  34934,
  // dgn.net.tr
  43260,
  // phoenixnap.com
  60558,
  // quadranet.com
  8100,
  // isppro.de
  35366,
  // netelligent.ca
  10929,
  // sg.gs
  24482,
  // xirra.net
  51191,
  // amanah.com
  32489,
  // sologigabit.com
  56934,
  // velia.net
  29066,
  // yesup.com
  22923,
  // softlayer.com
  36351,
  // leaseweb.com
  60781,
  // steadfast.net
  32748,
  // surfeasy.com
  395087,
  // servers.com
  7979,
  // linode.com
  63949,
  // choopa.com
  20473,
  // www.serverhub.com, http://eonix.net/
  30693,
  // i3d.net
  49544,
  // cdn77.com
  60068,
  // virtual-dc.com.au
  58940,
  // intergrid.com.au
  133480,
  // hostuniversal.com.au
  136557,
  // synapsecom.gr
  8280,
  // ipax.at
  44133,
  // latincloud.com
  52270,
  // techfutures.xyz
  394256,
  // netissime.com
  34274,
  // blix.com
  50304,
  // hd.net.nz
  24466,
  // bahnhof.net
  8473,
  // coloau.com.au
  63956,
  // g2khosting.com
  52236,


  // https://github.com/Zalvie/nginx_block_files/blob/master/Big-Lists/Hosting/NS.list
  1421,
  2044,
  2516,
  2828,
  3257,
  3361,
  3595,
  3800,
  3842,
  4436,
  5541,
  5550,
  5577,
  5580,
  6130,
  6315,
  6428,
  6724,
  6870,
  6921,
  6939,
  7162,
  7296,
  7363,
  7385,
  7506,
  7643,
  7819,
  8001,
  8038,
  8100,
  8220,
  8283,
  8312,
  8315,
  8560,
  8624,
  8649,
  8893,
  8943,
  8972,
  9370,
  9482,
  9931,
  10297,
  10439,
  10929,
  11042,
  11282,
  11343,
  11682,
  11753,
  11831,
  11990,
  12179,
  12180,
  12182,
  12260,
  12306,
  12539,
  12552,
  12573,
  12732,
  12824,
  12976,
  12989,
  12993,
  13213,
  13237,
  13287,
  13301,
  13332,
  13335,
  13354,
  13618,
  13722,
  13768,
  13789,
  13790,
  13886,
  13926,
  14037,
  14061,
  14141,
  14242,
  14361,
  14383,
  14442,
  14618,
  14670,
  14745,
  15003,
  15083,
  15133,
  15149,
  15169,
  15189,
  15244,
  15395,
  15418,
  15440,
  15657,
  15692,
  15830,
  15967,
  16125,
  16154,
  16215,
  16265,
  16276,
  16371,
  16509,
  16626,
  16814,
  16862,
  17048,
  17090,
  17139,
  17307,
  17506,
  17511,
  17547,
  17619,
  17858,
  17971,
  18068,
  18229,
  18450,
  18779,
  18866,
  18942,
  19024,
  19066,
  19133,
  19181,
  19194,
  19290,
  19318,
  19437,
  19529,
  19675,
  19742,
  19842,
  19875,
  19969,
  19994,
  20013,
  20454,
  20473,
  20648,
  20720,
  20773,
  20836,
  20853,
  20860,
  21069,
  21155,
  21321,
  21409,
  21500,
  21740,
  21788,
  21793,
  21844,
  22219,
  22363,
  22439,
  22489,
  22576,
  22781,
  23005,
  23033,
  23177,
  23338,
  23352,
  23367,
  23376,
  23393,
  23520,
  23535,
  23884,
  24238,
  24466,
  24482,
  24544,
  24841,
  24889,
  24940,
  24961,
  24971,
  25074,
  25137,
  25148,
  25369,
  25532,
  25653,
  25700,
  25761,
  25767,
  25780,
  25847,
  25861,
  25956,
  26228,
  26272,
  26277,
  26347,
  26496,
  27257,
  27431,
  27589,
  27611,
  27659,
  27988,
  28099,
  28099,
  28271,
  28747,
  28753,
  28877,
  29066,
  29073,
  29076,
  29141,
  29169,
  29182,
  29278,
  29302,
  29550,
  29582,
  29691,
  29761,
  29789,
  29802,
  29838,
  29854,
  29873,
  29889,
  30058,
  30083,
  30094,
  30186,
  30217,
  30266,
  30475,
  30496,
  30633,
  30633,
  30693,
  30736,
  30880,
  30900,
  31034,
  31103,
  31147,
  31342,
  31400,
  31430,
  31577,
  31669,
  31708,
  31727,
  31815,
  31863,
  31953,
  32097,
  32181,
  32244,
  32275,
  32374,
  32392,
  32421,
  32475,
  32489,
  32613,
  32632,
  32748,
  32751,
  32780,
  32875,
  33065,
  33070,
  33182,
  33302,
  33387,
  33438,
  33554,
  33626,
  33785,
  33891,
  33926,
  33970,
  34011,
  34081,
  34119,
  34221,
  34305,
  34309,
  34432,
  34619,
  34702,
  34788,
  34934,
  34971,
  34989,
  35017,
  35366,
  35470,
  35592,
  35625,
  35655,
  35662,
  35908,
  35916,
  35970,
  36024,
  36052,
  36114,
  36137,
  36167,
  36167,
  36236,
  36252,
  36351,
  36352,
  36536,
  36666,
  36824,
  37560,
  37907,
  37963,
  38478,
  38716,
  38935,
  39020,
  39134,
  39138,
  39234,
  39326,
  39451,
  39458,
  39704,
  39743,
  39756,
  39758,
  39792,
  39869,
  39912,
  39948,
  40034,
  40065,
  40156,
  40244,
  40676,
  40819,
  40975,
  41075,
  41108,
  42160,
  42237,
  42244,
  42267,
  42331,
  42455,
  42455,
  42473,
  42612,
  42632,
  42695,
  42708,
  42831,
  42926,
  43146,
  43289,
  43350,
  43470,
  43541,
  43711,
  44158,
  44530,
  44553,
  44633,
  45032,
  45096,
  45146,
  45413,
  45425,
  45570,
  45634,
  45671,
  45753,
  45839,
  46176,
  46261,
  46446,
  46475,
  46562,
  46606,
  46652,
  46664,
  46816,
  46844,
  47155,
  47205,
  47328,
  47447,
  47580,
  47583,
  47692,
  47720,
  47748,
  47869,
  48031,
  48172,
  48326,
  48401,
  48823,
  49335,
  49367,
  49485,
  49505,
  49505,
  49544,
  49687,
  49981,
  50056,
  50126,
  50214,
  50292,
  50300,
  50465,
  50613,
  50673,
  50837,
  50840,
  50872,
  51088,
  51167,
  51191,
  51290,
  51430,
  51461,
  51468,
  51659,
  51765,
  51815,
  51852,
  51945,
  51975,
  52048,
  52148,
  52201,
  52284,
  53055,
  53264,
  53340,
  53444,
  53506,
  53667,
  53755,
  53841,
  53850,
  54455,
  54561,
  54600,
  55053,
  55286,
  55329,
  55405,
  55470,
  55536,
  55635,
  55720,
  55803,
  56030,
  56106,
  56322,
  56322,
  56934,
  57168,
  57169,
  57172,
  57193,
  57367,
  57668,
  57858,
  57954,
  57972,
  58001,
  58207,
  58404,
  58443,
  58940,
  59469,
  59491,
  60558,
  60778,
  61102,
  62567,
  62599,
  62638,
  62639,
  132335,
  132509,
  132597,
  132692,
  196689,
  196752,
  197019,
  197155,
  197226,
  197640,
  197648,
  197988,
  198203,
  198310,
  199339,


  // https://github.com/Zalvie/nginx_block_files/blob/master/Big-Lists/Hosting/CyberGhostVPN.list
  10929,
  12876,
  16276,
  18978,
  19624,
  24971,
  251,
  29802,
  29854,
  30633,
  30736,
  31103,
  3223,
  34989,
  35662,
  36351,
  39743,
  41913,
  42831,
  48533,
  49981,
  50613,
  51852,
  53889,
]);

export function isHosting(ip: string): boolean {
  const asn = getASNOfIP(ip);
  const result = hostingASN.has(asn);
  return result;
}

const reverse = bluebird.promisify(dns.reverse);
const lookup = bluebird.promisify(dns.lookup);
export async function reverseLookup(ip): Promise<[string]> {
  const solutions = [];

  const hostnames = await reverse(ip);

  return hostnames;

  // TODO FIX
  // await Promise.all(hostnames.map(async (hostname) => {
  //   const addresses = await lookup(hostname, {
  //     all: true,
  //     family: 4,
  //   });
  //   if (addresses.includes(ip)) solutions.push(hostname);
  // }));
  //
  // return solutions;
}

function isTrustedHostname(hostname) {
  return (hostname.endsWith('.google.com') && hostname.includes('proxy'));
}


const trusted = new Set();
const untrusted = new Set();
async function isTrustedProxy(ip): Promise<boolean> {
  if (untrusted.has(ip)) return false;
  if (trusted.has(ip)) return true;

  let trust = false;
  try {
    const hostnames = await reverseLookup(ip);
    logger.debug('reverse lookup', ip, hostnames);
    trust = hostnames.some(isTrustedHostname);
  } catch (err) {
    trust = false;
  }
  if (trust) trusted.add(ip);
  else untrusted.add(ip);
  return trust;
}

async function getIPFromList(ipList): ?string {
  if (ipList.length === 1) {
    const clientIp = ipList[0];
    return clientIp;
  } else if (ipList.length === 2) {
    const [firstIp, secondIp] = ipList;

    if (nodeIp.isPrivate(firstIp)) {
      return secondIp;
    }
  }

  logger.warn('Someone is using a POOR chain of proxies!', ipList);
  return null;
}

export async function getIPFromRequest(req): ?string {
  const { socket, connection, headers } = req;
  let ip = (connection ? connection.remoteAddress : socket.remoteAddress);

  if (!ip) return null;

  // sanitize ip to ipv4
  if (ip.includes(':')) {
    ip = ip.split(':').pop();
  }

  const ipList = headers['x-forwarded-for']
    ? headers['x-forwarded-for'].split(',').map(str => str.trim())
    : [];
  ipList.push(ip);
  return getIPFromList(ipList);
}

/**
 * Do not use on not proxied requests. this is how 4chan hacked us!
 * FIX for 4chan bot
 *
 * https://github.com/danneu/cloudflare-ip#example-1-app---heroku---cloudflare
 * @param req
 * @returns {*}
 */
export async function getIPFromProxiedRequest(req): ?string {
  if (__DEV__) {
    return getIPFromRequest(req);
  }

  const { headers } = req;

  if (!headers['x-forwarded-for']) return null;
  if (!headers.origin) return null;
  // if (!headers['referer']) return null;

  const ipList = headers['x-forwarded-for'].split(',').map(str => str.trim());

  if (ipList.length < 3) {
    logger.warn('Someone discovered our address!', headers);
    return null;
  }

  // Load balancer check
  const loadBalancerIp = ipList.pop();
  if (!loadBalancerIp.startsWith('10.')) {
    logger.warn('LB IP expected!', headers);
    return null;
  }

  // CloudFlare Check
  const cfIp = ipList.pop();
  // someone discovered our address
  if (!isCloudflareIp(cfIp)) {
    logger.warn('CloudFlare IP expected!', headers);
    return null;
  }

  return getIPFromList(ipList) || headers['cf-connecting-ip'];
}
