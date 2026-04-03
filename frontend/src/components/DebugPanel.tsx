import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '../store/agentStore';

const TYPE_COLORS: Record<string, string> = {
  stt_partial: 'text-green-400',
  stt_final: 'text-emerald-300 font-medium',
  llm_token: 'text-blue-400',
  llm_sentence: 'text-indigo-300 font-medium',
  tts_chunk: 'text-purple-400',
  tts_done: 'text-purple-300',
  tool_call: 'text-yellow-400 font-medium',
  status: 'text-slate-400',
  ws: 'text-cyan-400',
  error: 'text-red-400',
};

export function DebugPanel() {
  const debugLog = useAgentStore((s) => s.debugLog);
  const showDebug = useAgentStore((s) => s.showDebug);
  const toggleDebug = useAgentStore((s) => s.toggleDebug);

  return (
    <div className="border-t border-border">
      <button
        onClick={toggleDebug}
        className="w-full flex items-center justify-between px-4 py-2 text-xs text-muted hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Debug Panel
        </span>
        <span>{showDebug ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {showDebug && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 200, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="h-[200px] overflow-y-auto px-4 py-2 space-y-0.5 font-mono text-[11px] bg-black/30">
              {debugLog.length === 0 && (
                <p className="text-muted">No events yet...</p>
              )}
              {debugLog.map((entry, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-muted/50 shrink-0 w-16 text-right">
                    {new Date(entry.ts).toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className={`shrink-0 w-24 ${TYPE_COLORS[entry.type] || 'text-slate-400'}`}>
                    [{entry.type}]
                  </span>
                  <span className="text-slate-300 break-all">{entry.content}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
