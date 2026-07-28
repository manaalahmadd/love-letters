'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/use-require-auth';
import { api, Letter } from '@/lib/api';

export default function LetterDetailPage() {
  const { token, loading } = useRequireAuth();
  const params = useParams();
  const router = useRouter();
  const letterId = params.id as string;

  const [letter, setLetter] = useState<Letter | null>(null);
  const [fetching, setFetching] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);

  useEffect(() => {
    if (!token) return;
    api
      .getLetter(token, letterId)
      .then((l) => {
        setLetter(l);
        setTitleDraft(l.title || '');
      })
      .catch(() => router.push('/letters'))
      .finally(() => setFetching(false));
  }, [token, letterId, router]);

  async function handleDelete() {
    if (!token) return;
    await api.deleteLetter(token, letterId);
    router.push('/letters');
  }

  async function saveTitle() {
    if (!token || !letter) return;
    setSavingTitle(true);
    try {
      const updated = await api.updateLetter(token, letterId, { title: titleDraft });
      setLetter(updated);
      setEditingTitle(false);
    } finally {
      setSavingTitle(false);
    }
  }

  function cancelEditTitle() {
    setTitleDraft(letter?.title || '');
    setEditingTitle(false);
  }

  if (loading || fetching || !letter) {
    return <main className="min-h-screen flex items-center justify-center text-slate">Loading...</main>;
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <button onClick={() => router.push('/letters')} className="text-slate text-sm underline mb-6">
        ← Back to letters
      </button>

      <div className="bg-paper text-ink rounded-sm p-8 envelope-unfold">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-widest text-wax font-medium">
            {letter.emotion_tag}
          </span>
          <span className="text-xs text-slate">
            {new Date(letter.created_at).toLocaleDateString()}
          </span>
        </div>

        {editingTitle ? (
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              placeholder="Untitled letter"
              autoFocus
              className="font-display text-2xl bg-transparent border-b border-ink/30 focus:outline-none focus:border-wax flex-1"
            />
            <button
              onClick={saveTitle}
              disabled={savingTitle}
              className="text-xs text-wax underline disabled:opacity-50"
            >
              {savingTitle ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancelEditTitle} className="text-xs text-slate underline">
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-6 group">
            <h1 className="font-display text-2xl">{letter.title || 'Untitled letter'}</h1>
            <button
              onClick={() => setEditingTitle(true)}
              className="text-xs text-slate underline opacity-60 hover:opacity-100"
            >
              Rename
            </button>
          </div>
        )}

        <p className="font-display leading-relaxed whitespace-pre-wrap">{letter.content}</p>
      </div>

      <div className="mt-6 flex justify-end">
        {confirmingDelete ? (
          <div className="flex items-center gap-3">
            <span className="text-slate text-sm">Delete this letter permanently?</span>
            <button onClick={handleDelete} className="text-wax text-sm underline">
              Yes, delete
            </button>
            <button onClick={() => setConfirmingDelete(false)} className="text-slate text-sm underline">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmingDelete(true)} className="text-slate text-sm underline">
            Delete letter
          </button>
        )}
      </div>
    </main>
  );
}
