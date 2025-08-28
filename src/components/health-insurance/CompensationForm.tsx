import React from "react";
import ImageUploader from "../ImageUploader";

interface CompensationFormProps {
  onFileChange: (files: File[]) => void;
}

const CompensationForm: React.FC<CompensationFormProps> = ({
  onFileChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <ImageUploader
        label="Нөхөн төлбөрийн маягт"
        onFileChange={onFileChange}
      />
    </div>
  );
};

export default CompensationForm;
