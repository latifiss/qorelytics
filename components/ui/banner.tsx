'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { CloseIcon } from '@/public/icons/mono';

type BannerVariant = 'investigate' | 'strategy' | 'analyze';

interface BannerProps {
  variant?: BannerVariant;
  title?: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

const bannerConfig = {
  investigate: {
    title: 'Investigate Mode',
    description:
      'Deep dive into your data with investigative analysis. Uncover patterns and insights.',
  },
  strategy: {
    title: 'Strategy Mode',
    description:
      'Plan your next moves with strategic insights. Get actionable recommendations.',
  },
  analyze: {
    title: 'Analyze Mode',
    description:
      'Comprehensive analysis of your data. Get detailed reports and visualizations.',
  },
};

const Banner: React.FC<BannerProps> = ({
  variant = 'analyze',
  title,
  description,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const config = bannerConfig[variant];

  return (
    <>
      <style jsx global>{`
        @keyframes rainbow-slide {
          0% {
            background-position: 0% 50%;
          }

          100% {
            background-position: 200% 50%;
          }
        }

        .banner-rainbow-text {
          background: linear-gradient(
            90deg,
            #ff4d4f,
            #ff7a45,
            #ffa940,
            #fadb14,
            #52c41a,
            #13c2c2,
            #1677ff,
            #722ed1,
            #eb2f96,
            #ff4d4f
          );

          background-size: 200% 100%;
          background-repeat: repeat;

          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;

          animation: rainbow-slide 3s linear infinite;
        }
      `}</style>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.3 }}
          className={cn(
  'relative w-full bg-transparent shadow-tab',
  'pb-4 pt-4 px-4',
  'border-t border-l border-r border-subtle',
  'rounded-t-2xl',
  'border-b-0',
  className
)}
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 rounded-full p-1 transition-colors hover:bg-fill-alpha-muted"
            aria-label="Close banner"
          >
            <CloseIcon size={16} color="var(--text-secondary)" />
          </button>

          <div className="pr-6">
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="banner-rainbow-text text-base font-display font-bold tracking-wide"
            >
              {title ?? config.title}
            </motion.h3>

            <p className="text-sm leading-relaxed text-muted pb-2.5">
              {description ?? config.description}
            </p>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 rounded-b-2xl bg-linear-to-t from-background to-transparent" />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Banner;