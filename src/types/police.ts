export interface PolicePhotoValidation {
  isValid: boolean;
  photoType: string;
  quality?: "good" | "poor";
  issues?: string[];
  message: string;
  extractedData?: {
    documentType?: string;
    date?: string;
    caseNumber?: string;
    accidentDate?: string;
    location?: string;
    vehicleInfo?: string;
    additionalInfo?: string;
    vehicles?: Array<{
      make?: string;
      plateNumber?: string;
      driver?: string;
      organization?: string;
      technicalCondition?: string;
      speed?: string;
    }>;
    accidentInfo?: {
      date?: string;
      location?: string;
      vehicles?: Array<{
        make?: string;
        plateNumber?: string;
        year?: string;
      }>;
      description?: string;
    };
    drivers?: Array<{
      name?: string;
      licenseNumber?: string;
      registrationNumber?: string;
      address?: string;
      phone?: string;
    }>;
    roadConditions?: {
      surfaceType?: string;
      surfaceCondition?: string;
      visibility?: string;
      trafficFlow?: string;
      markings?: string;
    };
    damage?: string[];
    lawViolations?: {
      violatedLaws?: string[];
      violator?: string;
      description?: string;
    };
    officialInfo?: {
      registrationNumber?: string;
      officerName?: string;
      date?: string;
      authorizedOfficer?: string;
      examinationDate?: string;
      examinationLocation?: string;
      examinationMethod?: string;
    };
    conclusion?: string;
    punishment?: {
      type?: string;
      reason?: string;
      amount?: string;
      currency?: string;
    };
    // Гэрээний мэдээлэл
    contractInfo?: {
      contractType?: string;
      contractNumber?: string;
      contractDate?: string;
      parties?: Array<{
        name?: string;
        type?: string; // "Хувь хүн" эсвэл "Байгууллага"
        registrationNumber?: string;
        address?: string;
        phone?: string;
        representative?: string;
      }>;
      subject?: string;
      amount?: string;
      currency?: string;
      terms?: string[];
      signatures?: Array<{
        name?: string;
        position?: string;
        date?: string;
      }>;
      witnesses?: Array<{
        name?: string;
        registrationNumber?: string;
      }>;
      notary?: {
        name?: string;
        office?: string;
        stamp?: string;
      };
    };
    // Гэрэл зургийн үзүүлэлтийн мэдээлэл
    photoExhibitInfo?: {
      photoNumber?: string;
      photoDescription?: string;
      photoContent?: string;
      photographer?: string;
      photoDate?: string;
      photoLocation?: string;
      vehicleInfo?: string;
      accidentType?: string;
    };
    // Хөндлөнгийн гэрчээрийн мэдээлэл
    witnessInfo?: {
      witnessName?: string;
      registrationNumber?: string;
      address?: string;
      phone?: string;
      officialName?: string;
      officialPosition?: string;
      recordTime?: string;
      signatures?: string;
      stamps?: string;
    };
    // Эрх бүхий албан тушаалтны тэмдэглэлийн мэдээлэл
    officialRecordInfo?: {
      documentCode?: string;
      accidentDateTime?: string;
      accidentLocation?: string;
      legalBasis?: string;
      measurementDiagram?: string;
      roadMeasurements?: string;
      vehiclePositions?: string;
      roadConditions?: string;
      specialNotes?: string;
      officialSignature?: string;
    };
    // Зам тээврийн ослын хэргийн тайлбарын мэдээлэл
    accidentReportInfo?: {
      registrationNumber?: string;
      caseNumber?: string;
      status?: string;
      accidentDateTime?: string;
      documentDateTime?: string;
      accidentLocation?: string;
      involvedVehicles?: string;
      involvedDrivers?: string;
      accidentDescription?: string;
      insuranceInfo?: string;
      trafficViolation?: string;
      additionalCodes?: string;
    };
    // Шийтгэлийн хуудасны мэдээлэл
    penaltySheetInfo?: {
      documentNumber?: string;
      documentDate?: string;
      violatorName?: string;
      violatorRegistration?: string;
      violatorAddress?: string;
      penaltyAmount?: string;
      treasuryAccount?: string;
      paymentDeadline?: string;
      lawViolation?: string;
      confiscatedItems?: string;
      officialName?: string;
      officialPosition?: string;
      officialSignature?: string;
    };
    // Шүүхийн шийтгэх тогтоолын мэдээлэл
    courtDecisionInfo?: {
      documentType?: string;
      courtName?: string;
      documentNumber?: string;
      documentDate?: string;
      judgeName?: string;
      prosecutorName?: string;
      defendants?: string;
      caseNumber?: string;
      caseType?: string;
      lawViolation?: string;
      courtDecision?: string;
      appealRights?: string;
      officialSignature?: string;
    };
  };
}

export interface UploadedFile {
  file: File;
  preview: string;
  validation: PolicePhotoValidation | null;
  isProcessing: boolean;
}
