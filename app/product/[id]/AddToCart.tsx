'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    });
    toast.success('Added to cart');
  };

  return (
    <div className="flex gap-4">
      <Input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="w-20"
      />
      <Button size="lg" onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </div>
  );
}