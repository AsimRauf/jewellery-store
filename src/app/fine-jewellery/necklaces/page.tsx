'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NecklacesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/fine-jewellery/necklaces/all');
  }, [router]);

  return null;
}