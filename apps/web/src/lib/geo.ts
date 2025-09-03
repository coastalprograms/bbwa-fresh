/**
 * Geolocation utilities for site check-in functionality
 */

export interface Coordinates {
  lat: number
  lng: number
}

export interface JobSite {
  id: string
  name: string
  lat: number
  lng: number
  radius_m: number
  active: boolean
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in metres
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371000 // Earth's radius in metres
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180

  const lat1Rad = toRadians(point1.lat)
  const lat2Rad = toRadians(point2.lat)
  const deltaLatRad = toRadians(point2.lat - point1.lat)
  const deltaLngRad = toRadians(point2.lng - point1.lng)

  const a = 
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}

/**
 * Find the nearest job site within radius
 * @param userLocation User's current coordinates
 * @param jobSites Array of available job sites
 * @returns Nearest job site within radius or null if none found
 */
export function findNearestSite(userLocation: Coordinates, jobSites: JobSite[]): JobSite | null {
  let nearestSite: JobSite | null = null
  let shortestDistance = Infinity

  for (const site of jobSites) {
    if (!site.active) continue

    const distance = calculateDistance(userLocation, { lat: site.lat, lng: site.lng })
    
    // Check if within the site's radius and is closer than previous sites
    if (distance <= site.radius_m && distance < shortestDistance) {
      nearestSite = site
      shortestDistance = distance
    }
  }

  return nearestSite
}

/**
 * Check if coordinates are within a job site's radius
 * @param userLocation User's coordinates
 * @param jobSite Job site to check against
 * @returns True if user is within the site's radius
 */
export function isWithinSiteRadius(userLocation: Coordinates, jobSite: JobSite): boolean {
  const distance = calculateDistance(userLocation, { lat: jobSite.lat, lng: jobSite.lng })
  return distance <= jobSite.radius_m
}

/**
 * Validate coordinates are reasonable for Australian locations
 * @param coords Coordinates to validate
 * @returns True if coordinates appear to be valid Australian coordinates
 */
export function validateAustralianCoordinates(coords: Coordinates): boolean {
  const { lat, lng } = coords
  
  // Rough bounds for Australia
  // Latitude: -44 to -9 (south to north)
  // Longitude: 112 to 154 (west to east)
  return lat >= -44 && lat <= -9 && lng >= 112 && lng <= 154
}

/**
 * Format coordinates for display
 * @param coords Coordinates to format
 * @param precision Number of decimal places (default: 4)
 * @returns Formatted coordinate string
 */
export function formatCoordinates(coords: Coordinates, precision: number = 4): string {
  return `${coords.lat.toFixed(precision)}, ${coords.lng.toFixed(precision)}`
}

/**
 * Get user's current location using browser geolocation API
 * @param options Geolocation options
 * @returns Promise that resolves to user coordinates or rejects with error
 */
export function getCurrentLocation(options?: PositionOptions): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
        // Validate coordinates are reasonable
        if (!validateAustralianCoordinates(coords)) {
          reject(new Error('Location appears to be outside Australia'))
          return
        }
        
        resolve(coords)
      },
      (error) => {
        let errorMessage = 'Unable to get your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please allow location access and try again.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
        }
        
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 300000, // 5 minutes
        ...options
      }
    )
  })
}