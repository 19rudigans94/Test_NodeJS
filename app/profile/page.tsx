import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProfileForm } from './ProfileForm';
import { OrderHistory } from './OrderHistory';

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          price,
          image_url
        )
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <ProfileForm profile={profile} />
        <OrderHistory orders={orders || []} />
      </div>
    </div>
  );
}