import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Meal } from '../../api/types';
import styles from './MealCard.module.css';
import { Heart, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../store/store';
import { toggleLike, removeMeal } from '../../store/slices/mealsSlice';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

interface MealCardProps {
  meal: Meal;
  isLiked: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ meal, isLiked }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/products/${meal.idMeal}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleLike(meal.idMeal));
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(removeMeal(meal.idMeal));
    setIsDeleteModalOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className={styles.card} onClick={handleCardClick}>
        <div className={styles.imageContainer}>
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className={styles.image}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-meal.jpg';
            }}
          />
        </div>
        <h3 className={styles.title}>{meal.strMeal}</h3>
        <p className={styles.category}>{meal.strCategory}</p>
        <div className={styles.actions}>
          <button
            className={styles.likeButton}
            onClick={handleLikeClick}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={isLiked ? styles.liked : ''}
              fill={isLiked ? 'currentColor' : 'none'}
            />
          </button>

          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            aria-label="Delete"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${meal.strMeal}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default MealCard;