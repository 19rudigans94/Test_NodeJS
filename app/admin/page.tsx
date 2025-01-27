import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProductList } from './ProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminPage() {
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

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>
      <ProductList products={products || []} />
    </div>
  );
}