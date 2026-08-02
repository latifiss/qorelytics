'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useTheme } from '@/context/themeContext';
import BarOption from '@/components/ui/barOption';
import Button from '@/components/ui/button';
import {
  reasons,
  roles,
  industries,
  tools,
  referralSources,
  steps,
} from '@/data/onboarding';

interface OnboardingProps {
  onComplete?: (data: OnboardingData) => void;
}

interface OnboardingData {
  reasons?: string[];
  role?: string;
  industry?: string;
  tools?: string[];
  referral?: string;
  [key: string]: unknown;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalSteps = steps.length;

  const renderStepComponent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {reasons.map((reason) => (
              <BarOption
                key={reason}
                label={reason}
                variant="default"
                selected={(formData.reasons || []).includes(reason)}
                onClick={() => {
                  const selected = formData.reasons || [];
                  if (selected.includes(reason)) {
                    setFormData({
                      ...formData,
                      reasons: selected.filter((r: string) => r !== reason),
                    });
                  } else {
                    setFormData({ ...formData, reasons: [...selected, reason] });
                  }
                }}
              />
            ))}
          </div>
        );
      case 1:
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {roles.map((role) => (
              <BarOption
                key={role}
                label={role}
                variant="default"
                selected={formData.role === role}
                onClick={() => setFormData({ ...formData, role })}
              />
            ))}
          </div>
        );
      case 2:
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {industries.map((industry) => (
              <BarOption
                key={industry.label}
                label={industry.label}
                icon={industry.icon}
                variant="flat"
                selected={formData.industry === industry.label}
                onClick={() => setFormData({ ...formData, industry: industry.label })}
              />
            ))}
          </div>
        );
      case 3:
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {tools.map((tool) => (
              <BarOption
                key={tool.label}
                label={tool.label}
                icon={tool.icon}
                variant="flat"
                selected={(formData.tools || []).includes(tool.label)}
                onClick={() => {
                  const selected = formData.tools || [];
                  if (selected.includes(tool.label)) {
                    setFormData({
                      ...formData,
                      tools: selected.filter((t: string) => t !== tool.label),
                    });
                  } else {
                    setFormData({ ...formData, tools: [...selected, tool.label] });
                  }
                }}
              />
            ))}
          </div>
        );
      case 4:
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {referralSources.map((source) => (
              <BarOption
                key={source.label}
                label={source.label}
                icon={source.icon}
                iconSize={32}
                variant="grid"
                selected={formData.referral === source.label}
                onClick={() => setFormData({ ...formData, referral: source.label })}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

 const handleNext = async () => {

  if (currentStep < totalSteps - 1) {

    setCurrentStep(currentStep + 1);

  } else {

    setIsLoading(true);


    await fetch("/api/onboarding", {

      method:"POST",

      headers:{
        "Content-Type":"application/json",
      },

      body:JSON.stringify(formData),

    });


    setIsLoading(false);


    window.location.href="/";

  }

};

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {


  await fetch("/api/onboarding", {

    method:"POST",

    headers:{
      "Content-Type":"application/json",
    },

    body:JSON.stringify({
      skipped:true,
    }),

  });


  window.location.href="/";


};

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="h-full lg:h-[calc(100vh-78px)] flex items-start justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl h-full lg:h-auto flex flex-col justify-center"
      >
        <div className="h-1 bg-gray-100 shrink-0">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45 }}
          />
        </div>

        <div className="flex-1 lg:flex-none overflow-y-auto lg:overflow-visible p-6 lg:p-10 flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="space-y-2 mb-5 text-center"
              >
                <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                  {steps[currentStep].title}
                </h2>
                <p className="text-sm text-muted max-w-xl mx-auto">
                  {steps[currentStep].description}
                </p>

                <div className="mt-4 lg:mt-6">
                  {renderStepComponent(currentStep)}
                </div>

                <div className="mt-6 lg:mt-8 flex flex-col items-center gap-3">
                  <Button
                    onClick={handleNext}
                    loading={isLoading}
                    disabled={isLoading}
                    size="md"
                  >
                    {currentStep === totalSteps - 1 ? 'Get Started' : 'Continue'}
                  </Button>
                  {steps[currentStep].skipable !== false && currentStep < totalSteps - 1 && (
                    <Button
                      onClick={handleSkip}
                      variant="skip"
                      size="sm"
                    >
                      Skip
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;