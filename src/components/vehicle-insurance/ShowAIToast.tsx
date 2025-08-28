import React from "react";
import { Sparkles } from "lucide-react";

export function ShowAIToast({
  message,
  isSuccess = true,
}: {
  message: string;
  isSuccess?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border ${
        isSuccess ? "bg-blue-50 border-blue-300" : "bg-red-50 border-red-300"
      }`}
    >
      <div className="mt-1">
        <Sparkles
          className={`w-6 h-6 ${isSuccess ? "text-blue-500" : "text-red-500"}`}
        />
      </div>
      <div>
        <div
          className={`font-bold ${
            isSuccess ? "text-blue-700" : "text-red-700"
          }`}
        >
          AI зөвлөмж
        </div>
        <div className="text-sm text-gray-800 whitespace-pre-line">
          {message}
        </div>
      </div>
    </div>
  );
}
