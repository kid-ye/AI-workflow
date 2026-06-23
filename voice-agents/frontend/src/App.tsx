import { useEffect } from 'react';
import { connectWS } from './lib/wsClient';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { MicButton } from './components/MicButton';
import { TextInput } from './components/TextInput';
import { DebugPanel } from './components/DebugPanel';

export default function App() {
  useEffect(() => {
    connectWS();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg h-[90vh] max-h-[800px] flex flex-col glass rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <Header />

        {/* Chat messages */}
        <ChatWindow />

        {/* Mic button */}
        <div className="flex justify-center py-5 border-t border-border bg-panel/40">
          <MicButton />
        </div>

        {/* Text input */}
        <TextInput />

        {/* Debug panel */}
        <DebugPanel />
      </div>
    </div>
  );
}
