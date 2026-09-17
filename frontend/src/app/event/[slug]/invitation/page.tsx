'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectContent({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');

  useEffect(() => {
    const targetUrl = codeParam 
      ? `/event/${slug}?code=${codeParam}` 
      : `/event/${slug}`;
    router.replace(targetUrl);
  }, [slug, codeParam, router]);

  return (
    <div className="min-h-screen bg-black text-gold-400 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-serif text-gold-400 text-sm">Opening Unified Wedding Celebration Hub...</p>
      </div>
    </div>
  );
}

export default function RedirectInvitationPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={null}>
      <RedirectContent slug={params.slug} />
    </Suspense>
  );
}

