import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Meal App</Link>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <Link to="/products" className={styles.navLink}>
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
        <span className={styles.apiText}>Public API is used</span>
        <div className={styles.apiStatus}></div>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search fruits..."
          className={styles.searchInput}
        />
      </div>
    </nav>
  );
};

export default Navbar;

