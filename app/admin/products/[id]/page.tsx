import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProductForm } from '../ProductForm';

interface Props {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}