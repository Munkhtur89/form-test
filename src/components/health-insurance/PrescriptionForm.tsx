import React from "react";
import ImageUploader from "../ImageUploader";

interface PrescriptionFormProps {
  onFileChange: (files: File[]) => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  onFileChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <ImageUploader label="Жорын маягт" onFileChange={onFileChange} />
    </div>
  );
};

export default PrescriptionForm;
