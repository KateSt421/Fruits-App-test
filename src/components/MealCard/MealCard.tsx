import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, Edit } from "lucide-react";
import { useAppDispatch } from "../../store/store";
import { toggleLike, removeMeal } from "../../store/slices/mealsSlice";
import type { Meal } from "../../api/types";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import styles from "./MealCard.module.css";

interface MealCardProps {
  meal: Meal;
  isLiked: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ meal, isLiked }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCardClick = useCallback(() => {
    navigate(`/products/${meal.idMeal}`);
  }, [navigate, meal.idMeal]);

  const handleLikeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(toggleLike(meal.idMeal));
    },
    [dispatch, meal.idMeal]
  );

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/edit-product/${meal.idMeal}`);
    },
    [navigate, meal.idMeal]
  );

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    dispatch(removeMeal(meal.idMeal));
    setIsDeleteModalOpen(false);
  }, [dispatch, meal.idMeal]);

  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = "/default-meal.jpg";
    },
    []
  );

  return (
    <>
      <article className={styles.card} onClick={handleCardClick}>
        <div className={styles.imageContainer}>
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className={styles.image}
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        <div className={styles.content}>
          <h3 className={styles.title} title={meal.strMeal}>
            {meal.strMeal}
          </h3>
          <p className={styles.category}>{meal.strCategory}</p>

          <div className={styles.actions}>
            <button
              className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
              onClick={handleLikeClick}
              aria-label={
                isLiked ? "Remove from favorites" : "Add to favorites"
              }
              title={isLiked ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart fill={isLiked ? "currentColor" : "none"} size={18} />
            </button>

            <div className={styles.actionButtons}>
              {/* Кнопка редактирования показывается для ВСЕХ блюд */}
              <button
                className={styles.editButton}
                onClick={handleEditClick}
                aria-label="Edit meal"
                title="Edit meal"
              >
                <Edit size={16} />
              </button>

              <button
                className={styles.deleteButton}
                onClick={handleDeleteClick}
                aria-label="Delete meal"
                title="Delete meal"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </article>

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

export default React.memo(MealCard);
