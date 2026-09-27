// Search.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import {useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X, Filter, ChevronDown } from "lucide-react";
import ProductCard from "../../components/ProductCard/ProductCard";
import useProducts from "../../hooks/useProducts";
import styles from "./Search.module.css";
import api from "../../api/axios";

const Search = () => {
  // const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isPopularProduct, setIsPopularProduct] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const {
    products,
    loading,
    error,
    pagination,
    searchProducts,
    getFilteredProducts,
    getAllProducts,
    reset,
  } = useProducts();

  const searchTimeout = useRef(null);
  // const isInitialMount = useRef(true);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          api.get("product/getCategories"),
          api.get("product/getBrands")
        ]);
        
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data);
        }
        if (brandsRes.data.success) {
          setBrands(brandsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchData();
  }, []);

  // Build filter object
  const buildFilters = useCallback(() => {
    const filters = {};

    if (selectedCategory) filters.category = selectedCategory;
    if (selectedBrand) filters.brand = selectedBrand;
    if (priceRange.min) filters.minPrice = parseFloat(priceRange.min);
    if (priceRange.max) filters.maxPrice = parseFloat(priceRange.max);
    if (sortBy) filters.sortBy = sortBy;
    if (inStockOnly) filters.inStock = true;
    if (isPopularProduct) filters.isPopular = true;
    if (isNewArrival) filters.isNewArrival = true;

    return filters;
  }, [
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    inStockOnly,
    isPopularProduct,
    isNewArrival,
  ]);

  // Perform search with filters
  const performSearch = useCallback(
    async (term, page = 1) => {
      const filters = buildFilters();
      const hasFilters = Object.keys(filters).length > 0;
      const hasSearchTerm = term && term.trim().length >= 2;

      if (hasSearchTerm && hasFilters) {
        // Search with filters
        await getFilteredProducts({ ...filters, search: term }, page, 20);
      } else if (hasSearchTerm) {
        // Simple search
        await searchProducts(term, page, 20);
      } else if (hasFilters) {
        // Only filters, no search term
        await getFilteredProducts(filters, page, 20);
      } else {
        // No filters, no search - show all
        await getAllProducts(page, 20);
      }

      // Update URL params
      const params = {};
      if (term?.trim()) params.q = term.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;
      if (sortBy) params.sort = sortBy;
      if (inStockOnly) params.inStock = "true";
      if (isPopularProduct) params.isPopular = "true";
      if (isNewArrival) params.isNewArrival = "true";

      setSearchParams(params, { replace: true });
    },
    [
      buildFilters,
      searchProducts,
      getFilteredProducts,
      getAllProducts,
      setSearchParams,
      selectedCategory,
      selectedBrand,
      priceRange,
      sortBy,
      inStockOnly,
      isPopularProduct,
      isNewArrival,
    ],
  );

  // Initialize from URL params
  useEffect(() => {
    console.log("Initializing search from URL params...");
    const query = searchParams.get("q") || "";
    const categoryParam = searchParams.get("category") || "";
    const brandParam = searchParams.get("brand") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const sortParam = searchParams.get("sort") || "";
    const inStock = searchParams.get("inStock") === "true";
    const isPopular = searchParams.get("isPopular") === "true";
    const isNew = searchParams.get("isNewArrival") === "true";

    console.log("Search term:", query);
    console.log("Category:", categoryParam);
    console.log("Brand:", brandParam);
    console.log("Min price:", minPrice);
    console.log("Max price:", maxPrice);
    console.log("Sort:", sortParam);
    console.log("In stock:", inStock);
    console.log("Is popular:", isPopular);
    console.log("Is new:", isNew);

    setSearchTerm(query);
    setSelectedCategory(categoryParam);
    setSelectedBrand(brandParam);
    setPriceRange({ min: minPrice, max: maxPrice });
    setSortBy(sortParam);
    setInStockOnly(inStock);
    setIsPopularProduct(isPopular);
    setIsNewArrival(isNew);

    // Only fetch on initial mount
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;
    //   const hasParams = query || categoryParam || brandParam || sortParam || 
    //                     inStock || isPopular || isNew || minPrice || maxPrice;
      
    //   if (hasParams) {
    //     performSearch(query, 1);
    //   } else {
    //     getAllProducts(1, 20);
    //   }
    // }
  }, []); // Empty dependency array - only run once

  // Debounced search
  useEffect(() => {
    // if (isInitialMount.current) return;

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchTerm.trim() && searchTerm.trim().length >= 2) {
      searchTimeout.current = setTimeout(() => {
        performSearch(searchTerm, 1);
      }, 500);
    } else if (searchTerm.trim() === "") {
      performSearch("", 1);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, performSearch]);

  // Handle filter changes with debounce
  const handleFilterChange = useCallback(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      performSearch(searchTerm, 1);
    }, 300);
  }, [performSearch, searchTerm]);

  const handleSearch = () => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    performSearch(searchTerm, 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange({ min: "", max: "" });
    setSortBy("");
    setInStockOnly(false);
    setIsPopularProduct(false);
    setIsNewArrival(false);
    setShowFilters(false);
    reset();
    getAllProducts(1, 20);
    setSearchParams({}, { replace: true });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      performSearch(searchTerm, newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedBrand) count++;
    if (priceRange.min || priceRange.max) count++;
    if (sortBy) count++;
    if (inStockOnly) count++;
    if (isPopularProduct) count++;
    if (isNewArrival) count++;
    return count;
  };

  const hasActiveFilters = getActiveFilterCount() > 0 || searchTerm.trim().length >= 2;

  // Sort options
  const sortOptions = [
    { value: "", label: "Sort By" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "discount", label: "Best Discount" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Rating: Highest First" },
  ];

  return (
    <div className={styles.searchPage}>
      <div className={styles.container}>
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <h1>Search Products</h1>

          <div className={styles.searchBox}>
            <SearchIcon size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={styles.clearBtn}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
            <button onClick={handleSearch} className={styles.searchBtn}>
              Search
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <div className={styles.resultsLeft}>
            <p className={styles.resultCount}>
              {loading ? "Searching..." : `${pagination.total} products found`}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          </div>

          <div className={styles.resultsRight}>
            {hasActiveFilters && (
              <button
                className={styles.clearFiltersBtn}
                onClick={clearAllFilters}
                aria-label="Clear all filters"
              >
                <X size={16} />
                Clear All
              </button>
            )}
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(true)}
              aria-label="Toggle filters"
            >
              <Filter size={20} />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className={styles.filterCount}>
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            <div className={styles.sortWrapper}>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  handleFilterChange();
                }}
                className={styles.sortSelect}
                aria-label="Sort products"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className={styles.sortIcon} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Sidebar */}
          <div
            className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ""}`}
          >
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarHeader}>
                <h2>Filters</h2>
                {isMobile && (
                  <button
                    className={styles.closeSidebar}
                    onClick={() => setShowFilters(false)}
                    aria-label="Close filters"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              <div className={styles.filtersContainer}>
                {/* Category */}
                <div className={styles.filterSection}>
                  <h3>Category</h3>
                  <div className={styles.filterOptions}>
                    <button
                      className={`${styles.filterOption} ${!selectedCategory ? styles.active : ""}`}
                      onClick={() => {
                        setSelectedCategory("");
                        handleFilterChange();
                      }}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className={`${styles.filterOption} ${selectedCategory === cat ? styles.active : ""}`}
                        onClick={() => {
                          setSelectedCategory(cat);
                          handleFilterChange();
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                {brands.length > 0 && (
                  <div className={styles.filterSection}>
                    <h3>Brand</h3>
                    <div className={styles.filterOptions}>
                      <button
                        className={`${styles.filterOption} ${!selectedBrand ? styles.active : ""}`}
                        onClick={() => {
                          setSelectedBrand("");
                          handleFilterChange();
                        }}
                      >
                        All Brands
                      </button>
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          className={`${styles.filterOption} ${selectedBrand === brand ? styles.active : ""}`}
                          onClick={() => {
                            setSelectedBrand(brand);
                            handleFilterChange();
                          }}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div className={styles.filterSection}>
                  <h3>Price Range</h3>
                  <div className={styles.priceRangeInputs}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, min: e.target.value });
                        handleFilterChange();
                      }}
                      min="0"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, max: e.target.value });
                        handleFilterChange();
                      }}
                      min="0"
                    />
                  </div>
                </div>

                {/* Product Flags */}
                <div className={styles.filterSection}>
                  <h3>Product Type</h3>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => {
                        setInStockOnly(e.target.checked);
                        handleFilterChange();
                      }}
                    />
                    In Stock Only
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isPopularProduct}
                      onChange={(e) => {
                        setIsPopularProduct(e.target.checked);
                        handleFilterChange();
                      }}
                    />
                    Popular Products
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => {
                        setIsNewArrival(e.target.checked);
                        handleFilterChange();
                      }}
                    />
                    New Arrivals
                  </label>
                </div>

                {/* Mobile Sort */}
                {isMobile && (
                  <div className={styles.filterSection}>
                    <h3>Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        handleFilterChange();
                      }}
                      className={styles.mobileSortSelect}
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={styles.sidebarActions}>
                  <button
                    className={styles.applyBtn}
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </button>
                  <button
                    className={styles.clearBtnSidebar}
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Overlay */}
          {isMobile && showFilters && (
            <div
              className={styles.sidebarOverlay}
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Products Grid */}
          <div className={styles.productsArea}>
            {error && (
              <div className={styles.errorMessage}>
                <span>⚠️ {error}</span>
                <button onClick={() => {}} aria-label="Close error">
                  ✕
                </button>
              </div>
            )}

            {loading && products.length === 0 ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <>
                <div className={styles.productsGrid}>
                  {products.length > 0 ? (                   
                    products.map((product) => (                       
                      <ProductCard
                        key={product._id || product.id}
                        product={product}
                      />                    
                    ))                   
                  ) : (
                    <div className={styles.noResults}>
                      <p>No products found</p>
                      <p className={styles.noResultsHint}>
                        Try adjusting your search terms or filters
                      </p>
                      <button
                        className={styles.browseBtn}
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.pageBtn}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || loading}
                      aria-label="Previous page"
                    >
                      ◀ Previous
                    </button>

                    <div className={styles.pageNumbers}>
                      {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                        let pageNum = i + 1;
                        if (pagination.page > 3) {
                          pageNum = pagination.page - 2 + i;
                        }
                        if (pageNum <= pagination.pages) {
                          return (
                            <button
                              key={pageNum}
                              className={`${styles.pageNum} ${pageNum === pagination.page ? styles.activePage : ""}`}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
                              aria-label={`Go to page ${pageNum}`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      className={styles.pageBtn}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages || loading}
                      aria-label="Next page"
                    >
                      Next ▶
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

