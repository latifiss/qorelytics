'use client';

import { ArrowTopRightIcon, HamburgerMenuIcon, PlusIcon } from '@/public/icons/mono';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themeContext';
import SidebarMobile from '@/components/ui/sidebarMobile';
import Logo from '@/public/icons/logo/logo';
import LogoWordmark from '@/public/icons/logo/logoWordmark';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.main-scroll-container');
      if (scrollContainer) {
        const scrollPosition = scrollContainer.scrollTop;
        setIsScrolled(scrollPosition > 20);
      }
    };

    const scrollContainer = document.querySelector('.main-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <motion.div
        className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#171b1d] h-19.5 sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800"
        animate={{ 
          height: isScrolled ? '68px' : '78px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="lg:hidden cursor-pointer" onClick={toggleSidebar}>
          <div className="block dark:hidden">
            <HamburgerMenuIcon size={32} color="#000000" />
          </div>
          <div className="hidden dark:block">
            <HamburgerMenuIcon size={32} color="#ffffff" />
          </div>
        </div>
        
        <div className="flex-1 lg:flex-none flex justify-center lg:justify-start relative">
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {isScrolled ? (
                <motion.div
                  key="icon-mobile"
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
                  key="wordmark-mobile"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
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
          
          <div className="hidden lg:block">
            <div className="block dark:hidden">
              <LogoWordmark
                width={170}
                height={50}
                color="#000000"
                accentColor="#7FF86C"
                className="lg:w-42.5 lg:h-12.5"
              />
            </div>
            <div className="hidden dark:block">
              <LogoWordmark
                width={170}
                height={50}
                color="#ffffff"
                accentColor="#7FF86C"
                className="lg:w-42.5 lg:h-12.5"
              />
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center justify-end gap-0.5">
          <p className="text-xl text-black dark:text-white">Sign In</p>
          <div className="block dark:hidden">
            <ArrowTopRightIcon size={24} color="#000000" />
          </div>
          <div className="hidden dark:block">
            <ArrowTopRightIcon size={24} color="#ffffff" />
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-0.5">
          <p className="text-xl hidden">New</p>
          <div className="block dark:hidden">
            <PlusIcon size={32} color="#000000" />
          </div>
          <div className="hidden dark:block">
            <PlusIcon size={32} color="#ffffff" />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 lg:hidden"
              onClick={toggleSidebar}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full bg-white dark:bg-[#171b1d] z-50 lg:hidden"
            >
              <SidebarMobile onClose={toggleSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;