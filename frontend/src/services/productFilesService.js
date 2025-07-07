export class productFilesService{
    constructor(apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async getProducts(skip = 0, limit = 5, filters={}) {
    try {
      const params = new URLSearchParams({
                        skip,
                        limit,
                        status: filters.status || 'all',
                        location: filters.location || 'all',
                        search: filters.search || ''
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

  

  async getProductFilesById(id) {
    try {

      if (typeof id !== 'number' || id <= 0) {
          throw new Error('Invalid product ID');
        }

      const response = await fetch(`${this.apiBaseUrl}/products/${id}/files`);
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

  async uploadProductFiles(productId,files) {
    
    try {
        if(!files) return;

       const response = await fetch(`http://localhost:8000/products/${productId}/upload`, {
            method: "POST",
            body: files,
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

const productsFilesService = new productFilesService();
export default productsFilesService;