// services/positionsService.js
class PositionsService {
  constructor(apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000') {
    this.API_BASE_URL = apiBaseUrl;
  }

  async fetchPositions(page = 1, pageSize = 5) {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/positions/?skip=${(page - 1) * pageSize}&limit=${pageSize}`
      );
      
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
  
  async fetchAllPositions() {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/positions`
      );
      
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

  async getPositionsCount() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/positions/count`);
      
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

  async createPosition(positionData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/positions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(positionData),
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

  async updatePosition(id, positionData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/positions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(positionData),
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

  async deletePosition(id) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/positions/${id}`, {
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

const positionsService = new PositionsService();
export default positionsService;