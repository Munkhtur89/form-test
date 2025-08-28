"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

// --- Type Definitions for props ---
export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  title: string;
  quote?: string;
  avatarSrc: string;
  rating: number;
}

export interface ClientsSectionProps {
  tagLabel: string;
  title: string;
  description: string;
  stats: Stat[];
  testimonials: Testimonial[];
  primaryActionLabel: string;
  secondaryActionLabel: string;
  className?: string;
}

// --- Internal Sub-Components ---

// StatCard using shadcn variables
const StatCard = ({ value, label }: Stat) => (
  <Card className="bg-white text-center rounded-xl border border-gray-200">
    <CardContent className="p-4">
      <p className="text-3xl font-bold text-[#142a68]">{value}</p>
      <p className="text-sm ">{label}</p>
    </CardContent>
  </Card>
);

// A simple testimonial card without sticky positioning
const StickyTestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-full"
    >
      <div
        className={cn(
          "p-6 rounded-2xl shadow-lg flex flex-col h-auto w-full mb-4",
          "bg-card border border-border"
        )}
      >
        {/* Top section: Image and Author */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 border border-gray-100"
            style={{ backgroundImage: `url(${testimonial.avatarSrc})` }}
            aria-label={`Photo of ${testimonial.name}`}
          />
          <div className="flex-grow min-w-0">
            <p className="font-semibold text-lg text-black truncate">
              {testimonial.name}
            </p>
            <p className="text-sm  text-black truncate">{testimonial.title}</p>
          </div>
        </div>

        {/* Middle section: Rating */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-base text-black">
            {testimonial.rating.toFixed(1)}
          </span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(testimonial.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>

        {/* Bottom section: Quote */}
        {testimonial.quote && (
          <p className="text-base text-muted-foreground text-black leading-relaxed">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Exported Component ---

export const ClientsSection = ({
  tagLabel,
  title,
  description,
  stats,
  testimonials,

  className,
}: ClientsSectionProps) => {
  return (
    <section
      className={cn(
        "w-full bg-white text-foreground py-20 md:py-8 mb-20",
        className
      )}
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Column: Content */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-muted/50 px-3 py-1 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground uppercase text-black">
              {tagLabel}
            </span>
          </div>

          <h2 className="text-4xl md:text-3xl font-bold tracking-tight text-black">
            {title}
          </h2>
          <p className="text-lg  text-black">{description}</p>
          <div className="grid grid-cols-3 gap-4 mt-4 text-black">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* Right Column: Testimonials */}
        <div className="flex flex-col gap-4">
          {testimonials.map((testimonial, index) => (
            <StickyTestimonialCard
              key={testimonial.name}
              index={index}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
