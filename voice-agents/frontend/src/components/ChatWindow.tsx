import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '../store/agentStore';

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function ChatWindow() {
  const messages = useAgentStore((s) => s.messages);
  const partialTranscript = useAgentStore((s) => s.partialTranscript);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partialTranscript]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-accent text-white rounded-br-sm'
                  : 'glass text-slate-200 rounded-bl-sm'
                }
              `}
            >
              {/* Source label — shows exactly which API produced this text */}
              <div className="flex items-center gap-1.5 mb-1.5">
                {msg.role === 'user' ? (
                  <>
                    <span className="text-[10px] font-medium text-white/70">You</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/15 text-white/60">
                      via Whisper
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 rounded-full bg-accent/80 flex items-center justify-center">
                      <span className="text-[8px] font-bold">AI</span>
                    </div>
                    <span className="text-[10px] text-muted">Assistant</span>
                    {!msg.isStreaming && msg.text && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent-glow">
                        via Sarvam
                      </span>
                    )}
                    {msg.isStreaming && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 animate-pulse">
                        speaking...
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Message text — streams in real time as LLM emits tokens */}
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Streaming cursor */}
              {msg.isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-accent-glow ml-0.5 animate-pulse rounded-sm" />
              )}

              <p className="text-[10px] text-white/30 mt-1.5 text-right">{formatTime(msg.timestamp)}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ghost bubble — shows "Listening..." while Whisper is buffering audio */}
      {partialTranscript && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex justify-end"
        >
          <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-br-sm bg-accent/20 border border-accent/30 text-sm text-slate-400 italic">
            <span className="text-[9px] text-accent/60 block mb-1">buffering mic...</span>
            {partialTranscript}
            <span className="inline-block w-1 h-3 bg-accent ml-1 animate-pulse rounded-sm" />
          </div>
        </motion.div>
      )}

      {messages.length === 0 && !partialTranscript && (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
          <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-muted text-sm">Press the mic and start speaking</p>
          <p className="text-muted/60 text-xs">Whisper STT → Rule engine → Sarvam TTS</p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
