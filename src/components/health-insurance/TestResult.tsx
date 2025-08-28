import React from "react";
import ImageUploader from "../ImageUploader";

interface TestResultProps {
  onFileChange: (files: File[]) => void;
}

const TestResult: React.FC<TestResultProps> = ({ onFileChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <ImageUploader label="Шинжилгээний хариу" onFileChange={onFileChange} />
    </div>
  );
};

export default TestResult;
