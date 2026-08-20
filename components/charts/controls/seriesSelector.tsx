'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { SearchIcon } from '@/public/icons/mono';

interface SeriesSelectorProps {
  items: { key: string; label: string; color?: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function SeriesSelector({
  items,
  selected,
  onChange,
  className = '',
}: SeriesSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleItem = (key: string) => {
    const newSelected = selected.includes(key)
      ? selected.filter((s) => s !== key)
      : [...selected, key];
    onChange(newSelected);
  };

  const selectAll = () => {
    onChange(items.map((item) => item.key));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#171b1d] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
          />
        </div>
        <button
          onClick={selectAll}
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => toggleItem(item.key)}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200',
                selected.includes(item.key)
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              )}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color || '#7FF86C' }}
              />
              {item.label}
            </motion.button>
          ))}
        </AnimatePresence>
        {filteredItems.length === 0 && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 py-1">No items found</p>
        )}
      </div>
    </div>
  );
}