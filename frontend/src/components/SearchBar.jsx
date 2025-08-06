import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiX } from "react-icons/fi";
import { searchProducts, clearSearchResults, selectSearchResults, selectSearchLoading } from "../slices/productsSlice";
import styles from "../styles/SearchBar.module.css";

const SearchBar = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    
    const searchResults = useSelector(selectSearchResults);
    const searchLoading = useSelector(selectSearchLoading);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async (query) => {
        if (query.trim().length > 0) {
            await dispatch(searchProducts({ searchQuery: query.trim() }));
            setShowResults(true);
        } else {
            dispatch(clearSearchResults());
            setShowResults(false);
        }
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        // Debounce search
        const timeoutId = setTimeout(() => {
            handleSearch(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowResults(false);
            onClose();
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        setShowResults(false);
        onClose();
        setSearchQuery("");
        dispatch(clearSearchResults());
    };

    const handleViewAllResults = () => {
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowResults(false);
            onClose();
        }
    };

    const handleClose = () => {
        setSearchQuery("");
        setShowResults(false);
        dispatch(clearSearchResults());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.searchOverlay}>
            <div className={styles.searchContainer} ref={searchRef}>
                <div className={styles.searchHeader}>
                    <h3>Search Products</h3>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <FiX />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.searchForm}>
                    <div className={styles.searchInputContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for furniture, categories..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className={styles.clearBtn}
                                onClick={() => {
                                    setSearchQuery("");
                                    dispatch(clearSearchResults());
                                    setShowResults(false);
                                }}
                            >
                                <FiX />
                            </button>
                        )}
                    </div>
                </form>

                {showResults && (
                    <div className={styles.searchResults}>
                        {searchLoading ? (
                            <div className={styles.loading}>
                                <p>Searching...</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <>
                                <div className={styles.resultsHeader}>
                                    <span>{searchResults.length} results found</span>
                                    <button 
                                        className={styles.viewAllBtn}
                                        onClick={handleViewAllResults}
                                    >
                                        View All Results
                                    </button>
                                </div>
                                <div className={styles.resultsList}>
                                    {searchResults.slice(0, 6).map((product) => (
                                        <div
                                            key={product._id}
                                            className={styles.resultItem}
                                            onClick={() => handleProductClick(product._id)}
                                        >
                                            <img
                                                src={product.images?.[0] || '/placeholder.jpg'}
                                                alt={product.name}
                                                className={styles.resultImage}
                                            />
                                            <div className={styles.resultInfo}>
                                                <h4>{product.name}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {searchResults.length > 6 && (
                                    <div className={styles.moreResults}>
                                        <button 
                                            className={styles.viewAllBtn}
                                            onClick={handleViewAllResults}
                                        >
                                            View {searchResults.length - 6} more results
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : searchQuery.trim() ? (
                            <div className={styles.noResults}>
                                <p>No products found for "{searchQuery}"</p>
                                <p>Try different keywords or browse our categories</p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;