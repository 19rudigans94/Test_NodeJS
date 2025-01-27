import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Discover our amazing products at great prices
        </p>
        <Link href="/catalog">
          <Button size="lg">Shop Now</Button>
        </Link>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}