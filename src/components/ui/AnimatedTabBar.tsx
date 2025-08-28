"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface AnimatedTabBarProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  indicatorClassName?: string;
}

export default function AnimatedTabBar({
  tabs,
  defaultTab,
  className = "",
  tabClassName = "",
  indicatorClassName = "",
}: AnimatedTabBarProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="relative flex bg-gray-100 rounded-lg p-1 shadow-sm">
        {tabs.map((tab, index) => (
          <button
            key={tab.id + index}
            onClick={() => handleTabChange(tab.id)}
            className={`relative flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out rounded-md ${
              activeTab === tab.id
                ? "text-white font-semibold"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            } ${tabClassName}`}
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              {tab.label}
            </div>
          </button>
        ))}

        {/* Animated Indicator */}
        <motion.div
          className={`absolute top-1 bottom-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md shadow-lg ${indicatorClassName}`}
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
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="w-full"
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
import { Home, User, Settings, Bell } from 'lucide-react';

const tabs = [
  {
    id: 'home',
    label: 'Нүүр',
    icon: <Home size={20} />,
    content: <div>Нүүр хуудасны агуулга</div>
  },
  {
    id: 'profile',
    label: 'Профайл',
    icon: <User size={20} />,
    content: <div>Профайлын агуулга</div>
  },
  {
    id: 'settings',
    label: 'Тохиргоо',
    icon: <Settings size={20} />,
    content: <div>Тохиргооны агуулга</div>
  },
  {
    id: 'notifications',
    label: 'Мэдэгдэл',
    icon: <Bell size={20} />,
    content: <div>Мэдэгдлийн агуулга</div>
  }
];

<AnimatedTabBar 
  tabs={tabs} 
  defaultTab="home"
  className="max-w-2xl mx-auto"
/>
*/
