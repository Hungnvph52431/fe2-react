import { useQuery } from '@tanstack/react-query';

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

const API_ENDPOINTS = {
  products: 'http://localhost:3001/products',
  categories: 'http://localhost:3001/categories',
  users: 'http://localhost:3001/users',
  brands: 'http://localhost:3001/brands',
} as const;

type Resource = keyof typeof API_ENDPOINTS;

const useList = <T>(resource: Resource) => {
  const fetchData = async (): Promise<T[]> => {
    const res = await fetch(API_ENDPOINTS[resource]);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${resource}`);
    }
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [resource],
    queryFn: fetchData,
  });

  return { data, isLoading, error };
};

export default useList;
