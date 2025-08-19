import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Meal } from "../../api/types";
import styles from "./MealForm.module.css";
import { useAppDispatch } from "../../store/store";
import { updateMeal } from "../../store/slices/mealsSlice";
import { ImageUpload } from "../../components/ImageUpload/ImageUpload";
import { InputField } from "../../components/InputField/InputField";
import { TextAreaField } from "../../components/TextAreaField/TextAreaField";
import { IngredientForm } from "../../components/IngredientForm/IngredientForm";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const mealSchema = z.object({
  strMeal: z.string().min(2, "Name must be at least 2 characters"),
  strCategory: z.string().min(2, "Category must be at least 2 characters"),
  strArea: z.string().min(2, "Cuisine must be at least 2 characters"),
  strInstructions: z
    .string()
    .min(10, "Instructions must be at least 10 characters"),
  strTags: z.string().optional(),
  strYoutube: z
    .string()
    .url("Invalid YouTube URL")
    .optional()
    .or(z.literal("")),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name required"),
        measure: z.string().min(1, "Measure required"),
      })
    )
    .min(1, "At least one ingredient required"),
  imageFile: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE,
      {
        message: "Max image size is 5MB",
      }
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      "Only .jpg, .png and .webp formats are supported"
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      strMeal: initialData?.strMeal || "",
      strCategory: initialData?.strCategory || "",
      strArea: initialData?.strArea || "",
      strInstructions: initialData?.strInstructions || "",
      strTags: initialData?.strTags || "",
      strYoutube: initialData?.strYoutube || "",
      ingredients: initialData
        ? extractIngredients(initialData)
        : [{ name: "", measure: "" }],
    },
  });

  const imageFile = watch("imageFile");
  const ingredients = watch("ingredients");

  function extractIngredients(meal: Meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof Meal];
      const measure = meal[`strMeasure${i}` as keyof Meal];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient,
          measure: measure || "",
        });
      }
    }
    return ingredients.length > 0 ? ingredients : [{ name: "", measure: "" }];
  }

  useEffect(() => {
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
      const file = e.target.files[0];
      setValue("imageFile", e.target.files);
      clearErrors("imageFile");

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setValue("imageFile", undefined);
      setPreviewImage(initialData?.strMealThumb || null);
    }
  };

  const addIngredient = () => {
    const currentIngredients = watch("ingredients");
    const newIngredients = [...currentIngredients, { name: "", measure: "" }];
    setValue("ingredients", newIngredients);
  };

  const removeIngredient = (index: number) => {
    const currentIngredients = watch("ingredients");
    if (currentIngredients.length > 1) {
      const newIngredients = [...currentIngredients];
      newIngredients.splice(index, 1);
      setValue("ingredients", newIngredients);
    }
  };

  const handleIngredientChange = (
    index: number,
    field: "name" | "measure",
    value: string
  ) => {
    const currentIngredients = watch("ingredients");
    const newIngredients = [...currentIngredients];
    newIngredients[index][field] = value;
    setValue("ingredients", newIngredients);
  };

  const onSubmit: SubmitHandler<MealFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      let imageBase64: string | null = null;

      if (data.imageFile && data.imageFile.length > 0) {
        imageBase64 = await convertToBase64(data.imageFile[0]);
      }

      const mealData: Meal = {
        idMeal: initialData?.idMeal || `user-${Date.now()}`,
        strMeal: data.strMeal,
        strCategory: data.strCategory,
        strArea: data.strArea,
        strInstructions: data.strInstructions,
        strMealThumb: imageBase64 || initialData?.strMealThumb || "",
        strTags: data.strTags || undefined,
        strYoutube: data.strYoutube || undefined,
      };

      data.ingredients.forEach((ingredient, index) => {
        if (ingredient.name.trim()) {
          mealData[`strIngredient${index + 1}` as keyof Meal] = ingredient.name;
          mealData[`strMeasure${index + 1}` as keyof Meal] = ingredient.measure;
        }
      });

      for (let i = data.ingredients.length + 1; i <= 20; i++) {
        mealData[`strIngredient${i}` as keyof Meal] = "";
        mealData[`strMeasure${i}` as keyof Meal] = "";
      }

      dispatch(updateMeal(mealData));
      onSuccess?.();
    } catch (error) {
      console.error("Error saving meal:", error);
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
      <ImageUpload
        previewImage={previewImage}
        error={errors.imageFile?.message?.toString()}
        onImageChange={handleImageChange}
      />

      <InputField
        id="meal-name"
        label="Meal Name"
        register={register("strMeal")}
        error={errors.strMeal?.message}
        required
      />

      <InputField
        id="meal-category"
        label="Category"
        register={register("strCategory")}
        error={errors.strCategory?.message}
        required
      />

      <InputField
        id="meal-area"
        label="Cuisine/Area"
        register={register("strArea")}
        error={errors.strArea?.message}
        required
      />

      <InputField
        id="meal-tags"
        label="Tags (comma separated)"
        register={register("strTags")}
        placeholder="e.g. ComfortFood,Vegetarian"
      />

      <InputField
        id="meal-youtube"
        label="YouTube URL"
        register={register("strYoutube")}
        error={errors.strYoutube?.message}
        placeholder="https://www.youtube.com/watch?v=..."
      />

      <TextAreaField
        id="meal-instructions"
        label="Instructions"
        register={register("strInstructions")}
        error={errors.strInstructions?.message}
        rows={6}
        required
      />
      <IngredientForm
        ingredients={ingredients}
        errors={errors.ingredients}
        onAddIngredient={addIngredient}
        onRemoveIngredient={removeIngredient}
        onIngredientChange={handleIngredientChange}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Saving..." : initialData ? "Update Meal" : "Add Meal"}
      </button>
    </form>
  );
};

export default MealForm;
