'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LiveStreamPage({ params }: { params: { slug: string } }) {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect /live to the TikTok-Style Memory Reel Feed page
    router.replace(`/event/${params.slug}/feed`);
  }, [params.slug, router]);

  return (
    <div className="min-h-screen bg-charcoal text-ivory flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-serif text-gold-400">
          Redirecting to TikTok Video Memory Feed...
        </p>
      </div>
    </div>
  );
}
