'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { CloseIcon } from '@/public/icons/mono';
import Image from 'next/image';
import type { BillingTier } from '@/src/lib/billing/tierLimits';
import { getTierLimits } from '@/src/lib/billing/tierLimits';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: File, type: string) => void;
  tier?: BillingTier;
}

type FileType = 'pdf' | 'word' | 'csv' | 'json' | 'excel';

interface FileOption {
  id: FileType;
  label: string;
  icon: string;
  accept: string;
  extension: string;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  tier = 'free',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<FileType | null>(null);
  const limits = getTierLimits(tier);

  const fileOptions: FileOption[] = [
    {
      id: 'pdf',
      label: 'PDF File',
      icon: '/images/file-types/pdf.svg',
      accept: '.pdf,application/pdf',
      extension: 'pdf',
    },
    {
      id: 'word',
      label: 'Word File',
      icon: '/images/file-types/word.svg',
      accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: 'doc',
    },
    {
      id: 'csv',
      label: 'CSV File',
      icon: '/images/file-types/csv.svg',
      accept: '.csv,text/csv',
      extension: 'csv',
    },
    {
      id: 'json',
      label: 'JSON File',
      icon: '/images/file-types/json.svg',
      accept: '.json,application/json',
      extension: 'json',
    },
    {
      id: 'excel',
      label: 'Excel File',
      icon: '/images/file-types/excel.svg',
      accept: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: 'xlsx',
    },
  ];

  const isAllowed = (option: FileOption) =>
    limits.allowedExtensions.includes(option.extension);

  const handleFileSelect = (option: FileOption) => {
    if (!isAllowed(option)) {
      return;
    }

    setSelectedType(option.id);
    setIsLoading(true);

    if (fileInputRef.current) {
      fileInputRef.current.accept = option.accept;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && selectedType) {
      const option = fileOptions.find((item) => item.id === selectedType);

      if (option && isAllowed(option)) {
        onSelect(file, selectedType);
        setIsLoading(false);
        setSelectedType(null);
        onClose();
      }
    }

    event.target.value = '';
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const bottomSheetVariants = {
    hidden: { y: '100%' },
    visible: { y: 0 },
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
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'w-full bg-white dark:bg-[#22282b] rounded-none lg:rounded-3xl shadow-tab',
                isDesktop ? 'max-w-md' : 'max-w-full',
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-white tracking-wider">
                  Choose file type to upload
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <CloseIcon size={24} className="text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>

              <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                {fileOptions.map((option) => {
                  const allowed = isAllowed(option);

                  return (
                    <motion.button
                      key={option.id}
                      whileHover={allowed ? { scale: 1.02 } : undefined}
                      whileTap={allowed ? { scale: 0.98 } : undefined}
                      onClick={() => handleFileSelect(option)}
                      disabled={!allowed}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 h-13 rounded-lg border transition-colors duration-200',
                        allowed
                          ? 'bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                          : 'bg-neutral-50 border-neutral-100 opacity-50 cursor-not-allowed dark:bg-neutral-900/40 dark:border-neutral-800',
                      )}
                    >
                      <div className="w-6 h-6 shrink-0">
                        <Image
                          src={option.icon}
                          alt={option.label}
                          width={24}
                          height={24}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {option.label}
                      </span>
                      {!allowed && (
                        <span className="ml-auto text-[11px] font-medium text-neutral-400">
                          Upgrade
                        </span>
                      )}
                      {isLoading && selectedType === option.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="ml-auto"
                        >
                          <div className="w-4 h-4 border-2 border-neutral-300 dark:border-neutral-600 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                <p className="mb-2 text-center text-[11px] text-neutral-400">
                  {tier === 'free'
                    ? 'Free plan: CSV files up to 10MB · 10 uploads/month'
                    : `${tier === 'pro' ? 'Pro' : 'Team'} plan: files up to ${Math.round(limits.maxFileSizeBytes / (1024 * 1024))}MB`}
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
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
