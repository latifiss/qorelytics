"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = [
  {
    text: "Business Owners",
    gradient: "linear-gradient(90deg, #7FF86C, #10b981)",
  },
  {
    text: "Marketers",
    gradient: "linear-gradient(90deg, #1484f9, #25c6e0)",
  },
  {
    text: "Founders",
    gradient: "linear-gradient(90deg, #672ef8, #c41ef9)",
  },
  {
    text: "Researchers",
    gradient: "linear-gradient(90deg, #25c5f9, #1484f9)",
  },
  {
    text: "Data Teams",
    gradient: "linear-gradient(90deg, #24cf66, #25cf99)",
  },
  {
    text: "Analysts",
    gradient: "linear-gradient(90deg, #f1a621, #fb6d19)",
  },
];

export default function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className="
        inline-flex
        overflow-hidden
        align-middle
        min-w-[280px]
        h-[1.15em]
        perspective-[500px]
      "
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={roles[index].text}
          style={{
            backgroundImage: roles[index].gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          className="
            inline-block
            font-semibold
          "
          initial={{
            y: "120%",
            rotateX: 90,
            opacity: 0,
          }}
          animate={{
            y: "0%",
            rotateX: 0,
            opacity: 1,
          }}
          exit={{
            y: "-120%",
            rotateX: -90,
            opacity: 0,
          }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {roles[index].text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}