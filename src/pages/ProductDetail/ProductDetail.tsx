import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { useGetFruitByIdQuery } from '../../api/fruitsApi';
import styles from './ProductDetail.module.css';
import {
  ArrowLeft
  ,
  Edit
} from 'lucide-react';
import { getFruitImage, defaultFruitImage } from '../../assets/images';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  const { data: apiFruit, isLoading } = useGetFruitByIdQuery(numericId, {
    skip: isNaN(numericId)
  });

  const userFruits = useAppSelector((state) => state.fruits.userFruits);
  const userFruit = userFruits.find((fruit) => fruit.id === numericId);

  const fruit = apiFruit || userFruit;

  if (isLoading) {
    return <div className={styles.loading}>Loading fruit details...</div>;
  }

  if (!fruit) {
    return (
      <div className={styles.notFound}>
        <h2>Fruit not found</h2>
        <Link to="/products" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to all fruits
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/products" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to all fruits
        </Link>

        {fruit.isUserCreated && (
          <Link to={`/edit-product/${fruit.id}`} className={styles.editLink}>
            <Edit size={16} /> Edit
          </Link>
        )}
      </div>

      <div className={styles.detailCard}>
        <div className={styles.imageContainer}>
          <img
            src={fruit.imageUrl || getFruitImage(fruit.name)}
            alt={fruit.name}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.src = defaultFruitImage;
            }}
          />
        </div>

        <div className={styles.details}>
          <h1 className={styles.name}>{fruit.name}</h1>
          <div className={styles.meta}>
            <span className={styles.family}>{fruit.family}</span>
            <span className={styles.genus}>{fruit.genus}</span>
            <span className={styles.order}>{fruit.order}</span>
          </div>

          <h3>Nutrition Information (per 100g)</h3>
          <div className={styles.nutritionGrid}>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Calories</span>
              <span className={styles.nutritionValue}>{fruit.nutritions.calories}</span>
            </div>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Carbohydrates</span>
              <span className={styles.nutritionValue}>{fruit.nutritions.carbohydrates}g</span>
            </div>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Protein</span>
              <span className={styles.nutritionValue}>{fruit.nutritions.protein}g</span>
            </div>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Fat</span>
              <span className={styles.nutritionValue}>{fruit.nutritions.fat}g</span>
            </div>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Sugar</span>
              <span className={styles.nutritionValue}>{fruit.nutritions.sugar}g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
