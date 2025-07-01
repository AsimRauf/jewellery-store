'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MensPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/fine-jewellery/mens/all');
  }, [router]);

  return null;
}