export type Category = 'Men' | 'Women' | 'Kids' | 'Lifestyle' | 'Running';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  sizes: number[];
  rating: number;
  isFeatured?: boolean;
  isNewRelease?: boolean;
}

export interface CartItem extends Product {
  selectedSize: number;
  quantity: number;
}
