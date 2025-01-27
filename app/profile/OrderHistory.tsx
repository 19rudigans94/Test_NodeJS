import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface OrderItem {
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  order_items: OrderItem[];
}

export function OrderHistory({ orders }: { orders: Order[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No orders yet
            </p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-semibold">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-sm capitalize">{order.status}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.products.image_url || 'https://via.placeholder.com/400'}
                          alt={item.products.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.products.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}