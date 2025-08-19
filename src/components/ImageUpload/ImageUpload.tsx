// components/ImageUpload/ImageUpload.tsx
import React from 'react';
import { Upload } from 'lucide-react';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  previewImage: string | null;
  error?: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  previewImage,
  error,
  onImageChange,
}) => {
  return (
    <div className={styles.imageUploadContainer}>
      <div className={styles.imagePreview}>
        {previewImage ? (
          <img
            src={previewImage}
            alt="Preview"
            className={styles.previewImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <Upload size={24} />
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
          onChange={onImageChange}
        />
      </label>
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </div>
  );
};