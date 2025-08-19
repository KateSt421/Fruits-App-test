// components/IngredientForm/IngredientForm.tsx
import React from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import styles from "./IngredientForm.module.css";

interface Ingredient {
  name: string;
  measure: string;
}

interface IngredientError {
  name?: FieldError;
  measure?: FieldError;
}

type IngredientErrors =
  | Merge<
      FieldError,
      (
        | Merge<FieldError, FieldErrorsImpl<{ name: string; measure: string }>>
        | undefined
      )[]
    >
  | undefined;

interface IngredientFormProps {
  ingredients: Ingredient[];
  errors?: IngredientErrors;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void;
  onIngredientChange: (
    index: number,
    field: "name" | "measure",
    value: string
  ) => void;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({
  ingredients,
  errors,
  onAddIngredient,
  onRemoveIngredient,
  onIngredientChange,
}) => {
  // Вспомогательные функции для работы с ошибками
  const getIngredientError = (index: number): IngredientError | undefined => {
    if (errors && Array.isArray(errors)) {
      return errors[index] as IngredientError | undefined;
    }
    return undefined;
  };

  const getRootError = (): string | undefined => {
    if (errors && !Array.isArray(errors) && errors.message) {
      return errors.message;
    }
    return undefined;
  };

  const isArrayError = (): boolean => {
    return errors !== undefined && Array.isArray(errors);
  };

  return (
    <div className={styles.ingredientsSection}>
      <h3>Ingredients*</h3>
      {ingredients.map((ingredient, index) => {
        const ingredientError = isArrayError()
          ? getIngredientError(index)
          : undefined;

        return (
          <div key={index} className={styles.ingredientRow}>
            <div className={styles.ingredientInput}>
              <input
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) =>
                  onIngredientChange(index, "name", e.target.value)
                }
                className={ingredientError?.name ? styles.error : ""}
              />
              {ingredientError?.name && (
                <span className={styles.errorMessage}>
                  {ingredientError.name.message}
                </span>
              )}
            </div>
            <div className={styles.measureInput}>
              <input
                placeholder="Measure"
                value={ingredient.measure}
                onChange={(e) =>
                  onIngredientChange(index, "measure", e.target.value)
                }
                className={ingredientError?.measure ? styles.error : ""}
              />
              {ingredientError?.measure && (
                <span className={styles.errorMessage}>
                  {ingredientError.measure.message}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemoveIngredient(index)}
              className={styles.removeIngredient}
              disabled={ingredients.length <= 1}
            >
              ×
            </button>
          </div>
        );
      })}
      {getRootError() && (
        <span className={styles.errorMessage}>{getRootError()}</span>
      )}
      <button
        type="button"
        onClick={onAddIngredient}
        className={styles.addIngredient}
      >
        + Add Ingredient
      </button>
    </div>
  );
};
