'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/use-require-auth';
import { api, Letter } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user, token, loading } = useRequireAuth();
  const { logout } = useAuth();
  const [resurfaced, setResurfaced] = useState<Letter[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .getResurfaced(token)
      .then(setResurfaced)
      .catch(() => setResurfaced([]))
      .finally(() => setFetching(false));
  }, [token]);

  async function dismiss(letterId: string) {
    if (!token) return;
    await api.acknowledgeResurface(token, letterId);
    setResurfaced((prev) => prev.filter((l) => l.id !== letterId));
  }

  if (loading || !user) {
    return <main className="min-h-screen flex items-center justify-center text-slate">Loading...</main>;
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-slate text-sm font-body">Welcome back</p>
          <h1 className="font-display text-2xl text-paper">{user.display_name || user.email}</h1>
        </div>
        <button onClick={logout} className="text-slate text-sm underline">
          Log out
        </button>
      </div>

      {!fetching && resurfaced.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-xl text-paper mb-3">Finding you again</h2>
          <p className="text-slate text-sm mb-4">
            You wrote these a while ago. Here&apos;s how you felt then.
          </p>
          <div className="space-y-3">
            {resurfaced.map((letter) => (
              <div key={letter.id} className="bg-paper text-ink rounded-sm p-5 envelope-unfold">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest text-wax font-medium">
                    {letter.emotion_tag}
                  </span>
                  <span className="text-xs text-slate">
                    {new Date(letter.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-display text-lg mb-2">{letter.title || 'Untitled letter'}</h3>
                <p className="text-sm font-display leading-relaxed whitespace-pre-wrap mb-4">
                  {letter.content}
                </p>
                <button
                  onClick={() => dismiss(letter.id)}
                  className="text-xs text-slate underline"
                >
                  Mark as read
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/write"
          className="bg-wax text-paper rounded-sm p-6 hover:opacity-90 transition"
        >
          <h3 className="font-display text-xl mb-1">Write a letter</h3>
          <p className="text-sm text-paper/80">Pick a feeling, get guided prompts.</p>
        </Link>
        <Link
          href="/letters"
          className="border border-slate text-paper rounded-sm p-6 hover:border-paper transition"
        >
          <h3 className="font-display text-xl mb-1">Your letters</h3>
          <p className="text-sm text-slate">Everything you&apos;ve written, privately kept.</p>
        </Link>
      </div>
    </main>
  );
}
