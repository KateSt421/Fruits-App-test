import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">Fruits App</Link>
        </div>

        <nav className={styles.nav}>
          <Link to="/products" className={styles.navLink}>
            All Fruits
          </Link>
          <Link to="/create-product" className={styles.navLink}>
            Add New Fruit
          </Link>
        </nav>

        <div className={styles.apiIndicator}>
          <span className={styles.apiText}>Public API is used</span>
          <div className={styles.apiStatus}></div>
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <p>Fruits App &bull; Developed by Katsiaryna Stankevich &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;
