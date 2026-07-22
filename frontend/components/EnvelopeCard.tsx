import { Letter } from '@/lib/api';

const EMOTION_COLORS: Record<string, string> = {
  anger: '#C4623D',
  hurt: '#8B8FA3',
  fear: '#8B8FA3',
  regret: '#8B8FA3',
  love: '#2E7D6B',
};

export function EnvelopeCard({ letter, onClick }: { letter: Letter; onClick?: () => void }) {
  const accent = EMOTION_COLORS[letter.emotion_tag] || '#8B8FA3';
  const preview = letter.content.slice(0, 90).trim();

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-paper text-ink rounded-sm p-5 border-l-4 hover:-translate-y-0.5 transition-transform"
      style={{ borderLeftColor: accent }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs uppercase tracking-widest font-body font-medium"
          style={{ color: accent }}
        >
          {letter.emotion_tag}
        </span>
        <span className="text-xs text-slate font-body">
          {new Date(letter.created_at).toLocaleDateString()}
        </span>
      </div>
      <h3 className="font-display text-lg mb-1">{letter.title || 'Untitled letter'}</h3>
      <p className="text-sm text-ink/70 font-body line-clamp-2">{preview}...</p>
      {letter.resurfaced_at && (
        <p className="text-xs text-moss mt-2 font-body">✓ Resurfaced</p>
      )}
    </button>
  );
}
