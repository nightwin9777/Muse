import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface ImageUploadProps {
  onImageSelect: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export function ImageUpload({ onImageSelect, isLoading }: ImageUploadProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onImageSelect(base64, file.type);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto"
    >
      <label 
        className={`
          relative flex flex-col items-center justify-center w-full h-64 
          border-2 border-dashed rounded-3xl cursor-pointer
          transition-all duration-500 group
          ${isLoading ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/10 hover:border-orange-500/30 hover:bg-white/5'}
          glass
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
              <p className="text-sm text-orange-200/60 font-serif italic">Whispering to the muses...</p>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-full bg-orange-500/10 mb-4 group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-8 h-8 text-orange-500" />
              </div>
              <p className="mb-2 text-xl font-serif text-white/90">Begin your journey</p>
              <p className="text-sm text-white/40 font-sans">Upload an image to inspire a story</p>
            </>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>
    </motion.div>
  );
}
