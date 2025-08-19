import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import MealForm from "../../components/MealForm/MealForm";
import styles from "./EditProduct.module.css";
import { ArrowLeft } from "lucide-react";

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const userMeals = useAppSelector((state) => state.meals.userMeals);
  const meals = useAppSelector((state) => state.meals.meals);
  const editedMeals = useAppSelector((state) => state.meals.editedMeals);

  const mealToEdit =
    userMeals.find((meal) => meal.idMeal === id) ||
    editedMeals.find((meal) => meal.idMeal === id) ||
    meals.find((meal) => meal.idMeal === id);

  const handleSuccess = () => {
    navigate(`/products/${id}`);
  };

  if (!mealToEdit) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            onClick={() => navigate("/products")}
            className={styles.backButton}
          >
            <ArrowLeft size={18} /> Back to all meals
          </button>
          <h1>Meal not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate(`/products/${id}`)}
          className={styles.backButton}
        >
          <ArrowLeft size={18} /> Back to meal details
        </button>
        <h1 className={styles.title}>Edit {mealToEdit.strMeal}</h1>
      </div>

      <div className={styles.formContainer}>
        <MealForm initialData={mealToEdit} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default EditProductPage;
