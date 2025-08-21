import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  useGetPopularMealsQuery,
  useGetCategoriesQuery,
} from "../../api/mealsApi";
import {
  setMeals,
  setFilter,
  setSearchQuery,
  setCategoryFilter,
  setAreaFilter,
  clearAllFilters,
} from "../../store/slices/mealsSlice";
import MealCard from "../../components/MealCard/MealCard";
import styles from "./Products.module.css";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import { Heart, Search, Filter, X } from "lucide-react";

const COUNTRIES = [
  "all",
  "American",
  "British",
  "Canadian",
  "Chinese",
  "Croatian",
  "Dutch",
  "Egyptian",
  "French",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Thai",
  "Tunisian",
  "Turkish",
  "Unknown",
  "Vietnamese",
];

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: apiMeals, isLoading, error } = useGetPopularMealsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const {
    meals,
    userMeals,
    likedMeals,
    filter,
    searchQuery,
    removedMeals,
    categoryFilter,
    areaFilter,
  } = useAppSelector((state) => state.meals);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    if (apiMeals) {
      dispatch(setMeals(apiMeals));
    }
  }, [apiMeals, dispatch]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", currentPage.toString());
    setSearchParams(newSearchParams);
  }, [currentPage, searchParams, setSearchParams]);

  const allCategories = React.useMemo(() => {
    const categorySet = new Set<string>();

    if (categories) {
      categories.forEach((cat) => categorySet.add(cat.strCategory));
    }

    [...meals, ...userMeals].forEach((meal) => {
      if (meal.strCategory) {
        categorySet.add(meal.strCategory);
      }
    });

    return ["all", ...Array.from(categorySet).sort()];
  }, [meals, userMeals, categories]);

  const allMeals = [...meals, ...userMeals];

  const filteredMeals = allMeals.filter((meal) => {
    const isRemoved = removedMeals.includes(meal.idMeal);
    const matchesFilter = filter === "all" || likedMeals.includes(meal.idMeal);
    const matchesCategory =
      categoryFilter === "all" || meal.strCategory === categoryFilter;
    const matchesArea = areaFilter === "all" || meal.strArea === areaFilter;
    const matchesSearch =
      searchQuery.length < 3 ||
      meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.strCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.strArea?.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      !isRemoved &&
      matchesFilter &&
      matchesSearch &&
      matchesCategory &&
      matchesArea
    );
  });

  const handleFilterChange = (newFilter: "all" | "liked") => {
    dispatch(setFilter(newFilter));
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setCategoryFilter(category));
    setCurrentPage(1);
  };

  const handleAreaChange = (area: string) => {
    dispatch(setAreaFilter(area));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearAllFilters());
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);

  const hasActiveFilters =
    categoryFilter !== "all" ||
    areaFilter !== "all" ||
    searchQuery.length >= 3 ||
    filter !== "all";

  if (isLoading) {
    return <div className={styles.loading}>Loading meals...</div>;
  }

  if (error) {
    console.error("Failed to load meals:", error);
    return (
      <div className={styles.error}>
        Failed to load meals. Please try again later.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search meals by name, category or cuisine..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.mainControls}>
          <div className={styles.filterButtons}>
            <button
              onClick={() => handleFilterChange("all")}
              className={filter === "all" ? styles.active : ""}
            >
              All Meals
            </button>
            <button
              onClick={() => handleFilterChange("liked")}
              className={filter === "liked" ? styles.active : ""}
            >
              <Heart size={16} /> Liked
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={styles.filterToggle}
          >
            <Filter size={16} /> Filters
          </button>

          <Link to="/create-product" className={styles.addButton}>
            Add New Meal
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={styles.filterSelect}
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="area-filter">Cuisine:</label>
            <select
              id="area-filter"
              value={areaFilter}
              onChange={(e) => handleAreaChange(e.target.value)}
              className={styles.filterSelect}
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className={styles.clearFilters}
            >
              <X size={14} /> Clear All
            </button>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          <span>Active filters: </span>
          {filter !== "all" && (
            <span className={styles.filterTag}>Liked only</span>
          )}
          {categoryFilter !== "all" && (
            <span className={styles.filterTag}>Category: {categoryFilter}</span>
          )}
          {areaFilter !== "all" && (
            <span className={styles.filterTag}>Cuisine: {areaFilter}</span>
          )}
          {searchQuery.length >= 3 && (
            <span className={styles.filterTag}>Search: "{searchQuery}"</span>
          )}
        </div>
      )}

      {currentMeals.length === 0 ? (
        <div className={styles.noResults}>
          No meals found.{" "}
          {hasActiveFilters
            ? "Try adjusting your filters or search term."
            : "Try adding some meals first."}
        </div>
      ) : (
        <>
          <div className={styles.mealsGrid}>
            {currentMeals.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={meal}
                isLiked={likedMeals.includes(meal.idMeal)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
