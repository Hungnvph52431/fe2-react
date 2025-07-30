import React from 'react';
import useList, { Category, Product } from '../hooks/useList';


const ListPage = () => {
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useList<Category>('categories');
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useList<Product>('products');

  if (isLoadingCategories || isLoadingProducts) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  if (categoriesError || productsError) {
    return (
      <div className="text-center mt-10 text-red-500">
        Lỗi: {categoriesError?.message || productsError?.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách Categories</h2>
      <ul className="list-disc pl-5 mb-8">
        {categories?.map((category) => (
          <li key={category.id} className="mb-2">{category.name}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold mb-4">Danh sách Products</h2>
      <ul className="list-disc pl-5">
        {products?.map((product) => (
          <li key={product.id} className="mb-2">{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListPage;
