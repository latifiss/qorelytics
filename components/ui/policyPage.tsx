'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PolicySection {
  title: string;
  content: string;
}

interface PolicyData {
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
  footer: string;
}

interface PolicyPageProps {
  data: PolicyData;
}

const PolicyPage: React.FC<PolicyPageProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground">
            {data.title}
          </h1>
          <p className="text-muted text-lg">
            Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="w-16 h-1 bg-[#7FF86C] rounded-full" />
        </div>

        <div className="space-y-8">
          {data.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="space-y-2"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="text-base text-muted leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="pt-8 border-t border-subtle">
          <p className="text-sm text-muted">
            {data.footer}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PolicyPage;