import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FruitType } from '../../api/types';
import styles from './FruitForm.module.css';
import { useAppDispatch } from '../../store/store';
import { addUserFruit, updateUserFruit } from '../../store/slices/fruitsSlice';
import { ArrowLeft } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const fruitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  family: z.string().min(2, 'Family must be at least 2 characters'),
  order: z.string().min(2, 'Order must be at least 2 characters'),
  genus: z.string().min(2, 'Genus must be at least 2 characters'),
  carbohydrates: z.number().min(0, 'Carbohydrates must be positive'),
  protein: z.number().min(0, 'Protein must be positive'),
  fat: z.number().min(0, 'Fat must be positive'),
  calories: z.number().min(0, 'Calories must be positive'),
  sugar: z.number().min(0, 'Sugar must be positive'),
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

type FruitFormValues = z.infer<typeof fruitSchema>;

interface FruitFormProps {
  initialData?: FruitType;
  onSuccess?: () => void;
}

const FruitForm: React.FC<FruitFormProps> = ({ initialData, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FruitFormValues>({
    resolver: zodResolver(fruitSchema),
    defaultValues: initialData
      ? {
        name: initialData.name,
        family: initialData.family,
        order: initialData.order,
        genus: initialData.genus,
        carbohydrates: initialData.nutritions.carbohydrates,
        protein: initialData.nutritions.protein,
        fat: initialData.nutritions.fat,
        calories: initialData.nutritions.calories,
        sugar: initialData.nutritions.sugar,
      }
      : undefined,
  });

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

  const onSubmit: SubmitHandler<FruitFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      let imageBase64: string | null = null;
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        imageBase64 = await convertToBase64(file);
      }

      const fruitData: FruitType = {
        ...data,
        id: initialData?.id || Date.now(),
        nutritions: {
          carbohydrates: data.carbohydrates,
          protein: data.protein,
          fat: data.fat,
          calories: data.calories,
          sugar: data.sugar,
        },
        isUserCreated: true,
        imageUrl: imageBase64 || initialData?.imageUrl || null,
      };

      if (initialData) {
        dispatch(updateUserFruit(fruitData));
      } else {
        dispatch(addUserFruit(fruitData));
      }

      const userFruits = JSON.parse(localStorage.getItem('userFruits') || '[]');
      if (initialData) {
        const updatedFruits = userFruits.map((fruit: FruitType) =>
          fruit.id === initialData.id ? fruitData : fruit
        );
        localStorage.setItem('userFruits', JSON.stringify(updatedFruits));
      } else {
        localStorage.setItem(
          'userFruits',
          JSON.stringify([...userFruits, fruitData])
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
        <label htmlFor="fruit-name">Name</label>
        <input
          id="fruit-name"
          {...register('name')}
          className={errors.name ? styles.error : ''}
        />
        {errors.name && (
          <span className={styles.errorMessage}>
            {typeof errors.name.message === 'string' ? errors.name.message : 'Invalid name'}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="fruit-family">Family</label>
        <input
          id="fruit-family"
          {...register('family')}
          className={errors.family ? styles.error : ''}
        />
        {errors.family && <span className={styles.errorMessage}>{errors.family.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="fruit-order">Order</label>
        <input
          id="fruit-order"
          {...register('order')}
          className={errors.order ? styles.error : ''}
        />
        {errors.order && <span className={styles.errorMessage}>{errors.order.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="fruit-genus">Genus</label>
        <input
          id="fruit-genus"
          {...register('genus')}
          className={errors.genus ? styles.error : ''}
        />
        {errors.genus && <span className={styles.errorMessage}>{errors.genus.message}</span>}
      </div>

      <h3>Nutrition Information</h3>

      <div className={styles.nutritionGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="fruit-carbs">Carbohydrates (g)</label>
          <input
            id="fruit-carbs"
            type="number"
            step="0.1"
            {...register('carbohydrates', { valueAsNumber: true })}
            className={errors.carbohydrates ? styles.error : ''}
          />
          {errors.carbohydrates && <span className={styles.errorMessage}>{errors.carbohydrates.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fruit-protein">Protein (g)</label>
          <input
            id="fruit-protein"
            type="number"
            step="0.1"
            {...register('protein', { valueAsNumber: true })}
            className={errors.protein ? styles.error : ''}
          />
          {errors.protein && <span className={styles.errorMessage}>{errors.protein.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fruit-fat">Fat (g)</label>
          <input
            id="fruit-fat"
            type="number"
            step="0.1"
            {...register('fat', { valueAsNumber: true })}
            className={errors.fat ? styles.error : ''}
          />
          {errors.fat && <span className={styles.errorMessage}>{errors.fat.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fruit-calories">Calories</label>
          <input
            id="fruit-calories"
            type="number"
            step="1"
            {...register('calories', { valueAsNumber: true })}
            className={errors.calories ? styles.error : ''}
          />
          {errors.calories && <span className={styles.errorMessage}>{errors.calories.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fruit-sugar">Sugar (g)</label>
          <input
            id="fruit-sugar"
            type="number"
            step="0.1"
            {...register('sugar', { valueAsNumber: true })}
            className={errors.sugar ? styles.error : ''}
          />
          {errors.sugar && <span className={styles.errorMessage}>{errors.sugar.message}</span>}
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Saving...' : initialData ? 'Update Fruit' : 'Add Fruit'}
      </button>
    </form>
  );
};

export default FruitForm;
