'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(email, password, displayName || undefined);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-paper mb-8 text-center">
          Start your first letter
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name (optional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-transparent border border-slate rounded-sm px-4 py-3 text-paper placeholder:text-slate focus:outline-none focus:border-wax"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border border-slate rounded-sm px-4 py-3 text-paper placeholder:text-slate focus:outline-none focus:border-wax"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-transparent border border-slate rounded-sm px-4 py-3 text-paper placeholder:text-slate focus:outline-none focus:border-wax"
          />
          {error && <p className="text-wax text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-wax text-paper py-3 rounded-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-slate text-sm text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-paper underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
