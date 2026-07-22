'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/use-require-auth';
import { api, Letter } from '@/lib/api';
import { EnvelopeCard } from '@/components/EnvelopeCard';

export default function LettersPage() {
  const { token, loading } = useRequireAuth();
  const router = useRouter();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .listLetters(token)
      .then(setLetters)
      .finally(() => setFetching(false));
  }, [token]);

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-slate">Loading...</main>;
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-paper">Your letters</h1>
        <Link href="/write" className="text-wax text-sm underline">
          + New letter
        </Link>
      </div>

      {!fetching && letters.length === 0 && (
        <p className="text-slate text-sm">
          Nothing here yet.{' '}
          <Link href="/write" className="underline text-paper">
            Write your first letter
          </Link>
          .
        </p>
      )}

      <div className="space-y-3">
        {letters.map((letter) => (
          <EnvelopeCard key={letter.id} letter={letter} onClick={() => router.push(`/letters/${letter.id}`)} />
        ))}
      </div>
    </main>
  );
}
