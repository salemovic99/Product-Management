export class productService{
    constructor(apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async getProducts(skip = 0, limit = 5, filters={}) {
    try {
      const params = new URLSearchParams({
                        skip,
                        limit,
                        status: filters.status || 'all',
                        location: filters.location || 'all'
                      });

      const response = await fetch(`${this.apiBaseUrl}/products/?${params.toString()}`);
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

  async getAllProducts() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/products`);
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

  async getProductById(id) {
    try {

      if (typeof id !== 'number' || id <= 0) {
          throw new Error('Invalid product ID');
        }

      const response = await fetch(`${this.apiBaseUrl}/products/${id}`);
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

  async getProductsCount(filters = {}) {
   try {

    const params = new URLSearchParams({
      status: filters.status || 'all',
      location: filters.location || 'all'
    });
    
      const response = await fetch(`${this.apiBaseUrl}/products/count?${params}`);

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

  async createProduct(productData) {
    
    try {
        if(!productData) return;

        const response = await fetch(`${this.apiBaseUrl}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
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

  async updateProduct(id, productData) {
    try {
        if (typeof id !== 'number' || id <= 0) {
          throw new Error('Invalid product ID');
        }

        const response = await fetch(`${this.apiBaseUrl}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
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

  async deleteProduct(id) {
    try {
        if (typeof id !== 'number' || id <= 0) {
          throw new Error('Invalid product ID');
        }

        const response = await fetch(`${this.apiBaseUrl}/products/${id}`, {
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

const productsService = new productService();
export default productsService;