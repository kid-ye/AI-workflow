import { useAgentStore } from '../store/agentStore';

export function Header() {
  const connected = useAgentStore((s) => s.connected);
  const sessionId = useAgentStore((s) => s.sessionId);
  const clearMessages = useAgentStore((s) => s.clearMessages);

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-7 10a1 1 0 0 1 1 1 6 6 0 0 0 12 0 1 1 0 1 1 2 0 8 8 0 0 1-7 7.93V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2.07A8 8 0 0 1 4 12a1 1 0 0 1 1-1z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">Voice AI Agent</h1>
          <p className="text-[10px] text-muted">
            {sessionId ? `Session: ${sessionId.slice(0, 8)}…` : 'Connecting...'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} ${connected ? 'animate-pulse' : ''}`} />
          <span className="text-muted">{connected ? 'Live' : 'Offline'}</span>
        </div>
        <button
          onClick={clearMessages}
          className="text-xs text-muted hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-card"
          title="Clear conversation"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
