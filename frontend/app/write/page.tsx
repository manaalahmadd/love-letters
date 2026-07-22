'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/use-require-auth';
import { api, EmotionInfo } from '@/lib/api';

type StageDraft = {
  emotion: string;
  description: string;
  leadInPhrases: string[];
  text: string;
};

export default function WritePage() {
  const { token, loading } = useRequireAuth();
  const router = useRouter();

  const [phase, setPhase] = useState<'context' | 'stages' | 'saving'>('context');
  const [situation, setSituation] = useState('');
  const [emotions, setEmotions] = useState<EmotionInfo[]>([]);
  const [stages, setStages] = useState<StageDraft[]>([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listEmotions().then(setEmotions).catch(() => setError('Could not load prompts'));
  }, []);

  async function beginStages() {
    if (!token) return;
    setLoadingPrompts(true);
    setError('');
    try {
      const drafts: StageDraft[] = [];
      for (const e of emotions) {
        const res = await api.generatePrompts(token, e.emotion, situation || undefined);
        drafts.push({
          emotion: e.emotion,
          description: e.description,
          leadInPhrases: res.lead_in_phrases,
          text: '',
        });
      }
      setStages(drafts);
      setPhase('stages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong generating prompts');
    } finally {
      setLoadingPrompts(false);
    }
  }

  function updateCurrentText(text: string) {
    setStages((prev) => prev.map((s, i) => (i === stageIndex ? { ...s, text } : s)));
  }

  function insertPhrase(phrase: string) {
    const current = stages[stageIndex];
    const sep = current.text.trim() ? '\n\n' : '';
    updateCurrentText(current.text + sep + phrase + ' ');
  }

  async function saveLetter() {
    if (!token) return;
    setPhase('saving');
    setError('');
    try {
      const combined = stages
        .filter((s) => s.text.trim())
        .map((s) => `— ${s.emotion.toUpperCase()} —\n${s.text.trim()}`)
        .join('\n\n');

      const finalEmotion = stages[stages.length - 1]?.emotion || 'love';
      const letter = await api.createLetter(token, finalEmotion, combined, title || undefined);
      router.push(`/letters/${letter.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save letter');
      setPhase('stages');
    }
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-slate">Loading...</main>;
  }

  if (phase === 'context') {
    return (
      <main className="min-h-screen px-6 py-10 max-w-xl mx-auto">
        <h1 className="font-display text-3xl text-paper mb-3">What&apos;s on your mind?</h1>
        <p className="text-slate text-sm mb-6">
          A sentence or two is enough. This just helps shape the prompts — nobody else sees it.
        </p>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="e.g. My partner forgot our anniversary and I haven't said anything yet"
          rows={4}
          className="w-full bg-transparent border border-slate rounded-sm px-4 py-3 text-paper placeholder:text-slate focus:outline-none focus:border-wax mb-4"
        />
        {error && <p className="text-wax text-sm mb-4">{error}</p>}
        <button
          onClick={beginStages}
          disabled={loadingPrompts}
          className="bg-wax text-paper px-6 py-3 rounded-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loadingPrompts ? 'Preparing your letter...' : 'Begin writing'}
        </button>
      </main>
    );
  }

  if (phase === 'stages') {
    const stage = stages[stageIndex];
    const isLast = stageIndex === stages.length - 1;

    return (
      <main className="min-h-screen px-6 py-10 max-w-xl mx-auto">
        <div className="flex gap-1 mb-8">
          {stages.map((s, i) => (
            <div
              key={s.emotion}
              className={`h-1 flex-1 rounded-full ${i <= stageIndex ? 'bg-wax' : 'bg-slate/30'}`}
            />
          ))}
        </div>

        <span className="text-xs uppercase tracking-widest text-wax font-medium">
          {stage.emotion} · {stageIndex + 1} of {stages.length}
        </span>
        <h1 className="font-display text-2xl text-paper mt-2 mb-4">{stage.description}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {stage.leadInPhrases.map((phrase) => (
            <button
              key={phrase}
              onClick={() => insertPhrase(phrase)}
              className="text-sm border border-slate rounded-full px-3 py-1.5 text-paper hover:border-wax hover:text-wax transition"
            >
              {phrase}
            </button>
          ))}
        </div>

        <textarea
          value={stage.text}
          onChange={(e) => updateCurrentText(e.target.value)}
          placeholder="Write freely here..."
          rows={8}
          className="w-full bg-paper text-ink rounded-sm px-4 py-3 placeholder:text-slate focus:outline-none mb-6 font-display"
        />

        {error && <p className="text-wax text-sm mb-4">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStageIndex((i) => Math.max(0, i - 1))}
            disabled={stageIndex === 0}
            className="text-slate text-sm underline disabled:opacity-30"
          >
            Back
          </button>

          {isLast ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Give it a title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border border-slate rounded-sm px-3 py-2 text-paper placeholder:text-slate text-sm focus:outline-none focus:border-wax"
              />
              <button
                onClick={saveLetter}
                className="bg-wax text-paper px-6 py-3 rounded-sm font-medium hover:opacity-90 transition"
              >
                Save letter
              </button>
            </div>
          ) : (
            <button
              onClick={() => setStageIndex((i) => Math.min(stages.length - 1, i + 1))}
              className="bg-wax text-paper px-6 py-3 rounded-sm font-medium hover:opacity-90 transition"
            >
              Next
            </button>
          )}
        </div>
      </main>
    );
  }

  return <main className="min-h-screen flex items-center justify-center text-slate">Saving your letter...</main>;
}
