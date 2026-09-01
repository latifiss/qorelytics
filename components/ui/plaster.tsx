'use client';

import Image from 'next/image';
import { useTheme } from '@/context/themeContext';
import { cn } from '@/lib/cn';

interface PlasterProps {
  className?: string;
}

const Plaster: React.FC<PlasterProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const imageSrc = isDark
    ? '/images/apple-demo-dark.svg'
    : '/images/apple-demo.svg';

  return (
    <div className={cn(
      'w-full px-6 pt-20 pb-17.5',
      'max-sm:px-4 sm:pt-50.25 max-sm:pt-50.25 max-sm:pb-7.5',
      className
    )}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 max-sm:mb-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 dark:text-white mb-3 max-sm:text-3xl">
            Upload <span className="text-[#7FF86C]">.</span> Ask{' '}
            <span className="text-[#7FF86C]">.</span> Generate
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto max-sm:text-base">
            Upload your data, ask questions, and let AI generate insights instantly
          </p>
        </div>

        <div className="relative w-full">
          <Image
            src={imageSrc}
            alt="Qorelytics AI Data Analyst Dashboard"
            width={1200}
            height={675}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Plaster;