import React from "react";

interface ProcessingIndicatorProps {
  message?: string;
  className?: string;
}

export default function ProcessingIndicator({
  message = "AI боловсруулж байна...",
  className = "",
}: ProcessingIndicatorProps) {
  return (
    <div
      className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-center space-x-3">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <p className="text-blue-800 font-medium">{message}</p>
      </div>
    </div>
  );
}
