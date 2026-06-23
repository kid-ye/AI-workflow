import { useState, useRef } from 'react';
import { sendTextInput } from '../lib/wsClient';
import { useAgentStore } from '../store/agentStore';

export function TextInput() {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const connected = useAgentStore((s) => s.connected);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || !connected) return;
    sendTextInput(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex gap-2 px-4 pb-4">
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Type a message or use mic..."
        disabled={!connected}
        className="
          flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm
          text-white placeholder-muted outline-none
          focus:border-accent/60 focus:ring-1 focus:ring-accent/30
          disabled:opacity-40 transition-all
        "
      />
      <button
        onClick={submit}
        disabled={!text.trim() || !connected}
        className="
          px-4 py-2.5 bg-accent hover:bg-accent-glow rounded-xl text-sm font-medium
          disabled:opacity-40 disabled:cursor-not-allowed transition-all
          hover:glow-accent
        "
      >
        Send
      </button>
    </div>
  );
}
