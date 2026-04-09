import { Product } from '@/types';

export const fetchProducts = async (filters: {
  category?: string;
  brand?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.brand) params.append('brand', filters.brand);
  if (filters.sort) params.append('sort', filters.sort);

  const response = await fetch(`/api/products?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json() as Promise<Product[]>;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) return undefined;
  return response.json() as Promise<Product>;
};

export const getRelatedProducts = async (category: string, currentId: string): Promise<Product[]> => {
  const products = await fetchProducts({ category });
  return products.filter(p => p.id !== currentId).slice(0, 4);
};
