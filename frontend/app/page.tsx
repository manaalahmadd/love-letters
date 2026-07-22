import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-wax font-body text-sm tracking-widest uppercase mb-4">
        Private, guided, yours
      </p>
      <h1 className="font-display text-5xl md:text-6xl text-paper mb-6 max-w-2xl leading-tight">
        Say the thing you haven&apos;t said yet.
      </h1>
      <p className="text-slate font-body text-lg max-w-md mb-10">
        Write a Love Letter, one honest feeling at a time. It stays private, and
        finds you again when the moment is right.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="bg-wax text-paper px-6 py-3 rounded-sm font-body font-medium hover:opacity-90 transition"
        >
          Start writing
        </Link>
        <Link
          href="/login"
          className="border border-slate text-paper px-6 py-3 rounded-sm font-body font-medium hover:border-paper transition"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}
