'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-paper mb-8 text-center">Welcome back</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-transparent border border-slate rounded-sm px-4 py-3 text-paper placeholder:text-slate focus:outline-none focus:border-wax"
          />
          {error && <p className="text-wax text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-wax text-paper py-3 rounded-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="text-slate text-sm text-center mt-6">
          No account yet?{' '}
          <Link href="/signup" className="text-paper underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
