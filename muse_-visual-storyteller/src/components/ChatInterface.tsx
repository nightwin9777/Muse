import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { chatWithGemini } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatInterfaceProps {
  context: string;
}

export function ChatInterface({ context }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await chatWithGemini(userMessage, context, history);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm lost in the story..." }]);
    } catch (error) {
      console.error("Chat failed:", error);
      setMessages(prev => [...prev, { role: 'model', text: "The connection to the muse was severed. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md glass rounded-[2.5rem] border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-white/5">
        <MessageSquare className="w-5 h-5 text-orange-500" />
        <h3 className="font-serif text-white/90">Story Assistant</h3>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Bot className="w-12 h-12 text-white/10 mb-4" />
            <p className="text-sm text-white/40 font-sans italic">
              Ask me anything about the world we've created. I can help you expand the lore or describe characters.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${m.role === 'user' ? 'bg-orange-500' : 'bg-white/10'}
            `}>
              {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-orange-500" />}
            </div>
            <div className={`
              max-w-[80%] p-4 rounded-2xl text-sm font-sans leading-relaxed
              ${m.role === 'user' ? 'bg-orange-500/20 text-white/90' : 'bg-white/5 text-white/70'}
            `}>
              <Markdown>{m.text}</Markdown>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-orange-500 animate-pulse" />
            </div>
            <div className="bg-white/5 p-4 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-orange-500/40 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-orange-500/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-orange-500/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 border-t border-white/5">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask the muse..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pr-12 text-sm font-sans text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:text-orange-400 disabled:opacity-30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
