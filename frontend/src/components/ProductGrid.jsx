import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/ProductGrid.module.css";
import Product1 from "../assets/Product1.png";
import ProductCard from "./ProductCard";
import { 
    fetchProducts, 
    searchProducts, 
    selectProductsByCategory, 
    selectSearchResults, 
    selectProductsLoading, 
    selectSearchLoading, 
    selectProductsError, 
    selectSearchError 
} from "../slices/productsSlice";

const ProductGrid = ({ category, searchQuery, showAll = false, excludeProductId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = showAll ? 16 : 8;
    
    // Use search results if search query exists, otherwise use category products
    const cacheKey = category || 'all';
    const categoryProducts = useSelector(state => selectProductsByCategory(state, cacheKey));
    const searchResults = useSelector(selectSearchResults);
    const rawProducts = searchQuery ? searchResults : categoryProducts;
    
    const categoryLoading = useSelector(selectProductsLoading);
    const searchLoading = useSelector(selectSearchLoading);
    const loading = searchQuery ? searchLoading : categoryLoading;
    
    const categoryError = useSelector(selectProductsError);
    const searchError = useSelector(selectSearchError);
    const error = searchQuery ? searchError : categoryError;
    
    // Transform the data to match the expected format and exclude current product if specified
    const products = rawProducts
        .filter(product => excludeProductId ? product._id !== excludeProductId : true)
        .map(product => ({
            _id: product._id,
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price.toLocaleString(),
            img: product.images && product.images.length > 0 ? product.images[0] : Product1,
            discount: product.discount,
            tag: product.tag
        }));

    useEffect(() => {
        if (searchQuery) {
            // Search products - no caching for search results
            dispatch(searchProducts({ searchQuery, category }));
        } else {
            // Fetch products - the Redux slice will handle caching automatically
            dispatch(fetchProducts({ category }));
        }
        setCurrentPage(1); // Reset to first page when category or search changes
    }, [category, searchQuery, dispatch]);

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    // Calculate pagination
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = showAll ? products.slice(startIndex, endIndex) : products.slice(0, 8);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        if (!showAll || totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 7; // Show max 7 page numbers
        
        // Always show first page
        pages.push(
            <button
                key={1}
                className={`${styles.pageBtn} ${currentPage === 1 ? styles.activePage : ''}`}
                onClick={() => handlePageChange(1)}
            >
                1
            </button>
        );

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 2; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        className={`${styles.pageBtn} ${currentPage === i ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Show ellipsis logic for many pages
            let startPage, endPage;
            
            if (currentPage <= 4) {
                // Near the beginning
                startPage = 2;
                endPage = 5;
            } else if (currentPage >= totalPages - 3) {
                // Near the end
                startPage = totalPages - 4;
                endPage = totalPages - 1;
            } else {
                // In the middle
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }

            // Add left ellipsis if needed
            if (startPage > 2) {
                pages.push(
                    <span key="ellipsis-left" className={styles.ellipsis}>
                        ...
                    </span>
                );
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <button
                        key={i}
                        className={`${styles.pageBtn} ${currentPage === i ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                );
            }

            // Add right ellipsis if needed
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="ellipsis-right" className={styles.ellipsis}>
                        ...
                    </span>
                );
            }

            // Always show last page (if not already shown)
            if (totalPages > 1) {
                pages.push(
                    <button
                        key={totalPages}
                        className={`${styles.pageBtn} ${currentPage === totalPages ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                );
            }
        }

        return (
            <div className={styles.pagination}>
                <button
                    className={styles.pageBtn}
                    onClick={() => {
                        if (currentPage > 1) {
                            handlePageChange(currentPage - 1);
                        }
                    }}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {pages}
                <button
                    className={styles.pageBtn}
                    onClick={() => {
                        if (currentPage < totalPages) {
                            handlePageChange(currentPage + 1);
                        }
                    }}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h3>
                        {searchQuery 
                            ? `No products found for "${searchQuery}"` 
                            : `No products found${category ? ` in ${category} category` : ''}`
                        }
                    </h3>
                    <p>
                        {searchQuery 
                            ? 'Try different keywords or browse our categories.' 
                            : 'Try browsing other categories or check back later.'
                        }
                    </p>
                </div>
            ) : (
                <>
                    <div className={`${styles.grid} ${styles.mobileHidden}`}>
                        {currentProducts.map((product) => (
                            <div key={product.id} onClick={() => handleProductClick(product.id)} style={{ cursor: "pointer" }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                    {!showAll && <button className={styles.cartBtn} onClick={() => navigate(category ? `/shop?category=${encodeURIComponent(category)}` : '/shop')}>Show More</button>}
                    {renderPagination()}
                </>
            )}
        </div>
    );
};

export default ProductGrid;
