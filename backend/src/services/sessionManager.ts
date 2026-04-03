import { SessionContext } from '@voice-agent/shared';
import { v4 as uuidv4 } from 'uuid';

// In-memory session store — swap with Redis for production
const sessions = new Map<string, SessionContext>();

export function createSession(userId?: string): SessionContext {
  const session: SessionContext = {
    sessionId: uuidv4(),
    userId,
    history: [],
    language: 'hi-IN',
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };
  sessions.set(session.sessionId, session);
  console.log(`[session] Created: ${session.sessionId}`);
  return session;
}

export function getSession(sessionId: string): SessionContext | undefined {
  return sessions.get(sessionId);
}

export function updateSession(sessionId: string, patch: Partial<SessionContext>): void {
  const s = sessions.get(sessionId);
  if (s) {
    Object.assign(s, { ...patch, lastActivity: Date.now() });
  }
}

export function addToHistory(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): void {
  const s = sessions.get(sessionId);
  if (s) {
    s.history.push({ role, content });
    // Keep last 20 turns to avoid context bloat
    if (s.history.length > 20) s.history.splice(0, s.history.length - 20);
    s.lastActivity = Date.now();
  }
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
  console.log(`[session] Deleted: ${sessionId}`);
}

// Cleanup stale sessions every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [id, s] of sessions) {
    if (s.lastActivity < cutoff) {
      sessions.delete(id);
      console.log(`[session] Expired: ${id}`);
    }
  }
}, 60_000);
