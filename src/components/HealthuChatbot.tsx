import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { chatWithHealthu } from '../services/geminiService';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function HealthuChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm **Healthu**, your MedVault AI assistant. How can I help you with your health data or wellness today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await chatWithHealthu(userMessage, history);
    
    setMessages(prev => [...prev, { role: 'model', content: response || "I'm sorry, I couldn't process that." }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 z-50 hover:scale-110 active:scale-95 transition-all group"
      >
        <div className="absolute inset-0 rounded-full bg-blue-400/20 group-hover:scale-125 transition-transform animate-pulse"></div>
        <MessageSquare className="w-6 h-6 relative z-10" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[calc(100vw-48px)] md:w-96 h-[500px] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-zinc-950">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Healthu AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">Neural Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              {messages.map((m, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-3.5 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-zinc-800 text-zinc-300 border border-zinc-700/50 rounded-tl-none"
                  )}>
                    <div className="markdown-body">
                      <Markdown>{m.content}</Markdown>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-600 mt-1 uppercase font-mono tracking-widest">
                    {m.role === 'user' ? 'YOU' : 'HEALTHU'}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-zinc-600 font-mono text-[10px] uppercase tracking-widest mt-2 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Healthu is thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your health..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-zinc-700 font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
