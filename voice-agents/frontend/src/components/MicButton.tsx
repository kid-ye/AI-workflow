import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '../store/agentStore';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { sendInterrupt } from '../lib/wsClient';

const STATUS_CONFIG = {
  idle:        { label: 'Idle',          color: 'bg-muted' },
  listening:   { label: 'Listening...',  color: 'bg-green-500' },
  processing:  { label: 'Processing...', color: 'bg-yellow-500' },
  speaking:    { label: 'Speaking',      color: 'bg-accent' },
  interrupted: { label: 'Interrupted',   color: 'bg-red-500' },
};

// SVG arc for silence countdown ring
function SilenceRing({ progress }: { progress: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;
  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="3" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke="rgb(99,102,241)" strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicButton() {
  const { isListening, isSpeaking, volume, silenceMs, silenceThreshold, calibrating, handleMicClick } = useVoiceRecorder();
  const agentStatus = useAgentStore((s) => s.status);
  const cfg = STATUS_CONFIG[agentStatus] || STATUS_CONFIG.idle;

  const agentSpeaking = agentStatus === 'speaking';
  // Silence ring progress: fills as silence accumulates, resets when speech resumes
  const silenceProgress = isSpeaking && !agentSpeaking && silenceMs > 0
    ? Math.min(silenceMs / silenceThreshold, 1)
    : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Status badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full glass text-sm">
        <span className={`w-2 h-2 rounded-full ${cfg.color} ${isListening || agentSpeaking ? 'animate-pulse' : ''}`} />
        <span className="text-slate-300">
          {calibrating ? 'Calibrating mic...' : agentSpeaking ? 'Speaking — tap to interrupt' : isSpeaking ? 'Listening...' : isListening ? 'Waiting for speech...' : cfg.label}
        </span>
      </div>

      {/* Button + rings */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Silence countdown arc */}
        {silenceProgress > 0 && (
          <div className="absolute inset-0">
            <SilenceRing progress={silenceProgress} />
          </div>
        )}

        {/* Waveform rings when speaking */}
        <AnimatePresence>
          {(isSpeaking || agentSpeaking) && (
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-full border ${agentSpeaking ? 'border-accent/40' : 'border-green-500/40'}`}
                  initial={{ width: 80, height: 80, opacity: 0.8 }}
                  animate={{
                    width: 80 + i * 24 * (isSpeaking ? Math.max(volume, 0.3) : 0.5),
                    height: 80 + i * 24 * (isSpeaking ? Math.max(volume, 0.3) : 0.5),
                    opacity: 0,
                  }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.25, ease: 'easeOut' }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          onClick={handleMicClick}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          className={`
            relative z-10 w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-300 cursor-pointer select-none
            ${agentSpeaking
              ? 'bg-accent ring-4 ring-accent/30 glow-accent'
              : isSpeaking
              ? 'bg-green-500 ring-4 ring-green-500/30'
              : isListening
              ? 'bg-card ring-2 ring-green-500/50 animate-pulse'
              : 'bg-card ring-2 ring-border hover:ring-accent/50'
            }
          `}
          title={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            // Stop icon — always shows when mic is active (whether agent speaking or not)
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            // Mic icon — green when active
            <svg className={`w-8 h-8 ${isListening ? 'text-green-300' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-7 8a1 1 0 0 1 1 1 6 6 0 0 0 12 0 1 1 0 1 1 2 0 8 8 0 0 1-7 7.93V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2.07A8 8 0 0 1 4 12a1 1 0 0 1 1-1z" />
            </svg>
          )}
        </motion.button>
      </div>

      <p className="text-xs text-muted text-center">
        {isListening
          ? agentSpeaking ? 'Just speak to interrupt' : 'Speak now — tap to stop mic'
          : 'Tap mic to start'}
      </p>
    </div>
  );
}
