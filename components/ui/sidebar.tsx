'use client';

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import SidebarItemNew from './sidebarItemNew'
import SidebarItemAccordion from './sidebarItemAccordion'
import SidebarItemAuth from './sidebarItemAuth'
import SidebarItem from './sidebarItem'
import SidebarHeader from '../layout/sidebarHeader'
import PointIcon from '@/public/icons/mono/point'
import Command from '@/components/ui/command'
import { useUser } from "@/hooks/use-user";

const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useUser();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            router.push('/');
            break;
          case 'p':
            e.preventDefault();
            router.push('/pricing');
            break;
          case 'b':
            e.preventDefault();
            router.push('/blog');
            break;
          case 'a':
            e.preventDefault();
            router.push('/about');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  if (loading) {
    return (
      <div className="w-80 h-full bg-white dark:bg-[#171b1d]">
      </div>
    );
  }
  
  const isActive = (path: string) => {
    return pathname === path
  }
  
  const authPath = user ? "/profile" : "/signin";
  const isAuthActive =
    pathname === authPath ||
    pathname === "/signin" ||
    pathname === "/profile";

  const getUserAvatar = () => {
    if (!user) return "/images/default-avatar.svg";
    
    return user.image 
      || user.avatar 
      || user.photoURL 
      || user.profileImage 
      || user.picture
      || "/images/default-avatar.svg";
  };

  return (
    <div className='sidebar-scroll-container flex flex-col p-0 w-80 h-full pb-3 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 hover:scrollbar-thumb-neutral-500 dark:hover:scrollbar-thumb-neutral-500 bg-white dark:bg-[#171b1d]'>
      <SidebarHeader />
      <div className='flex flex-col gap-2 p-4 pr-1'>
        <div className="relative">
          <AnimatePresence>
            {isActive('/') && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              >
                <PointIcon size={16} color="#7FF86C" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between w-full">
            <SidebarItemNew 
              label='New Chat' 
              href='/' 
              variant='internal' 
              type='desktop'
              className={isActive('/') ? 'pl-6' : ''}
            />
            <Command label="Ctrl+N" className="shrink-0 ml-2" />
          </div>
        </div>

        <div className="relative">
          <AnimatePresence>
            {isActive('/chats') && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              >
                <PointIcon size={16} color="#7FF86C" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between w-full">
            <SidebarItemAccordion
              label="Chats"
              type="desktop"
              items={[
                { label: 'Product 1', href: '/product-1', variant: 'internal' },
                { label: 'Product 2', href: '/product-2', variant: 'external' },
                { label: 'Product 3', href: '/product-3', variant: 'internal' },
              ]}
              onToggle={(isOpen) => console.log('Accordion is', isOpen ? 'open' : 'closed')}
              className={isActive('/chats') ? 'pl-6' : ''}
            />
          </div>
        </div>

        <div className="relative">
          <AnimatePresence>
            {isActive('/pricing') && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              >
                <PointIcon size={16} color="#7FF86C" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between w-full">
            <SidebarItem 
              label="Pricing" 
              href="/pricing" 
              variant="internal" 
              type="desktop"
              className={isActive('/pricing') ? 'pl-6' : ''}
            />
            <Command label="Ctrl+P" className="shrink-0 ml-2" />
          </div>
        </div>

        <div className="relative">
          <AnimatePresence>
            {isActive('/blog') && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              >
                <PointIcon size={16} color="#7FF86C" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between w-full">
            <SidebarItem 
              label="Our Blog" 
              href="/blog" 
              variant="external" 
              type="desktop"
              className={isActive('/blog') ? 'pl-6' : ''}
            />
            <Command label="Ctrl+B" className="shrink-0 ml-2" />
          </div>
        </div>

        <div className="relative">
          <AnimatePresence>
            {isActive('/about') && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              >
                <PointIcon size={16} color="#7FF86C" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between w-full">
            <SidebarItem 
              label="About Us" 
              href="/about" 
              variant="external" 
              type="desktop"
              className={isActive('/about') ? 'pl-6' : ''}
            />
            <Command label="Ctrl+A" className="shrink-0 ml-2" />
          </div>
        </div>

        <div className="relative">
          <AnimatePresence>
            {isAuthActive && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              >
                <PointIcon size={16} color="#7FF86C" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between w-full">
            <SidebarItemAuth 
              label={user ? user.name : "Sign Up"} 
              href={user ? "/profile" : "/signin"} 
              variant="external" 
              type="desktop"
              state={user ? "loggedin" : "loggedout"}
              userData={
                user
                  ? {
                      name: user.name,
                      email: user.email,
                      tier: "free",
                      avatar: getUserAvatar(),
                    }
                  : undefined
              }
              className={isAuthActive ? 'pl-6' : ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar