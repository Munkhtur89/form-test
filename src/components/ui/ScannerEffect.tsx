import React, { useState, useEffect } from "react";

interface ScannerEffectProps {
  isProcessing: boolean;
  text?: string;
}

// AnimatedDots компонент
function AnimatedDots({ text }: { text: string }) {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <span>
      {text}
      {dots}
    </span>
  );
}

/**
 * Scanner Effect компонент - AI зураг боловсруулж байх үед харуулах animation
 * @param isProcessing - Боловсруулж байгаа эсэх
 * @param text - Харуулах текст (default: "AI зураг сканнердаж байна")
 */
export default function ScannerEffect({
  isProcessing,
  text = "AI зураг шалгаж байна",
}: ScannerEffectProps) {
  if (!isProcessing) return null;

  return (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg z-10">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Scanner beam effect */}
        <style>{`
          @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 85%; opacity: 0; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px #60a5fa, 0 0 10px #60a5fa, 0 0 15px #60a5fa; }
            50% { box-shadow: 0 0 10px #60a5fa, 0 0 20px #60a5fa, 0 0 30px #60a5fa; }
          }
        `}</style>

        {/* Corner indicators */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-blue-400 rounded-tl-lg animate-pulse"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-blue-400 rounded-tr-lg animate-pulse"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-blue-400 rounded-bl-lg animate-pulse"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-blue-400 rounded-br-lg animate-pulse"></div>

        {/* Scanning line */}
        <div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan"
          style={{
            animation: "scan 2s infinite ease-in-out",
          }}
        />

        {/* Center scanning circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-16 h-16 border-2 border-blue-400 rounded-full animate-glow"
            style={{
              animation: "glow 1.5s infinite ease-in-out",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-blue-300 rounded-full animate-rotate"
            style={{
              animation: "rotate 2s linear infinite",
            }}
          />
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"
              style={{
                width: "100%",
                animation: "pulse 1s infinite ease-in-out",
              }}
            />
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <div className="bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <AnimatedDots text={text} />
        </div>
      </div>
    </div>
  );
}
