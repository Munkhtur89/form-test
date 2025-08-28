"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// SVG Filter for glass effect
const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="20"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

interface InsuranceCardProps {
  title: string;
  description: string;
  animationData: unknown;
  href: string;
  loop?: boolean;
  color?: string;
}

export default function InsuranceCard({
  title,
  description,
  animationData,
  href,
  loop = true,
  color = "rgba(59, 130, 246, 0.5)", // Default blue color
}: InsuranceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <GlassFilter />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative"
      >
        <Link
          href={href}
          className="block h-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="group relative bg-background/30 backdrop-blur-xl rounded-3xl p-8 transition-all duration-300 ease-out cursor-pointer overflow-hidden h-[280px] flex flex-col border border-border/50"
            style={{
              boxShadow: `0 10px 30px -5px ${color}`,
              background: "rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Glass effect layers */}
            <div
              className="absolute inset-0 z-0 overflow-hidden rounded-3xl"
              style={{
                backdropFilter: "blur(3px)",
                filter: "url(#glass-distortion)",
                isolation: "isolate",
              }}
            />
            <div
              className="absolute inset-0 z-10 rounded-3xl"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            />
            <div
              className="absolute inset-0 z-20 rounded-3xl overflow-hidden"
              style={{
                boxShadow:
                  "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.2), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.1)",
              }}
            />

            {/* Content */}
            <div className="relative z-30 flex-1">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl font-semibold text-foreground mb-3"
              >
                {title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-muted-foreground"
              >
                {description}
              </motion.p>
            </div>

            {/* Animation container */}
            <motion.div
              className="relative h-[140px] mt-auto z-30"
              animate={{
                scale: isHovered ? 1.05 : 1,
                y: isHovered ? -5 : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              <Lottie
                animationData={animationData}
                loop={loop}
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Hover gradient overlay */}
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              style={{
                background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
                opacity: 0.15,
              }}
            />
          </motion.div>
        </Link>
      </motion.div>
    </>
  );
}
