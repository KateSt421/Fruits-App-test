import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setFilter } from "../../store/slices/mealsSlice";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.meals.filter);

  const handleAllMealsClick = () => {
    if (filter === "liked") {
      dispatch(setFilter("all"));
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Meals App</Link>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <Link
            to="/products"
            className={styles.navLink}
            onClick={handleAllMealsClick}
          >
            All Meals
          </Link>
        </li>
        <li>
          <Link to="/create-product" className={styles.navLink}>
            Add New Meal
          </Link>
        </li>
      </ul>

      <div className={styles.apiIndicator}>
        <a
          href="https://www.themealdb.com/api.php"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.apiLink}
        >
          <span className={styles.apiText}>Public API is used</span>
          <div className={styles.apiStatus}></div>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
