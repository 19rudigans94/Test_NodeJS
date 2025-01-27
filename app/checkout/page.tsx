'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth');
        return;
      }

      const { error: orderError, data: order } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          status: 'pending',
          total: total(),
          shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
          contact_email: formData.email,
          contact_phone: formData.phone,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast.success('Order placed successfully!');
      router.push('/profile');
    } catch (error: any) {
      toast.error('Failed to place order. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${total().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fullName">Full Name</label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone">Phone</label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address">Address</label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="city">City</label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="postalCode">Postal Code</label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}