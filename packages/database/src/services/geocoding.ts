/**
 * Nominatim Geocoding Service
 * 
 * Uses OpenStreetMap's Nominatim API to convert addresses to coordinates.
 * Free to use with rate limiting (1 request/second).
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'ChicagoHousingHelper/1.0 (contact@chicagohousinghelper.org)';

interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

/**
 * Geocode a single address using Nominatim
 */
export async function geocodeAddress(address: string, city = 'Chicago', state = 'IL'): Promise<GeocodingResult | null> {
  const fullAddress = `${address}, ${city}, ${state}`;
  const url = new URL('/search', NOMINATIM_BASE_URL);
  url.searchParams.set('q', fullAddress);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'us');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      console.error(`Geocoding failed for "${address}": ${response.status}`);
      return null;
    }

    const results: NominatimResponse[] = await response.json();

    if (results.length === 0) {
      console.warn(`No geocoding results for "${address}"`);
      return null;
    }

    const result = results[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
    };
  } catch (error) {
    console.error(`Geocoding error for "${address}":`, error);
    return null;
  }
}

/**
 * Rate-limited batch geocoding
 * Nominatim requires 1 second between requests
 */
export async function batchGeocode(
  addresses: Array<{ id: string; address: string }>,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, GeocodingResult>> {
  const results = new Map<string, GeocodingResult>();
  const total = addresses.length;

  for (let i = 0; i < addresses.length; i++) {
    const { id, address } = addresses[i];

    // Rate limit: 1 request per second
    if (i > 0) {
      await sleep(1000);
    }

    const result = await geocodeAddress(address);
    if (result) {
      results.set(id, result);
    }

    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  return results;
}

/**
 * Generate a Google Maps link from coordinates
 */
export function getGoogleMapsLink(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

/**
 * Generate an Apple Maps link from coordinates
 */
export function getAppleMapsLink(latitude: number, longitude: number): string {
  return `https://maps.apple.com/?ll=${latitude},${longitude}`;
}

/**
 * Generate a generic maps link (opens in Google Maps on most devices)
 */
export function getMapsLink(latitude: number, longitude: number, label?: string): string {
  if (label) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`;
  }
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
