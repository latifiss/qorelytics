'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { InvestigateIcon, StrategyIcon, AnalyzeIcon } from '@/public/icons/mono';

type ModeType = 'investigate' | 'strategy' | 'analyze';

interface ModeButtonProps {
  mode: ModeType;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const ModeButton: React.FC<ModeButtonProps> = ({
  mode,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const getIcon = () => {
    switch (mode) {
      case 'investigate':
        return <InvestigateIcon size={24} />;
      case 'strategy':
        return <StrategyIcon size={24} />;
      case 'analyze':
        return <AnalyzeIcon size={24} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'investigate':
        return 'Investigate';
      case 'strategy':
        return 'Strategy';
      case 'analyze':
        return 'Analyze';
      default:
        return '';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-2 h-10.5 rounded-full border text-sm font-medium transition-colors duration-200',
        isSelected
          ? 'bg-transparent text-black border border-subtle shadow-none dark:bg-black dark:text-white dark:border-0 dark:shadow-none'
          : 'bg-transparent text-muted border-subtle hover:text-foreground hover:border-border dark:hover:text-white',
        className
      )}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </motion.button>
  );
};

export default ModeButton;