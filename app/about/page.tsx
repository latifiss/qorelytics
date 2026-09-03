"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import GlobeWrapper from "@/components/ui/globeWrapper";
import RotatingText from "@/components/ui/rotatingText";
import LogoWordmark from "@/public/icons/logo/logoWordmark";
import { useUser } from "@/hooks/use-user";
import Faq from "@/components/ui/faq";
import Plaster from "@/components/ui/plaster";

const stats = [
  { value: "10M+", label: "Rows Analyzed" },
  { value: "50K+", label: "Reports Generated" },
  { value: "99%", label: "Insight Accuracy" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function IntroPage() {
  const { user, loading } = useUser();
  const [, setGlobeReady] = useState(false);

  const getStartedHref = loading ? "#" : user ? "/dashboard" : "/signin";

  return (
    <main className="min-h-screen overflow-hidden md:overflow-hidden bg-white text-neutral-900 dark:bg-black dark:text-white">
      <section className="relative min-h-screen lg:h-screen overflow-visible">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-neutral-100/50 to-white dark:via-black/40 dark:to-black" />

        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <div className="absolute top-[-50%] right-[-50%] w-[120%] h-[200%] lg:block hidden">
            <GlobeWrapper onReady={() => setGlobeReady(true)} />
          </div>

          <div className="absolute top-[-10%] right-[-35%] w-[90%] h-[120%] hidden md:block lg:hidden">
            <GlobeWrapper onReady={() => setGlobeReady(true)} />
          </div>

          <div className="absolute top-[35%] right-[-45%] w-[180%] h-full block md:hidden">
            <GlobeWrapper onReady={() => setGlobeReady(true)} />
          </div>
        </div>

        <div className="relative z-10 container mx-auto h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full w-full">
            <motion.div
              initial="visible"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6 col-span-1 p-10 md:p-8 sm:p-6 max-sm:px-5 max-sm:pt-5"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="block dark:hidden">
                  <LogoWordmark size={160} accentColor="#7FF86C" />
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
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400"
              >
                AI Powered Data Analytics Platform
              </motion.p>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] -mt-0.5 -mb-3"
              >
                The AI data analyst for
                <br />
                <RotatingText />
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-snug -mb-1 mt-6 sm:mt-2"
              >
                Upload your business data and let AI analyze trends, generate insights, create dashboards, and answer complex questions in seconds.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link
                  href={getStartedHref}
                  aria-disabled={loading}
                  className={`group px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg ${loading ? "pointer-events-none opacity-70" : ""}`}
                >
                  Get Started
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/pricing"
                  className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all hover:scale-105"
                >
                  Pricing
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-8 sm:gap-10 pt-1"
              >
                {stats.map((item, index) => (
                  <div key={item.label}>
                    <h3
                      className={`text-2xl sm:text-3xl font-semibold ${index === 1 || index === 2 ? "text-white sm:text-inherit" : ""}`}
                    >
                      {item.value}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm text-neutral-500 -mt-1 ${index === 1 || index === 2 ? "text-white sm:text-neutral-500" : ""}`}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      <Plaster />
      <Faq />
    </main>
  );
}