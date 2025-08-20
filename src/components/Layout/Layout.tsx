import React, { type ReactNode } from "react";
import Navbar from "../Navbar/Navbar";
import { Github } from "lucide-react";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Meals App</span>
          <span className={styles.dot}>&bull;</span>
          <span>Developed by Katsiaryna Stankevich</span>
          <span className={styles.dot}>&bull;</span>
          <a
            href="https://github.com/KateSt421"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <Github size={20} />
          </a>
          <span className={styles.dot}>&bull;</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
