// services/productService.js

import api from "../api/axios";


// Product Service - All API calls
const productService = {
  // Get all products with pagination
  getAllProducts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/product?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/product/category/${encodeURIComponent(category)}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get new arrivals
  getNewArrivals: async (page = 1, limit = 10) => {
    try {
      // Using filter API with isNew flag
      const response = await api.get(`/product/filter/all`, {
        params: {          
          isNewArrival: true,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get popular products
  getPopularProducts: async (page = 1, limit = 10) => {
    try {
      // Using filter API with isPopular flag
      const response = await api.get(`/product/filter/all`, {
        params: {
          isPopular: true,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured products
  getFeaturedProducts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/product/filter/all`, {
        params: {
          isFeatured: true,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get filtered products
  getFilteredProducts: async (filters, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/product/filter/all`, {
        params: {
          ...filters,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search products
  searchProducts: async (query, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/product/search/query`, {
        params: {
          q: query,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get related products
  getRelatedProducts: async (id, limit = 4) => {
    try {
      const response = await api.get(`/product/related/${id}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const response = await api.post("/product", productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/product/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default productService;