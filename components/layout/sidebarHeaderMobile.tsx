'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themeContext';
import Logo from '@/public/icons/logo/logo';
import LogoWordmark from '@/public/icons/logo/logoWordmark';

const SidebarHeaderMobile = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      const sidebarContainer = document.querySelector('.sidebar-scroll-container');
      if (sidebarContainer) {
        const scrollPosition = sidebarContainer.scrollTop;
        setIsScrolled(scrollPosition > 20);
      }
    };

    const sidebarContainer = document.querySelector('.sidebar-scroll-container');
    if (sidebarContainer) {
      sidebarContainer.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (sidebarContainer) {
        sidebarContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <motion.div
      className="flex items-center px-0 pt-4 pb-0 bg-transparent"
      animate={{ 
        height: isScrolled ? '68px' : '78px',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex items-center justify-start">
        <AnimatePresence mode="wait">
          {isScrolled ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              <div className="block dark:hidden">
                <Logo size={45} color="#000000" />
              </div>
              <div className="hidden dark:block">
                <Logo size={45} color="#ffffff" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="wordmark"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              <div className="block dark:hidden">
                <LogoWordmark
                  width={160}
                  height={40}
                  color="#000000"
                  accentColor="#7FF86C"
                  className="w-40 h-10"
                />
              </div>
              <div className="hidden dark:block">
                <LogoWordmark
                  width={160}
                  height={40}
                  color="#ffffff"
                  accentColor="#7FF86C"
                  className="w-40 h-10"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SidebarHeaderMobile;