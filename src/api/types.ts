export interface Nutrition {
  carbohydrates: number;
  protein: number;
  fat: number;
  calories: number;
  sugar: number;
}

export interface Fruit {
  id: number;
  name: string;
  family: string;
  order: string;
  genus: string;
  nutritions: Nutrition;
  isLiked?: boolean;
  isUserCreated?: boolean;
  imageUrl?: string | null; // Изменяем тип на string | null | undefined
}

export interface UserFruit extends Omit<Fruit, 'id' | 'isUserCreated'> {
  id?: number;
  isUserCreated: true;
}

export type FruitType = Fruit | UserFruit;
