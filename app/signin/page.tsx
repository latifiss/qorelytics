"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialButton from "@/components/ui/socialButton";
import { authClient } from "@/src/lib/auth/client";

const SignupPage = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioning = useRef(false);

  const stories = [
    {
      image:
        "/images/parta.jpg",
      alt: "Story 1",
    },
    {
      image:
        "/images/partb.jpg",
      alt: "Story 2",
    },
    {
      image:
        "/images/partc.jpg",
      alt: "Story 3",
    },
  ];

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          isTransitioning.current = true;

          setCurrentStory((prevStory) => {
            return (prevStory + 1) % stories.length;
          });

          return 0;
        }

        return prev + 0.5;
      });
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stories.length]);

  useEffect(() => {
    if (progress === 0 && isTransitioning.current) {
      isTransitioning.current = false;
    }
  }, [progress]);

  const handleNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    isTransitioning.current = false;
    setCurrentStory((prev) => (prev + 1) % stories.length);
    setProgress(0);
  };

  const handlePrevious = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    isTransitioning.current = false;
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
    setProgress(0);
  };

  const handleSocialLogin = async (
    provider: "google" | "facebook"
  ) => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/auth/success",
      });
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#171b1d]">
      {/* Left */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
        <div className="flex items-center mb-12">
          <div className="block dark:hidden">
            <Image
              src="/images/logo/logo-wordmark.svg"
              alt="Logo"
              width={160}
              height={40}
              className="w-40 h-10"
              priority
            />
          </div>
          <div className="hidden dark:block">
            <Image
              src="/images/logo/logo-wordmark-white.svg"
              alt="Logo"
              width={160}
              height={40}
              className="w-40 h-10"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 max-w-sm w-full">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Create your account
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-center">
            Sign up to get started with qorelytics and explore the world of data analytics with ease.
          </p>

          <div className="flex flex-col gap-3 w-full mt-6">
            <SocialButton
              type="google"
              onClick={() => handleSocialLogin("google")}
              className="w-full"
            />

            {/* <SocialButton
              type="facebook"
              onClick={() => handleSocialLogin("facebook")}
              className="w-full"
            /> */}
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-neutral-900 dark:text-white font-medium hover:underline"
            >
              Login instead
            </a>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 relative bg-black overflow-hidden hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory}
            initial={{
              opacity: 0,
              scale: 1.1,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              duration: 0.5,
            }}
            className="absolute inset-0"
          >
            <Image
              src={stories[currentStory].image}
              alt={stories[currentStory].alt}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/50" />

        <div className="absolute inset-0 flex z-10">
          <div
            className="flex-1 cursor-pointer"
            onClick={handlePrevious}
          />

          <div
            className="flex-1 cursor-pointer"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;