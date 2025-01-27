'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

export function ProductCard({ id, name, price, description, image_url }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ id, name, price, quantity: 1, image_url });
    toast.success('Added to cart');
  };

  return (
    <Card className="overflow-hidden">
      <Link href={`/product/${id}`}>
        <div className="aspect-square relative">
          <Image
            src={image_url || 'https://via.placeholder.com/400'}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-semibold text-lg truncate">{name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
          {description}
        </p>
        <p className="text-lg font-bold mt-2">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}