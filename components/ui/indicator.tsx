'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SigIcon } from '@/public/icons/color';

interface IndicatorProps {
  size?: number;
  className?: string;
}

const Indicator: React.FC<IndicatorProps> = ({ 
  size = 32, 
  className = '' 
}) => {
  const greenColors = [
    '#7FF86C', 
    '#5CE04A', 
    '#3DB82F',
    '#2A8F1E',
    '#3DB82F', 
    '#5CE04A', 
    '#7FF86C', 
  ];

  const [colorIndex, setColorIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % greenColors.length);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className} style={{ display: 'inline-block' }}>
      <motion.div
        animate={{
          rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ 
          display: 'inline-block',
          transformOrigin: 'center center',
        }}
      >
        <SigIcon size={size} color={greenColors[colorIndex]} />
      </motion.div>
    </div>
  );
};

export default Indicator;