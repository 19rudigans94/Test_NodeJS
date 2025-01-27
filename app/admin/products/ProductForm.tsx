'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    image_url: product?.image_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (product?.id) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', product.id);

        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase.from('products').insert([formData]);

        if (error) throw error;
        toast.success('Product created successfully');
      }

      router.push('/admin');
      router.refresh();
    } catch (error: any) {
      toast.error(
        product?.id
          ? 'Failed to update product'
          : 'Failed to create product'
      );
      console.error('Product form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price">Price</label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="stock">Stock</label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="image_url">Image URL</label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? product?.id
                  ? 'Updating...'
                  : 'Creating...'
                : product?.id
                ? 'Update Product'
                : 'Create Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}