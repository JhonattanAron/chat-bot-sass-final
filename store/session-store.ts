// lib/session-store.ts
// In-memory session store for securely managing API keys
// This is NOT database storage - keys are held only in server memory

interface SessionData {
  apiKey: string;
  createdAt: number;
  lastAccessed: number;
}

const sessions = new Map<string, SessionData>();

// Generate a secure session ID
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Store API key in memory and return session ID
export function createSession(apiKey: string): string {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    apiKey,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
  });
  
  // Auto-cleanup after 24 hours
  setTimeout(() => {
    sessions.delete(sessionId);
  }, 24 * 60 * 60 * 1000);
  
  return sessionId;
}

// Retrieve API key from session
export function getApiKeyFromSession(sessionId: string): string | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  
  // Update last accessed
  session.lastAccessed = Date.now();
  return session.apiKey;
}

// End session and remove API key from memory
export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

// Check if session exists
export function sessionExists(sessionId: string): boolean {
  return sessions.has(sessionId);
}
