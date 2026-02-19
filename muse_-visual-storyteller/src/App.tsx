import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageUpload } from './components/ImageUpload';
import { StoryDisplay } from './components/StoryDisplay';
import { SocialPanel } from './components/SocialPanel';
import { ChatInterface } from './components/ChatInterface';
import { analyzeImageAndGenerateStory, StoryResponse } from './services/gemini';
import { Sparkles, RefreshCcw, BookOpen } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [storyData, setStoryData] = useState<StoryResponse | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = async (base64: string, mimeType: string) => {
    setIsLoading(true);
    setImagePreview(`data:${mimeType};base64,${base64}`);
    try {
      const result = await analyzeImageAndGenerateStory(base64, mimeType);
      setStoryData(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("The muse is silent. Please try another image.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStoryData(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-orange-500/30">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-white/90">Muse</h1>
        </div>
        
        {storyData && (
          <button 
            onClick={reset}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-sans font-bold uppercase tracking-widest text-white/60 hover:text-orange-500 transition-colors"
          >
            <RefreshCcw className="w-3 h-3" />
            New Story
          </button>
        )}
      </header>

      <main className="container mx-auto px-6 pt-32 pb-24">
        <AnimatePresence mode="wait">
          {!storyData ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="mb-12">
                <motion.div 
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="inline-block p-4 rounded-3xl bg-orange-500/10 mb-6"
                >
                  <Sparkles className="w-10 h-10 text-orange-500" />
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-serif font-light text-white mb-6 leading-tight">
                  Every image has a <br />
                  <span className="italic text-orange-500">hidden story.</span>
                </h2>
                <p className="text-lg text-white/40 max-w-lg mx-auto font-sans leading-relaxed">
                  Upload a photograph and let our AI muse weave a narrative from the shadows and light within.
                </p>
              </div>
              <ImageUpload onImageSelect={handleImageSelect} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div 
              key="story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              {/* Left Column: Image & Chat */}
              <div className="lg:col-span-4 space-y-8 sticky top-32">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                >
                  <img 
                    src={imagePreview || ''} 
                    alt="Inspiration" 
                    className="w-full aspect-[4/5] object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <ChatInterface context={storyData.openingParagraph} />
              </div>

              {/* Right Column: Story & Social */}
              <div className="lg:col-span-8 space-y-16">
                <StoryDisplay 
                  story={storyData.openingParagraph} 
                  mood={storyData.mood}
                  scene={storyData.sceneDescription}
                />
                <SocialPanel 
                  captions={storyData.captions}
                  music={storyData.musicRecommendations}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-sans">
          Powered by Gemini 3 Pro & Flash
        </p>
      </footer>
    </div>
  );
}
