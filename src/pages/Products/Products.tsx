import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useGetAllFruitsQuery } from '../../api/fruitsApi';
import { setFruits, setFilter, setSearchQuery } from '../../store/slices/fruitsSlice';
import FruitCard from '../../components/FruitCard/FruitCard';
import styles from './Products.module.css';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import { Heart, Search } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: apiFruits, isLoading } = useGetAllFruitsQuery();
  const { fruits, userFruits, likedFruits, filter, searchQuery } = useAppSelector((state) => state.fruits);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (apiFruits) {
      dispatch(setFruits(apiFruits));
    }
  }, [apiFruits, dispatch]);

  const allFruits = [...fruits, ...userFruits];
  const filteredFruits = allFruits.filter(fruit => {
    const matchesFilter = filter === 'all' || likedFruits.includes(fruit.id as number);
    const matchesSearch = fruit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fruit.family.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFilterChange = (newFilter: 'all' | 'liked') => {
    dispatch(setFilter(newFilter));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFruits = filteredFruits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFruits.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
    setCurrentPage(1);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading fruits...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search fruits..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterButtons}>
          <button
            onClick={() => handleFilterChange('all')}
            className={filter === 'all' ? styles.active : ''}
          >
            All Fruits
          </button>
          <button
            onClick={() => handleFilterChange('liked')}
            className={filter === 'liked' ? styles.active : ''}
          >
            <Heart size={16} /> Liked
          </button>
        </div>

        <Link to="/create-product" className={styles.addButton}>
          Add New Fruit
        </Link>
      </div>

      {currentFruits.length === 0 ? (
        <div className={styles.noResults}>
          No fruits found. {filter === 'liked' ? 'Try liking some fruits first.' : 'Try a different search.'}
        </div>
      ) : (
        <>
          <div className={styles.fruitsGrid}>
            {currentFruits.map((fruit) => (
              <FruitCard
                key={fruit.id}
                fruit={fruit}
                isLiked={likedFruits.includes(fruit.id as number)}
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

