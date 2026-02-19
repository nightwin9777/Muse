import { Share2, Music, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface SocialPanelProps {
  captions: string[];
  music: string[];
}

export function SocialPanel({ captions, music }: SocialPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-8 rounded-[2rem] glass border-white/5"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-orange-500/10">
            <Share2 className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-lg font-serif text-white/90">Social Captions</h3>
        </div>
        <div className="space-y-4">
          {captions.map((caption, i) => (
            <div 
              key={i}
              className="group relative p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5"
            >
              <p className="text-sm text-white/70 font-sans pr-8">{caption}</p>
              <button 
                onClick={() => copyToClipboard(caption, i)}
                className="absolute right-4 top-4 text-white/20 hover:text-orange-500 transition-colors"
              >
                {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-8 rounded-[2rem] glass border-white/5"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-orange-500/10">
            <Music className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-lg font-serif text-white/90">Sonic Atmosphere</h3>
        </div>
        <div className="space-y-3">
          {music.map((track, i) => (
            <div 
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5"
            >
              <div className="w-2 h-2 rounded-full bg-orange-500/40" />
              <p className="text-sm text-white/70 font-sans">{track}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[10px] text-white/30 font-sans uppercase tracking-widest text-center">
          Search these to enhance your post
        </p>
      </motion.div>
    </div>
  );
}
