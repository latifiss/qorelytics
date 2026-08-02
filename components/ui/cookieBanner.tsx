'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themeContext';
import CookieIcon from '@/public/icons/color/cookie';
import { cn } from '@/lib/cn';

interface CookieBannerProps {
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

const CookieBanner: React.FC<CookieBannerProps> = ({
  onAccept,
  onReject,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookies-accepted');
    const hasRejected = localStorage.getItem('cookies-rejected');
    
    if (!hasAccepted && !hasRejected) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setIsVisible(false);
    onAccept?.();
  };

  const handleReject = () => {
    localStorage.setItem('cookies-rejected', 'true');
    setIsVisible(false);
    onReject?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'fixed bottom-6 right-6 z-50 max-w-sm w-full',
            'rounded-2xl border border-subtle',
            'bg-surface-elevated shadow-tab',
            'p-6',
            className
          )}
        >
          <div className="flex flex-col items-center text-center">
            {/* Cookie Icon */}
            <div className="mb-4">
              <CookieIcon size={64} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2">
              We use cookies
            </h3>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed mb-5">
              We use cookies to enhance your experience, analyze site traffic, and personalize content. By clicking "Accept", you consent to our use of cookies.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleAccept}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200',
                  'bg-[#7FF86C] text-black hover:opacity-90',
                  'hover:scale-[1.02] active:scale-[0.98]'
                )}
              >
                Accept All
              </button>
              <button
                onClick={handleReject}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200',
                  'bg-transparent text-foreground border border-subtle',
                  'hover:bg-fill-alpha-subtle hover:scale-[1.02] active:scale-[0.98]'
                )}
              >
                Reject
              </button>
            </div>

            {/* Privacy link */}
            <p className="text-xs text-muted mt-4">
              By accepting, you agree to our{' '}
              <a href="/privacy" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;