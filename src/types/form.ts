export interface FormValues {
  accidentPhotos: File[];
  driverPhotos: (File | null)[];
  policePhotos: File[]; // Цагдааны зураг
  insuranceContractPhotos: File[]; // Даатгалын гэрээний зураг
  startDate: string;
  endDate: string;
  plateNumber: string;
  contractNumber: string;
  ownerRegister: string;
  serialNumber: string;
  isValid: string;
  registerPart: string;
  contractId: string;
  driverImage: File | null;
  policeCalled: number;
  accidentCalled: number;
  caseDate: string;
  caseCityId: number;
  caseDistrictId: number;
  caseLocation: string;
  caseDescription: string;
  driverName: string;
  driverLastname: string;
  driverRegNum: string;
  driverPhone: string;
  driverBankId: number;
  driverBankAccount: string;
  driverBankAccountName: string;
  bankAccountLastname: string;
  bankAccountRegnum: string;
  victimName: string;
  victimLastname: string;
  victimRegNum: string;
  victimPhone: string;
  inspected: number;
  xplateNumber: string;
  contractProductName: string;
  insurerAgreement: number;
  agreementAmount: string;
  attachments: Array<{
    fileName: string;
    image_base64: string;
    file: File | null;
  }>;
  homeAddress: string;
  homeCityId: number;
  homeDistrictId: number;
  phone: string;
  mail: string;
  invoicedAmount: number;
  idCardInputType?: "image" | "pdf";
  idCardPdf?: File;
  idCardPdfImage?: File;
}

export interface BankInfos {
  driverBankId: number;
  driverBankAccount: string;
  driverBankAccountName: string;
  bankAccountLastname: string;
  bankAccountRegnum: string;
}

export interface HealthFormData {
  contractNumber: string;
  startDate: string;
  endDate: string;
  ownerRegister: string;
  branchNumber: string;
  phoneNumber: string;
  hospitalVisitDate: string;
  hospitalName: string;
  description: string;
  claimType: File[];
  paymentReceipt: File[];
  testResult: File[];
  prescriptionForm: File[];
  bankName: string;
  accountHolderLastName: string;
  accountHolderFirstName: string;
  accountHolderRegister: string;
  contractId: string;
  accountHolderBankAccount: string;
  driverBankId: number;
  driverBankAccount: string;
  driverBankAccountName: string;
  bankAccountLastname: string;
  bankAccountRegnum: string;
  phone: string;
  mail: string;
  invoicedAmount: number;
  attachments: Array<{
    fileName: string;
    file?: File;
    image_base64?: string;
  }>;
  accidentPhotos: File[];
  driverPhotos: File[];
}

export const initialFormValues: FormValues = {
  policePhotos: [],
  accidentPhotos: [],
  driverPhotos: [],
  insuranceContractPhotos: [],
  startDate: "",
  endDate: "",
  plateNumber: "",
  xplateNumber: "",
  contractNumber: "",
  ownerRegister: "",
  serialNumber: "",
  isValid: "",
  registerPart: "",
  contractId: "",
  driverImage: null,
  policeCalled: 0,
  accidentCalled: 0,
  caseDate: "",
  victimPhone: "",
  caseCityId: 11,
  caseDistrictId: 22,
  caseLocation: "",
  caseDescription: "",
  driverName: "",
  driverLastname: "",
  driverRegNum: "",
  driverPhone: "",
  driverBankId: 0,
  driverBankAccount: "",
  driverBankAccountName: "",
  bankAccountLastname: "",
  bankAccountRegnum: "",
  victimName: "",
  victimLastname: "",
  victimRegNum: "",
  inspected: 0,
  insurerAgreement: 0,
  agreementAmount: "",
  attachments: [],
  homeAddress: "",
  homeCityId: 0,
  homeDistrictId: 0,
  phone: "",
  mail: "",
  contractProductName: "",
  invoicedAmount: 0,
};

export const initialHealthFormData: HealthFormData = {
  contractNumber: "",
  startDate: "",
  endDate: "",
  ownerRegister: "",
  branchNumber: "",
  phoneNumber: "",
  hospitalVisitDate: "",
  hospitalName: "",
  description: "",
  claimType: [],
  paymentReceipt: [],
  testResult: [],
  prescriptionForm: [],
  bankName: "",
  accountHolderLastName: "",
  accountHolderFirstName: "",
  accountHolderRegister: "",
  contractId: "",
  accountHolderBankAccount: "",
  driverBankId: 0,
  driverBankAccount: "",
  driverBankAccountName: "",
  bankAccountLastname: "",
  bankAccountRegnum: "",
  phone: "",
  mail: "",
  invoicedAmount: 0,
  attachments: [],
  accidentPhotos: [],
  driverPhotos: [],
};
