/**
 * Created by arkeros on 14/5/17.
 * @flow
 */

import path from 'path';
import maxmind from 'maxmind';


const lookup = maxmind.openSync(path.join(__dirname, './GeoLite2-City.mmdb'));
const locateIP = lookup.get.bind(lookup);

const lookupISP = maxmind.openSync(path.join(__dirname, './GeoLite2-ASN.mmdb'));
const locateISP = lookupISP.get.bind(lookupISP);

function getContinentOfLocation(location): string {
  return (location && location.continent && location.continent.code)
    ? location.continent.code
    : 'XX';
}

function getCountryOfLocation(location): string {
  return (location && location.country && location.country.iso_code)
    ? location.country.iso_code
    : 'XX';
}

export function getASNOfLocation(location): number {
  // console.log(location);
  return (location && location.autonomous_system_number)
    ? parseInt(location.autonomous_system_number, 10)
    : 0;
}

function isLocationLATAM(location): boolean {
  const continent = getContinentOfLocation(location);

  if (continent === 'NA') {
    const country = getCountryOfLocation(location);
    return country === 'MX';
  }

  return continent === 'SA';
}

/**
 *
 * @param ip the given ipv4 address
 * @returns {string} the country in 2 letter code uppercase
 */
export function getCountryOfIP(ip: string): string {
  return getCountryOfLocation(locateIP(ip));
}

export function getASNOfIP(ip: string): number {
  return getASNOfLocation(locateISP(ip));
}

export function getRegionOfIP(ip: string): string {
  const location = locateIP(ip);
  const continent = getContinentOfLocation(location);

  if (continent === 'SA') {
    return 'LATAM';
  } else if (continent === 'NA') {
    const country = getCountryOfLocation(location);
    return (country === 'MX') ? 'LATAM' : 'NA';
  }

  return continent;
}
