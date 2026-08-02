'use client';

import React from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CloseIcon } from '@/public/icons/mono'
import SidebarItemNew from './sidebarItemNew'
import SidebarItemAccordion from './sidebarItemAccordion'
import SidebarItemAuth from './sidebarItemAuth'
import SidebarItem from './sidebarItem'
import SidebarHeaderMobile from '../layout/sidebarHeaderMobile'
import PointIcon from '@/public/icons/mono/point'
import { useUser } from "@/hooks/use-user";

interface SidebarMobileProps {
  onClose: () => void
}

// Mock user data - replace with actual user data from your auth system
const user = {
  name: "John Doe",
  email: "john@example.com",
  tier: "pro" as "free" | "pro" | "team",
  avatar: "/images/default-avatar.svg"
}

const SidebarMobile = ({ onClose }: SidebarMobileProps) => {
  const pathname = usePathname()
  const { user, loading } = useUser();

if (loading) {
  return null;
}

  const isActive = (path: string) => {
    return pathname === path
  }

  // Auth paths
  const authPath = user ? "/profile" : "/signin";
const isAuthActive =
  pathname === authPath ||
  pathname === "/signin" ||
  pathname === "/profile";

  return (
    <div className='sidebar-scroll-container flex flex-col p-0 w-full h-full pb-3 bg-black overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none'>
      <div className='flex items-center justify-between px-4 pt-4 pb-2'>
        <SidebarHeaderMobile />
        <button 
          onClick={onClose}
          className='p-2 hover:opacity-80 transition-opacity mt-3'
        >
          <CloseIcon size={32} color='#ffffff' />
        </button>
      </div>
      <div className='flex flex-col gap-2 p-4'>
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
          <SidebarItemNew 
            label='New Chat' 
            href='/' 
            variant='internal' 
            type='mobile'
            className={isActive('/') ? 'pl-6' : ''}
          />
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
          <SidebarItemAccordion
            label="Chats"
            type="mobile"
            items={[
              { label: 'Product 1', href: '/product-1', variant: 'internal' },
              { label: 'Product 2', href: '/product-2', variant: 'external' },
              { label: 'Product 3', href: '/product-3', variant: 'internal' },
            ]}
            onToggle={(isOpen) => console.log('Accordion is', isOpen ? 'open' : 'closed')}
            className={isActive('/chats') ? 'pl-6' : ''}
          />
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
          <SidebarItem 
            label="Pricing" 
            href="/pricing" 
            variant="internal" 
            type="mobile"
            className={isActive('/pricing') ? 'pl-6' : ''}
          />
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
          <SidebarItem 
            label="Our Blog" 
            href="/blog" 
            variant="external" 
            type="mobile"
            className={isActive('/blog') ? 'pl-6' : ''}
          />
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
          <SidebarItem 
            label="About Us" 
            href="/about" 
            variant="external" 
            type="mobile"
            className={isActive('/about') ? 'pl-6' : ''}
          />
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
          <SidebarItemAuth
  label={user ? user.name : "Sign Up"}
  href={user ? "/profile" : "/signin"}
  variant="external"
  type="mobile"
  state={user ? "loggedin" : "loggedout"}
  userData={
    user
      ? {
          name: user.name,
          email: user.email,
          avatar: user.image ?? "/images/default-avatar.svg",
          tier: "free",
        }
      : undefined
  }
  className={isAuthActive ? "pl-6" : ""}
/>
        </div>
      </div>
    </div>
  )
}

export default SidebarMobile