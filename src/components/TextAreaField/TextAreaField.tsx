// components/TextAreaField/TextAreaField.tsx
import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import styles from "./TextAreaField.module.css";

interface TextAreaFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  rows?: number;
  required?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  label,
  placeholder,
  error,
  register,
  rows = 4,
  required = false,
}) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>
        {label}
        {required && "*"}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className={error ? styles.error : ""}
        {...register}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
