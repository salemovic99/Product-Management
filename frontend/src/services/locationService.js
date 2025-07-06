export class LocationService {
  constructor(apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async getLocations(skip = 0, limit = 5, filters={}) {
    try {
      const params = new URLSearchParams({
                        skip,
                        limit,                  
                        search: filters.search || ''
                      });
        const response = await fetch(`${this.apiBaseUrl}/locations/?${params.toString()}`);
        const responseBody = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            responseBody?.detail ||
            responseBody?.message ||
            `Server returned ${response.status}`;
          throw new Error(errorMessage);
        }

        return responseBody;
    } catch (error) {
        throw new Error(
      error.message || 'Unable to connect to the server. Please try again later.'
    )
    }
  }

  async getAllLocations() {
    try {
        const response = await fetch(`${this.apiBaseUrl}/locations`);
      
        const responseBody = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            responseBody?.detail ||
            responseBody?.message ||
            `Server returned ${response.status}`;
          throw new Error(errorMessage);
        }

        return responseBody;

    } catch (error) {
         throw new Error(
      error.message || 'Unable to connect to the server. Please try again later.'
    )
    }
  }

  async getLocationById(id) {
    try {
        const response = await fetch(`${this.apiBaseUrl}/locations/${id}`);
        const responseBody = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            responseBody?.detail ||
            responseBody?.message ||
            `Server returned ${response.status}`;
          throw new Error(errorMessage);
        }

        return responseBody;
    } catch (error) {
         throw new Error(
      error.message || 'Unable to connect to the server. Please try again later.'
    )
    }
  }

  async getLocationCount(filters = {}) {
    try {
        const params = new URLSearchParams({
        search: filters.search || ''
      });
        const response = await fetch(`${this.apiBaseUrl}/locations/count?${params}`);
        const responseBody = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            responseBody?.detail ||
            responseBody?.message ||
            `Server returned ${response.status}`;
          throw new Error(errorMessage);
        }

        return responseBody.count;

    } catch (error) {
        throw new Error(
      error.message || 'Unable to connect to the server. Please try again later.'
    )
    }
  }

  async createLocation(locationData) {

   try {
        const response = await fetch(`${this.apiBaseUrl}/locations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
        });
        
        const responseBody = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            responseBody?.detail ||
            responseBody?.message ||
            `Server returned ${response.status}`;
          throw new Error(errorMessage);
        }

        return responseBody;

   } catch (error) {
    throw new Error(
      error.message || 'Unable to connect to the server. Please try again later.'
    )
   }
  }

  async updateLocation(id, locationData) {

    try {
        const response = await fetch(`${this.apiBaseUrl}/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
        });
        
        const responseBody = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            responseBody?.detail ||
            responseBody?.message ||
            `Server returned ${response.status}`;
          throw new Error(errorMessage);
        }

        return responseBody;
    } catch (error) {
        throw new Error(
      error.message || 'Unable to connect to the server. Please try again later.'
    )
    }
  }

  async deleteLocation(id) {

    try {
        const response = await fetch(`${this.apiBaseUrl}/locations/${id}`, {
        method: 'DELETE',
        });
        
        const responseBody = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            responseBody?.detail ||
            responseBody?.message ||
            `Server returned ${response.status}`;
          throw new Error(errorMessage);
        }

        return responseBody;
        
    } catch (error) {
        throw new Error(
      error.message || 'Unable to connect to the server. Please try again later.'
    )
    }
  }
}

const locationsService = new LocationService();
export default locationsService;