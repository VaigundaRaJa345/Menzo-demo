import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, columns = 4 }) => {
  const gridCols =
    columns === 3
      ? 'grid-cols-2 md:grid-cols-3'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid ${gridCols} gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-7 lg:gap-y-12`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
