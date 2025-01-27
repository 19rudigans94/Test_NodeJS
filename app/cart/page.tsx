'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to your cart to continue shopping.</p>
        <Link href="/catalog">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border rounded-lg p-4">
              <div className="relative w-24 h-24">
                <Image
                  src={item.image_url || 'https://via.placeholder.com/400'}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4 sticky top-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between py-4 border-b">
              <span>Subtotal</span>
              <span>${total().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total().toFixed(2)}</span>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}