import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useGetPopularMealsQuery } from "../../api/mealsApi";
import {
  setMeals,
  setFilter,
  setSearchQuery,
} from "../../store/slices/mealsSlice";
import MealCard from "../../components/MealCard/MealCard";
import styles from "./Products.module.css";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import { Heart, Search } from "lucide-react";

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: apiMeals, isLoading, error } = useGetPopularMealsQuery();
  const { meals, userMeals, likedMeals, filter, searchQuery, removedMeals } =
    useAppSelector((state) => state.meals);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (apiMeals) {
      dispatch(setMeals(apiMeals));
    }
  }, [apiMeals, dispatch]);

  const allMeals = [...meals, ...userMeals];

  const filteredMeals = allMeals.filter((meal) => {
    const isRemoved = removedMeals.includes(meal.idMeal);
    const matchesFilter = filter === "all" || likedMeals.includes(meal.idMeal);

    const matchesSearch =
      searchQuery.length < 3 ||
      meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.strCategory.toLowerCase().includes(searchQuery.toLowerCase());

    return !isRemoved && matchesFilter && matchesSearch;
  });

  const handleFilterChange = (newFilter: "all" | "liked") => {
    dispatch(setFilter(newFilter));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
    setCurrentPage(1);
  };

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
            placeholder="Search meals..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

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

        <Link to="/create-product" className={styles.addButton}>
          Add New Meal
        </Link>
      </div>

      {currentMeals.length === 0 ? (
        <div className={styles.noResults}>
          No meals found.{" "}
          {filter === "liked"
            ? "Try liking some meals first."
            : searchQuery.length < 3
            ? "Enter at least 3 characters to search."
            : "Try a different search."}
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
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
