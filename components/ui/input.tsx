'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { ScanIcon, CloseIcon, ArrowUpIcon } from '@/public/icons/mono';
import ModeButton from './modeButton';
import SelectionModal from './selectionModal';
import Banner from './banner';
import Image from 'next/image';
import { useTheme } from '@/context/themeContext';

interface InputProps {
  onSubmit?: (text: string, mode: string, file?: File) => void;
  className?: string;
  placeholder?: string;
  fixed?: boolean;
}

interface SelectedFile {
  file: File;
  type: string;
  name: string;
  icon: string;
}

const Input: React.FC<InputProps> = ({
  onSubmit,
  className = '',
  placeholder = 'Ask anything...',
  fixed = false,
}) => {
  const [text, setText] = useState('');
  const [selectedMode, setSelectedMode] = useState<'investigate' | 'strategy' | 'analyze'>('analyze');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fileTypeIcons: Record<string, string> = {
    pdf: '/images/file-types/pdf.svg',
    word: '/images/file-types/word.svg',
    csv: '/images/file-types/csv.svg',
    json: '/images/file-types/json.svg',
    excel: '/images/file-types/excel.svg',
  };

  const handleFileSelect = (file: File, type: string) => {
    const icon = fileTypeIcons[type] || '/images/file-icons/default.svg';
    setSelectedFile({
      file,
      type,
      name: file.name,
      icon,
    });
    setIsModalOpen(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = () => {
    if (text.trim() || selectedFile) {
      onSubmit?.(text, selectedMode, selectedFile?.file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    autoResize();
  };

  const handleModeChange = (mode: 'investigate' | 'strategy' | 'analyze') => {
    setSelectedMode(mode);
    setShowBanner(true);
  };

  const isActive = text.trim() || selectedFile;

  const getArrowColor = () => {
    if (isActive) {
      return isDark ? '#ffffff' : '#000000';
    }
    return isDark ? '#62737b' : '#9fa5ba';
  };

  const getButtonBg = () => {
    if (isActive) {
      return 'bg-foreground hover:opacity-90';
    }
    return 'bg-fill-muted cursor-not-allowed';
  };

  const inputContent = (
    <div className="relative">
      <Banner
        variant={selectedMode}
        className={cn(
          '-mb-5 relative z-10',
          !showBanner && 'hidden'
        )}
        onClose={() => setShowBanner(false)}
      />
      <div className={cn(
  'w-full rounded-2xl border border-subtle shadow-tab relative z-20',
  'bg-surface-muted-mobile',
  className
)}>
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className={cn(
              'w-full resize-none bg-transparent text-foreground placeholder:text-muted',
              'focus:outline-none font-text text-base leading-relaxed',
              'min-h-6 max-h-50'
            )}
            style={{ height: 'auto' }}
          />
        </div>

        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 pb-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fill-alpha-subtle border border-subtle">
                <div className="w-5 h-5 shrink">
                  <Image
                    src={selectedFile.icon}
                    alt={selectedFile.type}
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm text-foreground font-medium">
                  {selectedFile.name}
                </span>
                <button
                  onClick={handleRemoveFile}
                  className="p-0.5 hover:bg-fill-alpha-muted rounded-full transition-colors"
                >
                  <CloseIcon size={16} color="var(--text-secondary)" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between px-3 py-2 border-t border-subtle">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full hover:bg-fill-alpha-subtle transition-colors"
              aria-label="Attach file"
            >
              <ScanIcon size={24} color="var(--text-secondary)" />
            </button>

            <div className="flex items-center gap-1">
              <ModeButton
                mode="investigate"
                isSelected={selectedMode === 'investigate'}
                onClick={() => handleModeChange('investigate')}
                className="h-8 px-3 text-xs"
              />
              <ModeButton
                mode="strategy"
                isSelected={selectedMode === 'strategy'}
                onClick={() => handleModeChange('strategy')}
                className="h-8 px-3 text-xs"
              />
              <ModeButton
                mode="analyze"
                isSelected={selectedMode === 'analyze'}
                onClick={() => handleModeChange('analyze')}
                className="h-8 px-3 text-xs"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isActive}
            className={cn(
              'p-2 rounded-full transition-all duration-200',
              getButtonBg()
            )}
          >
            <ArrowUpIcon 
              size={24} 
              color={getArrowColor()}
            />
          </button>
        </div>
      </div>
    </div>
  );

  // In the Input component, update the fixed return:
if (fixed) {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background">
        <div className="max-w-2xl mx-auto px-4 mb-0">
          {inputContent}
        </div>
      </div>
      <SelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleFileSelect}
      />
    </>
  );
}

  return (
    <>
      {inputContent}
      <SelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleFileSelect}
      />
    </>
  );
};

export default Input;