'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/themeContext';
import { Icon404 } from '@/public/icons/color';

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="shrink-0">
          <Icon404 
            size={228}
            accentColor={isDark ? '#ffffff' : '#1E1E1E'}
            className="sm:w-86.5 lg:w-120.75 h-auto"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="text-foreground text-2xl font-medium underline lowercase hover:opacity-70 transition-opacity relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-foreground after:scale-x-100 after:origin-left hover:after:scale-x-0 after:transition-transform after:duration-300"
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}