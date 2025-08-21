import React from "react";
import { Link } from "react-router-dom";
import { Home, ChefHat } from "lucide-react";
import styles from "./NotFound.module.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <ChefHat size={64} className={styles.icon} />
        </div>

        <h1 className={styles.title}>Food not found</h1>

        <p className={styles.message}>
          Oops! The meal you're looking for doesn't exist or has been removed.
        </p>

        <Link to="/" className={styles.homeButton}>
          <Home size={20} />
          Back to home page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
