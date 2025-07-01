'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EarringsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/fine-jewellery/earrings/all');
  }, [router]);

  return null;
}