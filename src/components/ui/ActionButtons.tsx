import React from "react";
import { Plus } from "lucide-react";

interface ActionButtonsProps {
  onReset: () => void;
  onSubmit?: () => void;
  submitText?: string;
  resetText?: string;
  showSubmit?: boolean;
  className?: string;
  showPlusIcon?: boolean;
}

export default function ActionButtons({
  onReset,
  onSubmit,
  submitText = "Илгээх",
  resetText = "Бүгдийг цэвэрлэх",
  showSubmit = true,
  className = "",
  showPlusIcon = false,
}: ActionButtonsProps) {
  return (
    <div className={`flex justify-end gap-3 ${className}`}>
      <button
        onClick={onReset}
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
      >
        {resetText}
      </button>

      {showSubmit && onSubmit && (
        <button
          onClick={onSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all flex items-center gap-2"
        >
          {showPlusIcon && <Plus className="h-4 w-4" />}
          {submitText}
        </button>
      )}
    </div>
  );
}
