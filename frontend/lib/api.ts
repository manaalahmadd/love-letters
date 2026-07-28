const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

type FetchOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errBody.detail || 'Request failed');
  }

  return res.json();
}

export type User = {
  id: string;
  email: string;
  display_name?: string | null;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type Letter = {
  id: string;
  emotion_tag: string;
  title?: string | null;
  content: string;
  created_at: string;
  resurfaced_at?: string | null;
  is_archived: boolean;
};

export type EmotionInfo = {
  emotion: string;
  description: string;
};

export const api = {
  signup: (email: string, password: string, display_name?: string) =>
    request<AuthResponse>('/auth/signup', { method: 'POST', body: { email, password, display_name } }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } }),

  listEmotions: () => request<EmotionInfo[]>('/prompts/emotions'),

  generatePrompts: (token: string, emotion: string, context?: string) =>
    request<{ emotion: string; lead_in_phrases: string[]; source: string }>('/prompts/generate', {
      method: 'POST',
      token,
      body: { emotion, context },
    }),

  createLetter: (token: string, emotion_tag: string, content: string, title?: string) =>
    request<Letter>('/letters', { method: 'POST', token, body: { emotion_tag, content, title } }),

  listLetters: (token: string) => request<Letter[]>('/letters', { token }),

  getResurfaced: (token: string) => request<Letter[]>('/letters/resurfaced', { token }),

  acknowledgeResurface: (token: string, letterId: string) =>
    request<Letter>(`/letters/${letterId}/acknowledge-resurface`, { method: 'POST', token }),

  getLetter: (token: string, letterId: string) => request<Letter>(`/letters/${letterId}`, { token }),

  deleteLetter: (token: string, letterId: string) =>
    request<{ ok: boolean }>(`/letters/${letterId}`, { method: 'DELETE', token }),

  updateLetter: (token: string, letterId: string, updates: { title?: string; content?: string }) =>
    request<Letter>(`/letters/${letterId}`, { method: 'PATCH', token, body: updates }),
};
