'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BraceletsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/fine-jewellery/bracelets/all');
  }, [router]);

  return null;
}