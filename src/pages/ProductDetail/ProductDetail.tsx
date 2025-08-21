import React from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { useGetMealByIdQuery } from "../../api/mealsApi";
import styles from "./ProductDetail.module.css";
import { ArrowLeft, Edit } from "lucide-react";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const { data: apiMeal, isLoading } = useGetMealByIdQuery(id || "", {
    skip: !id,
  });

  const userMeals = useAppSelector((state) => state.meals.userMeals);
  const editedMeals = useAppSelector((state) => state.meals.editedMeals);
  const meals = useAppSelector((state) => state.meals.meals);

  const editedMeal = editedMeals.find((meal) => meal.idMeal === id);
  const userMeal = userMeals.find((meal) => meal.idMeal === id);
  const storedMeal = meals.find((meal) => meal.idMeal === id);

  const meal = editedMeal || userMeal || storedMeal || apiMeal;

  if (isLoading) {
    return <div className={styles.loading}>Loading meal details...</div>;
  }

  if (!meal) {
    return (
      <div className={styles.notFound}>
        <h2>Meal not found</h2>
        <Link to={`/products?page=${page}`} className={styles.backLink}>
          <ArrowLeft size={16} /> Back to all meals
        </Link>
      </div>
    );
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof typeof meal];
    const measure = meal[`strMeasure${i}` as keyof typeof meal];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure: measure || "" });
    }
  }

  const instructions = meal.strInstructions
    ? meal.strInstructions.split("\n")
    : ["No instructions available"];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/products?page=${page}`} className={styles.backLink}>
          <ArrowLeft size={16} /> Back to all meals
        </Link>

        <Link
          to={`/edit-product/${meal.idMeal}?page=${page}`}
          className={styles.editLink}
        >
          <Edit size={16} /> Edit
        </Link>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.leftColumn}>
          <div className={styles.imageContainer}>
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className={styles.image}
              onError={(e) => {
                e.currentTarget.src = "/default-meal.jpg";
              }}
            />
          </div>

          {ingredients.length > 0 && (
            <div className={styles.ingredientsSection}>
              <h3>Ingredients</h3>
              <ul className={styles.ingredientsList}>
                {ingredients.map((item, index) => (
                  <li key={index} className={styles.ingredientItem}>
                    <span className={styles.ingredientName}>
                      {item.ingredient}
                    </span>
                    <span className={styles.ingredientMeasure}>
                      {item.measure}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.rightColumn}>
          <div>
            <h1 className={styles.name}>{meal.strMeal}</h1>
            <div className={styles.meta}>
              <span className={styles.category}>{meal.strCategory}</span>
              <span className={styles.area}>{meal.strArea}</span>
              {meal.strTags && (
                <span className={styles.tags}>{meal.strTags}</span>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Instructions</h3>
            <div className={styles.instructions}>
              <div className={styles.instructionsContent}>
                {instructions.map(
                  (paragraph, i) =>
                    paragraph.trim() && <p key={i}>{paragraph}</p>
                )}
              </div>
            </div>
          </div>

          {meal.strYoutube && (
            <div className={styles.section}>
              <h3>Video Recipe</h3>
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.youtubeLink}
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
