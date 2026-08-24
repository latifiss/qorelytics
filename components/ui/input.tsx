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
  disabled?: boolean;
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
  disabled = false,
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
    if (disabled) return;

    if (text.trim() || selectedFile) {
      onSubmit?.(text, selectedMode, selectedFile?.file);
      setText('');
      setSelectedFile(null);

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
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

  const getButtonBg = () => {
    if (isActive) {
      return 'bg-neutral-900 dark:bg-white hover:opacity-90';
    }
    return 'bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed';
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
        'w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-tab relative z-20',
        'bg-white dark:bg-[#22282b]',
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
            disabled={disabled}
            className={cn(
              'w-full resize-none bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
              'focus:outline-none font-text text-base leading-relaxed',
              'min-h-6 max-h-50',
              disabled && 'opacity-50 cursor-not-allowed'
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <div className="w-5 h-5 shrink">
                  <Image
                    src={selectedFile.icon}
                    alt={selectedFile.type}
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm text-neutral-900 dark:text-white font-medium">
                  {selectedFile.name}
                </span>
                <button
                  onClick={handleRemoveFile}
                  className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
                >
                  <CloseIcon size={16} className="text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Attach file"
            >
              <div className="block dark:hidden">
                <ScanIcon size={24} color="#525252" />
              </div>
              <div className="hidden dark:block">
                <ScanIcon size={24} color="#FFFFFF" />
              </div>
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
            disabled={!isActive || disabled}
            className={cn(
              'p-2 rounded-full transition-all duration-200',
              getButtonBg()
            )}
          >
            {/* Light mode */}
            <div className="block dark:hidden">
              <ArrowUpIcon 
                size={24} 
                color={isActive ? "#ffffff" : "#9fa5ba"}
              />
            </div>
            {/* Dark mode */}
            <div className="hidden dark:block">
              <ArrowUpIcon 
                size={24} 
                color={isActive ? "#000000" : "#62737b"}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  if (fixed) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#171b1d] border-t border-neutral-200 dark:border-neutral-800">
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