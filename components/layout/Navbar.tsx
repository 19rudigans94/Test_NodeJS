'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Package className="h-6 w-6" />
              <span className="ml-2 text-xl font-semibold">Store</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/catalog"
                className={`inline-flex items-center px-1 pt-1 ${
                  pathname === '/catalog'
                    ? 'border-b-2 border-primary'
                    : 'text-muted-foreground'
                }`}
              >
                Catalog
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}