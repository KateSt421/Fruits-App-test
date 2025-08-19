import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import styles from "./InputField.module.css";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  register,
  required = false,
}) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>
        {label}
        {required && "*"}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={error ? styles.error : ""}
        {...register}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
