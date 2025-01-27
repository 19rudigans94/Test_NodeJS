'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string;
  address: string;
  phone: string;
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    address: profile?.address || '',
    phone: profile?.phone || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          address: formData.address,
          phone: formData.phone,
        })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName">Full Name</label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
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
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone">Phone</label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}