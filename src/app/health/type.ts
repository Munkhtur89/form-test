export interface RegisterSearchResponse {
  result: boolean;
  data: {
    contractId: string;
    insurName: string;
    registerPart: string;
    startDate?: string;
    endDate?: string;
  };
}