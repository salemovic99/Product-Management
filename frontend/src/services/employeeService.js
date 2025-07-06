export class employeeService{
  
    constructor(apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async getEmployees(skip = 0, limit = 5, filters={}) {
    try {
       const params = new URLSearchParams({
                        skip,
                        limit,                  
                        search: filters.search || ''
                      });
      const response = await fetch(`${this.apiBaseUrl}/employees/?${params.toString()}`);
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

  async getEmployeeById(id) {
    try {
      if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid employee ID');
    }
      const response = await fetch(`${this.apiBaseUrl}/employees/${id}`);
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

  async getAllEmployees() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/employees`);
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

  async getEmployeeCount(filters = {}) {
   try {
    const params = new URLSearchParams({
        search: filters.search || ''
      });
    const response = await fetch(`${this.apiBaseUrl}/employees/count?${params}`);

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

  async createEmployee(employeeData) {

    try {
        const response = await fetch(`${this.apiBaseUrl}/employees/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
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

  async updateEmployee(id, employeeData) {

    try {
      if (typeof id !== 'number' || id <= 0) {
          throw new Error('Invalid employee ID');
        }
        const response = await fetch(`${this.apiBaseUrl}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
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

  async deleteEmployee(id) {
    try {
      if (typeof id !== 'number' || id <= 0) {
          throw new Error('Invalid employee ID');
        }
        const response = await fetch(`${this.apiBaseUrl}/employees/${id}`, {
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

// Create a singleton instance
const employeesService = new employeeService();
export default employeesService;