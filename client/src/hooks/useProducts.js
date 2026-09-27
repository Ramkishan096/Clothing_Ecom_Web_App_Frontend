// hooks/useProducts.js
import { useState,  useCallback } from 'react';
import productService from '../services/productService';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasMore: false
  });

  // Get all products
  const getAllProducts = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getAllProducts(page, limit);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
        return response.data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get product by ID
  const getProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProductById(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get product by slug
  const getProductBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      // First get all products and find by slug
      const response = await productService.getAllProducts(1, 100);
      if (response.success) {
        const product = response.data.find(p => p.slug === slug);
        if (product) {
          // Fetch full product details
          const fullProduct = await productService.getProductById(product._id);
          return fullProduct.data;
        }
        setError('Product not found');
        return null;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get products by category
  const getProductsByCategory = useCallback(async (category, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProductsByCategory(category, page, limit);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
        return response.data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products by category');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get new arrivals
  const getNewArrivals = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getNewArrivals(page, limit);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
        return response.data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch new arrivals');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get popular products
  const getPopularProducts = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getPopularProducts(page, limit);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
        return response.data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch popular products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get featured products
  const getFeaturedProducts = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getFeaturedProducts(page, limit);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
        return response.data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch featured products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (query, page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.searchProducts(query, page, limit);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
        return response.data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || 'Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get filtered products
  const getFilteredProducts = useCallback(async (filters, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getFilteredProducts(filters, page, limit);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
        return response.data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to apply filters');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get related products
  const getRelatedProducts = useCallback(async (id, limit = 4) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getRelatedProducts(id, limit);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch related products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create product
  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.createProduct(productData);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.updateProduct(id, productData);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to update product');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setProducts([]);
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
      hasMore: false
    });
    setError(null);
    setLoading(false);
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    getAllProducts,
    getProductsByCategory,
    getNewArrivals,
    getPopularProducts,
    getFeaturedProducts,
    getProductById,
    getProductBySlug,
    searchProducts,
    getFilteredProducts,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    reset
  };
};

export default useProducts;