import { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { generateSpeech } from '../services/gemini';

interface StoryDisplayProps {
  story: string;
  mood: string;
  scene: string;
}

export function StoryDisplay({ story, mood, scene }: StoryDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const handlePlayAudio = async () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    try {
      setIsGeneratingAudio(true);
      const base64 = await generateSpeech(story);
      const newAudio = new Audio(`data:audio/mp3;base64,${base64}`);
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio generation failed:", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-sans font-bold mb-1">Atmosphere</span>
          <h2 className="text-2xl font-serif italic text-white/90 capitalize">{mood}</h2>
        </div>
        <button
          onClick={handlePlayAudio}
          disabled={isGeneratingAudio}
          className={`
            flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500
            ${isPlaying ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}
            ${isGeneratingAudio ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            glass
          `}
        >
          {isGeneratingAudio ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : isPlaying ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <span className="text-sm font-sans font-medium">
            {isGeneratingAudio ? 'Preparing Voice...' : isPlaying ? 'Stop Narration' : 'Read Aloud'}
          </span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-orange-500/50 via-transparent to-transparent" />
        <div className="markdown-body font-serif text-xl md:text-2xl leading-relaxed text-white/80 italic selection:bg-orange-500/30">
          <Markdown>{story}</Markdown>
        </div>
      </div>

      <div className="p-6 rounded-3xl glass border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-orange-500/60" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans font-bold">Scene Context</span>
        </div>
        <p className="text-sm text-white/60 font-sans leading-relaxed">
          {scene}
        </p>
      </div>
    </motion.div>
  );
}
