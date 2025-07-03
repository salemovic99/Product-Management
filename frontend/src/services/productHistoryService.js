class ProductHistoryService{
    constructor(apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000') {
    this.apiBaseUrl = apiBaseUrl;
  }

   async getProductHistory(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/products/${id}/history`);
      
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

const productHistoryService = new ProductHistoryService();
export default productHistoryService;