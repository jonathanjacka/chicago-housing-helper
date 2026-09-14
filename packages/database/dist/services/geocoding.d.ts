/**
 * Nominatim Geocoding Service
 *
 * Uses OpenStreetMap's Nominatim API to convert addresses to coordinates.
 * Free to use with rate limiting (1 request/second).
 */
interface GeocodingResult {
    latitude: number;
    longitude: number;
    displayName: string;
}
/**
 * Geocode a single address using Nominatim
 */
export declare function geocodeAddress(address: string, city?: string, state?: string): Promise<GeocodingResult | null>;
/**
 * Rate-limited batch geocoding
 * Nominatim requires 1 second between requests
 */
export declare function batchGeocode(addresses: Array<{
    id: string;
    address: string;
}>, onProgress?: (completed: number, total: number) => void): Promise<Map<string, GeocodingResult>>;
/**
 * Generate a Google Maps link from coordinates
 */
export declare function getGoogleMapsLink(latitude: number, longitude: number): string;
/**
 * Generate an Apple Maps link from coordinates
 */
export declare function getAppleMapsLink(latitude: number, longitude: number): string;
/**
 * Generate a generic maps link (opens in Google Maps on most devices)
 */
export declare function getMapsLink(latitude: number, longitude: number, label?: string): string;
export {};
//# sourceMappingURL=geocoding.d.ts.map