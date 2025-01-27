import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/catalog">
        <Button>Return to Catalog</Button>
      </Link>
    </div>
  );
}