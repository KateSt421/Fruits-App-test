import React from 'react';
import { useNavigate } from 'react-router-dom';
import FruitForm from '../../components/FruitForm/FruitForm';
import styles from './CreateProduct.module.css';
import { ArrowLeft } from 'lucide-react';

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/products');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate('/products')} className={styles.backButton}>
          <ArrowLeft size={18} /> Back to all fruits
        </button>
        <h1 className={styles.title}>Add New Fruit</h1>
      </div>

      <div className={styles.formContainer}>
        <FruitForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateProductPage;

