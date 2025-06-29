'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EngagementPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to all engagement rings
    router.replace('/engagement/all');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <p>Redirecting to engagement rings...</p>
      </div>
    </div>
  );
}
