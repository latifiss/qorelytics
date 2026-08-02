'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { CloseIcon } from '@/public/icons/mono';
import Image from 'next/image';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: File, type: string) => void;
}

type FileType = 'pdf' | 'word' | 'csv' | 'json' | 'excel';

interface FileOption {
  id: FileType;
  label: string;
  icon: string;
  accept: string;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<FileType | null>(null);

  const fileOptions: FileOption[] = [
    {
      id: 'pdf',
      label: 'PDF File',
      icon: '/images/file-types/pdf.svg',
      accept: '.pdf,application/pdf',
    },
    {
      id: 'word',
      label: 'Word File',
      icon: '/images/file-types/word.svg',
      accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
      id: 'csv',
      label: 'CSV File',
      icon: '/images/file-types/csv.svg',
      accept: '.csv,text/csv',
    },
    {
      id: 'json',
      label: 'JSON File',
      icon: '/images/file-types/json.svg',
      accept: '.json,application/json',
    },
    {
      id: 'excel',
      label: 'Excel File',
      icon: '/images/file-types/excel.svg',
      accept: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  ];

  const handleFileSelect = (type: FileType) => {
    setSelectedType(type);
    setIsLoading(true);
    
    if (fileInputRef.current) {
      fileInputRef.current.accept = fileOptions.find(f => f.id === type)?.accept || '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedType) {
      onSelect(file, selectedType);
      setIsLoading(false);
      setSelectedType(null);
      onClose();
    }
    event.target.value = '';
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  const bottomSheetVariants = {
    hidden: { 
      y: '100%',
    },
    visible: { 
      y: 0,
    },
  };

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm lg:items-center lg:p-4"
            onClick={onClose}
          >
            <motion.div
              variants={isDesktop ? modalVariants : bottomSheetVariants}
              transition={{ 
                type: 'spring',
                damping: 30,
                stiffness: 300,
              }}
              className={cn(
                'w-full bg-surface-elevated rounded-none lg:rounded-3xl shadow-tab',
                isDesktop ? 'max-w-md' : 'max-w-full'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-subtle">
                <h3 className="text-xl font-display font-bold text-foreground tracking-wider">
                  Choose file type to upload
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-fill-alpha-subtle transition-colors"
                >
                  <CloseIcon size={24} color="var(--text-secondary)" />
                </button>
              </div>

              <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                {fileOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFileSelect(option.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 h-13 rounded-lg border transition-colors duration-200',
                      'bg-transparent text-muted border-subtle hover:text-foreground hover:border-border',
                      'dark:hover:text-white'
                    )}
                  >
                    <div className="w-6 h-6 shrink">
                      <Image
                        src={option.icon}
                        alt={option.label}
                        width={24}
                        height={24}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    {isLoading && selectedType === option.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-auto"
                      >
                        <div className="w-4 h-4 border-2 border-border border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="p-4 border-t border-subtle">
                <button
                  onClick={onClose}
                  className="w-full py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SelectionModal;