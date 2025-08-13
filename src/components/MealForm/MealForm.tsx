import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Meal } from '../../api/types';
import styles from './MealForm.module.css';
import { useAppDispatch } from '../../store/store';
import { addUserMeal, updateUserMeal } from '../../store/slices/mealsSlice';
import { ArrowLeft } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const mealSchema = z.object({
  strMeal: z.string().min(2, 'Name must be at least 2 characters'),
  strCategory: z.string().min(2, 'Category must be at least 2 characters'),
  strArea: z.string().min(2, 'Cuisine must be at least 2 characters'),
  strInstructions: z.string().min(10, 'Instructions must be at least 10 characters'),
  strTags: z.string().optional(),
  strYoutube: z.string().url('Invalid YouTube URL').optional().or(z.literal('')),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, 'Ingredient name required'),
      measure: z.string().min(1, 'Measure required'),
    })
  ).min(1, 'At least one ingredient required'),
  image: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, {
      message: 'Max image size is 5MB'
    })
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      'Only .jpg, .png and .webp formats are supported'
    ),
});

type MealFormValues = z.infer<typeof mealSchema>;

interface MealFormProps {
  initialData?: Meal;
  onSuccess?: () => void;
}

const MealForm: React.FC<MealFormProps> = ({ initialData, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.strMealThumb || null
  );
  const [ingredients, setIngredients] = useState(
    initialData ? extractIngredients(initialData) : [{ name: '', measure: '' }]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: initialData
      ? {
        strMeal: initialData.strMeal,
        strCategory: initialData.strCategory,
        strArea: initialData.strArea,
        strInstructions: initialData.strInstructions,
        strTags: initialData.strTags || '',
        strYoutube: initialData.strYoutube || '',
        ingredients: extractIngredients(initialData),
      }
      : undefined,
  });

  function extractIngredients(meal: Meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof Meal];
      const measure = meal[`strMeasure${i}` as keyof Meal];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient,
          measure: measure || '',
        });
      }
    }
    return ingredients.length > 0 ? ingredients : [{ name: '', measure: '' }];
  }

  const imageFile = watch('image');

  React.useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('image', e.target.files);
    } else {
      setValue('image', undefined);
    }
  };

  const handleIngredientChange = (index: number, field: 'name' | 'measure', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
    setValue('ingredients', newIngredients);
  };

  const addIngredient = () => {
    const newIngredients = [...ingredients, { name: '', measure: '' }];
    setIngredients(newIngredients);
    setValue('ingredients', newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
      setValue('ingredients', newIngredients);
    }
  };

  const onSubmit: SubmitHandler<MealFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      let imageBase64: string | null = null;
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        imageBase64 = await convertToBase64(file);
      }

      // Создаем объект с явными типами
      const mealData: Meal = {
        idMeal: initialData?.idMeal || `user-${Date.now()}`,
        strMeal: data.strMeal,
        strCategory: data.strCategory,
        strArea: data.strArea,
        strInstructions: data.strInstructions,
        strMealThumb: imageBase64 || initialData?.strMealThumb || '',
        strTags: data.strTags || undefined,
        strYoutube: data.strYoutube || undefined,
      };

      // Добавляем ингредиенты с явной типизацией
      data.ingredients.forEach((ingredient, index) => {
        mealData[`strIngredient${index + 1}` as keyof Meal] = ingredient.name;
        mealData[`strMeasure${index + 1}` as keyof Meal] = ingredient.measure;
      });

      if (initialData) {
        dispatch(updateUserMeal(mealData));
      } else {
        dispatch(addUserMeal(mealData));
      }
      // Save to localStorage
      const userMeals = JSON.parse(localStorage.getItem('userMeals') || '[]');
      if (initialData) {
        const updatedMeals = userMeals.map((meal: Meal) =>
          meal.idMeal === initialData.idMeal ? mealData : meal
        );
        localStorage.setItem('userMeals', JSON.stringify(updatedMeals));
      } else {
        localStorage.setItem(
          'userMeals',
          JSON.stringify([...userMeals, mealData])
        );
      }

      reset();
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.imageUploadContainer}>
        <div className={styles.imagePreview}>
          {previewImage ? (
            <img src={previewImage} alt="Preview" className={styles.previewImage} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ArrowLeft size={24} />
              <span>Select an image</span>
            </div>
          )}
        </div>
        <label className={styles.uploadButton}>
          Choose Image
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImageChange}
          />
        </label>
        {errors.image && (
          <span className={styles.errorMessage}>
            {errors.image.message?.toString()}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="meal-name">Meal Name*</label>
        <input
          id="meal-name"
          {...register('strMeal')}
          className={errors.strMeal ? styles.error : ''}
        />
        {errors.strMeal && (
          <span className={styles.errorMessage}>
            {typeof errors.strMeal.message === 'string' ? errors.strMeal.message : 'Invalid name'}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="meal-category">Category*</label>
        <input
          id="meal-category"
          {...register('strCategory')}
          className={errors.strCategory ? styles.error : ''}
        />
        {errors.strCategory && (
          <span className={styles.errorMessage}>{errors.strCategory.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="meal-area">Cuisine/Area*</label>
        <input
          id="meal-area"
          {...register('strArea')}
          className={errors.strArea ? styles.error : ''}
        />
        {errors.strArea && (
          <span className={styles.errorMessage}>{errors.strArea.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="meal-tags">Tags (comma separated)</label>
        <input
          id="meal-tags"
          {...register('strTags')}
          placeholder="e.g. ComfortFood,Vegetarian"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="meal-youtube">YouTube URL</label>
        <input
          id="meal-youtube"
          {...register('strYoutube')}
          placeholder="https://www.youtube.com/watch?v=..."
          className={errors.strYoutube ? styles.error : ''}
        />
        {errors.strYoutube && (
          <span className={styles.errorMessage}>{errors.strYoutube.message}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="meal-instructions">Instructions*</label>
        <textarea
          id="meal-instructions"
          {...register('strInstructions')}
          rows={6}
          className={errors.strInstructions ? styles.error : ''}
        />
        {errors.strInstructions && (
          <span className={styles.errorMessage}>{errors.strInstructions.message}</span>
        )}
      </div>

      <div className={styles.ingredientsSection}>
        <h3>Ingredients*</h3>
        {ingredients.map((ingredient, index) => (
          <div key={index} className={styles.ingredientRow}>
            <div className={styles.ingredientInput}>
              <input
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                className={errors.ingredients?.[index]?.name ? styles.error : ''}
              />
              {errors.ingredients?.[index]?.name && (
                <span className={styles.errorMessage}>
                  {errors.ingredients[index]?.name?.message}
                </span>
              )}
            </div>
            <div className={styles.measureInput}>
              <input
                placeholder="Measure"
                value={ingredient.measure}
                onChange={(e) => handleIngredientChange(index, 'measure', e.target.value)}
                className={errors.ingredients?.[index]?.measure ? styles.error : ''}
              />
              {errors.ingredients?.[index]?.measure && (
                <span className={styles.errorMessage}>
                  {errors.ingredients[index]?.measure?.message}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className={styles.removeIngredient}
              disabled={ingredients.length <= 1}
            >
              ×
            </button>
          </div>
        ))}
        {errors.ingredients?.root && (
          <span className={styles.errorMessage}>
            {errors.ingredients.root.message}
          </span>
        )}
        <button
          type="button"
          onClick={addIngredient}
          className={styles.addIngredient}
        >
          + Add Ingredient
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Saving...' : initialData ? 'Update Meal' : 'Add Meal'}
      </button>
    </form>
  );
};

export default MealForm;
