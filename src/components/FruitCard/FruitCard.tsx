import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { FruitType } from '../../api/types';
import styles from './FruitCard.module.css';
import { Heart, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../store/store';
import { toggleLike, removeFruit } from '../../store/slices/fruitsSlice';
import { getFruitImage, defaultFruitImage } from '../../assets/images';

interface FruitCardProps {
  fruit: FruitType;
  isLiked: boolean;
}

const FruitCard: React.FC<FruitCardProps> = ({ fruit, isLiked }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.action-button')) {
      navigate(`/products/${fruit.id}`);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleLike(fruit.id as number));
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFruit(fruit.id as number));
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img
          src={fruit.imageUrl || getFruitImage(fruit.name)}
          alt={fruit.name}
          className={styles.image}
          onError={(e) => {
            e.currentTarget.src = defaultFruitImage;
          }}
          loading="lazy"
        />
      </div>
      <h3 className={styles.title}>{fruit.name}</h3>
      <p className={styles.family}>{fruit.family}</p>
      <div className={styles.actions}>
        <button
          className={`${styles.likeButton} action-button`}
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart
            className={isLiked ? styles.liked : ''}
            fill={isLiked ? 'currentColor' : 'none'}
          />
        </button>
        <button
          className={`${styles.deleteButton} action-button`}
          onClick={handleDeleteClick}
          aria-label="Delete"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default FruitCard;
