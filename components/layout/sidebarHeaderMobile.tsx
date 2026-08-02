'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themeContext';

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

  const getLogoIcon = () => {
    return isDark ? '/images/logo/logo-icon-white.svg' : '/images/logo/logo-icon-white.svg';
  };

  const getLogoWordmark = () => {
    return isDark ? '/images/logo/logo-wordmark-white.svg' : '/images/logo/logo-wordmark-white.svg';
  };

  return (
    <motion.div
      className="flex items-center px-0 pt-4 pb-0 bg-transparent sticky top-0 z-50"
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
              <Image
                src={getLogoIcon()}
                alt="Logo Icon"
                width={45}
                height={45}
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="wordmark"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Image
                src={getLogoWordmark()}
                alt="Logo"
                width={160}
                height={40}
                className="w-40 h-10"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SidebarHeaderMobile;