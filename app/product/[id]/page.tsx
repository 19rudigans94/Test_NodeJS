import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { AddToCart } from './AddToCart';
import Image from 'next/image';

interface Props {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.image_url || 'https://via.placeholder.com/800'}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>
          <div className="pt-6">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}