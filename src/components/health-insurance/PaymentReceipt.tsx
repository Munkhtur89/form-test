import React from "react";
import ImageUploader from "../ImageUploader";

interface PaymentReceiptProps {
  onFileChange: (files: File[]) => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ onFileChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <ImageUploader label="Төлбөрийн баримт" onFileChange={onFileChange} />
    </div>
  );
};

export default PaymentReceipt;
