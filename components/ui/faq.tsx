'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { PlusIcon, CloseIcon } from '@/public/icons/mono';
import faqData from '@/data/faq.json';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  className?: string;
}

const Faq: React.FC<FaqProps> = ({ className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn('w-full px-6 pt-20 pb-17.5', className)}>
      <style jsx global>{`
        @keyframes rainbow-slide {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        .faq-rainbow-border {
          position: relative;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .faq-rainbow-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 16px;
          padding: 2px;
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
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: rainbow-slide 3s linear infinite;
          pointer-events: none;
        }
      `}</style>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Everything you need to know about Qorelytics. Can&apos;t find what you&apos;re looking for?{' '}
          <a href="/contact" className="text-neutral-900 dark:text-white underline hover:opacity-70 transition-opacity">
            Contact us
          </a>
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqData.map((item: FaqItem, index: number) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'rounded-2xl transition-colors duration-200',
                isOpen
                  ? 'faq-rainbow-border'
                  : 'border border-transparent'
              )}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-base font-medium text-neutral-900 dark:text-white pr-4">
                  {item.question}
                </span>
                <span className="shrink-0 ml-4">
                  {isOpen ? (
                    <div className="block dark:hidden">
                      <CloseIcon size={20} color="#000000" />
                    </div>
                  ) : (
                    <div className="block dark:hidden">
                      <PlusIcon size={20} color="#000000" />
                    </div>
                  )}
                  {isOpen ? (
                    <div className="hidden dark:block">
                      <CloseIcon size={20} color="#ffffff" />
                    </div>
                  ) : (
                    <div className="hidden dark:block">
                      <PlusIcon size={20} color="#ffffff" />
                    </div>
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.3, ease: 'easeInOut' },
                      opacity: { duration: 0.2, ease: 'easeInOut' },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0.5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Faq;