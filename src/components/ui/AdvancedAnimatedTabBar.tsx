"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: number | string;
}

interface AdvancedAnimatedTabBarProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: "default" | "pills" | "underline" | "cards";
  size?: "sm" | "md" | "lg";
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export default function AdvancedAnimatedTabBar({
  tabs,
  defaultTab,
  variant = "default",
  size = "md",
  className = "",
  onTabChange,
}: AdvancedAnimatedTabBarProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const hoveredTabIndex = tabs.findIndex((tab) => tab.id === hoveredTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  // Size variants
  const sizeVariants = {
    sm: { padding: "px-3 py-2", text: "text-xs", icon: "text-sm" },
    md: { padding: "px-4 py-3", text: "text-sm", icon: "text-lg" },
    lg: { padding: "px-6 py-4", text: "text-base", icon: "text-xl" },
  };

  const currentSize = sizeVariants[size];

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "pills":
        return {
          container: "bg-gray-100 rounded-full p-1",
          tab: "rounded-full",
          indicator: "rounded-full",
        };
      case "underline":
        return {
          container: "border-b border-gray-200",
          tab: "border-b-2 border-transparent",
          indicator: "border-b-2 border-blue-500",
        };
      case "cards":
        return {
          container: "bg-gray-50 rounded-xl p-2",
          tab: "rounded-lg",
          indicator: "rounded-lg",
        };
      default:
        return {
          container: "bg-gray-100 rounded-lg p-1",
          tab: "rounded-md",
          indicator: "rounded-md",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className={`relative ${variantStyles.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex-1 ${currentSize.padding} ${
              currentSize.text
            } font-medium transition-all duration-300 ease-in-out ${
              activeTab === tab.id
                ? "text-white font-semibold"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            } ${variantStyles.tab}`}
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon && (
                <motion.span
                  className={currentSize.icon}
                  animate={{
                    scale: activeTab === tab.id ? 1.1 : 1,
                    rotate: activeTab === tab.id ? [0, -10, 10, 0] : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  {tab.icon}
                </motion.span>
              )}
              <span>{tab.label}</span>
              {tab.badge && (
                <motion.span
                  className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {tab.badge}
                </motion.span>
              )}
            </div>
          </button>
        ))}

        {/* Animated Background Indicator */}
        <motion.div
          className={`absolute top-0 bottom-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg ${variantStyles.indicator}`}
          initial={false}
          animate={{
            x: `${(100 / tabs.length) * activeTabIndex}%`,
            width: `${100 / tabs.length}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />

        {/* Hover Effect */}
        {hoveredTab && hoveredTab !== activeTab && (
          <motion.div
            className="absolute top-0 bottom-0 bg-white/20 rounded-md"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: `${(100 / tabs.length) * hoveredTabIndex}%`,
              width: `${100 / tabs.length}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          />
        )}
      </div>

      {/* Tab Content with Advanced Animations */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
              rotateX: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
              rotateX: 15,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="w-full perspective-1000"
          >
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Хэрэглээний жишээ:
/*
import { Home, User, Settings, Bell, Car, Shield } from 'lucide-react';

const tabs = [
  {
    id: 'home',
    label: 'Нүүр',
    icon: <Home size={20} />,
    content: <div className="p-6 bg-white rounded-lg shadow">Нүүр хуудасны агуулга</div>
  },
  {
    id: 'profile',
    label: 'Профайл',
    icon: <User size={20} />,
    content: <div className="p-6 bg-white rounded-lg shadow">Профайлын агуулга</div>
  },
  {
    id: 'vehicle',
    label: 'Тээврийн хэрэгсэл',
    icon: <Car size={20} />,
    badge: 3,
    content: <div className="p-6 bg-white rounded-lg shadow">Тээврийн хэрэгслийн агуулга</div>
  },
  {
    id: 'insurance',
    label: 'Даатгал',
    icon: <Shield size={20} />,
    content: <div className="p-6 bg-white rounded-lg shadow">Даатгалын агуулга</div>
  }
];

// Default variant
<AdvancedAnimatedTabBar 
  tabs={tabs} 
  defaultTab="home"
  className="max-w-4xl mx-auto"
/>

// Pills variant
<AdvancedAnimatedTabBar 
  tabs={tabs} 
  variant="pills"
  size="lg"
  className="max-w-4xl mx-auto"
/>

// Underline variant
<AdvancedAnimatedTabBar 
  tabs={tabs} 
  variant="underline"
  size="md"
  className="max-w-4xl mx-auto"
/>

// Cards variant
<AdvancedAnimatedTabBar 
  tabs={tabs} 
  variant="cards"
  size="lg"
  className="max-w-4xl mx-auto"
/>
*/
