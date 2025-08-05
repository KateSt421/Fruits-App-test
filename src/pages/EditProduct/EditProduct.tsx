import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import FruitForm from '../../components/FruitForm/FruitForm';
import styles from './EditProduct.module.css';
import { ArrowLeft } from 'lucide-react';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);

  const userFruits = useAppSelector((state) => state.fruits.userFruits);
  const fruitToEdit = userFruits.find((fruit) => fruit.id === numericId);

  const handleSuccess = () => {
    navigate(`/products/${numericId}`);
  };

  if (!fruitToEdit) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => navigate('/products')} className={styles.backButton}>
            <ArrowLeft size={18} /> Back to all fruits
          </button>
          <h1>Fruit not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(`/products/${numericId}`)} className={styles.backButton}>
          <ArrowLeft size={18} /> Back to fruit details
        </button>
        <h1 className={styles.title}>Edit {fruitToEdit.name}</h1>
      </div>

      <div className={styles.formContainer}>
        <FruitForm initialData={fruitToEdit} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default EditProductPage;

