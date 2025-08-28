import { apiRequestWithToken } from "../requestUtil";
import { baseUrl } from "../baseUrl";

interface RegisterSearchParams {
  plateNumber: string;
  registerPart: string;
}

interface ClaimSearchParams {
  token: string;
}

interface CreateClaimParams {
  contractId: string;
  caseDate: string;
  caseDescription: string;
  driverBankId: string;
  driverBankAccount: string;
  driverBankAccountName: string;
  bankAccountLastname: string;
  bankAccountRegnum: string;
  invoicedAmount: string;
  phone: string;
  email: string;
  policeCalled: string;
  accidentCalled: string;
  caseCityId: string;
  caseDistrictId: string;
  caseLocation: string;
  driverName: string;
  driverLastname: string;
  driverRegNum: string;
  driverPhone: string;
  victimName: string;
  victimLastname: string;
  victimRegNum: string;
  inspected: string;
  insurerAgreement: string;
  agreementAmount: string;
  attachments: unknown[];
}

export async function RegisterSearch(
  params: RegisterSearchParams,
  token: string
) {
  console.log(params);
  console.log(token);
  return apiRequestWithToken(
    `${baseUrl}/api/v1/miniapp/contract/search`,
    "POST",
    token,
    {
      plateNumber: params.plateNumber,
      registerPart: params.registerPart,
    }
  );
}

export async function ClaimSearch(params: ClaimSearchParams, token: string) {
  console.log("Claim search params:", params);
  console.log("Token:", token);

  return apiRequestWithToken(
    `${baseUrl}/api/v1/miniapp/claim/search`,
    "POST",
    token,
    {
      token: params.token,
    }
  );
}

export async function CreateClaim(params: CreateClaimParams, token: string) {
  console.log("Create claim params:", params);
  console.log("Token:", token);

  return apiRequestWithToken(
    `${baseUrl}/api/v1/miniapp/claim/create`,
    "POST",
    token,
    {
      contractId: params.contractId,
      caseDate: params.caseDate,
      caseDescription: params.caseDescription,
      driverBankId: params.driverBankId,
      driverBankAccount: params.driverBankAccount,
      driverBankAccountName: params.driverBankAccountName,
      bankAccountLastname: params.bankAccountLastname,
      bankAccountRegnum: params.bankAccountRegnum,
      invoicedAmount: params.invoicedAmount,
      phone: params.phone,
      email: params.email,
      policeCalled: params.policeCalled,
      accidentCalled: params.accidentCalled,
      caseCityId: params.caseCityId,
      caseDistrictId: params.caseDistrictId,
      caseLocation: params.caseLocation,
      driverName: params.driverName,
      driverLastname: params.driverLastname,
      driverRegNum: params.driverRegNum,
      driverPhone: params.driverPhone,
      victimName: params.victimName,
      victimLastname: params.victimLastname,
      victimRegNum: params.victimRegNum,
      inspected: params.inspected,
      insurerAgreement: params.insurerAgreement,
      agreementAmount: params.agreementAmount,
      attachments: params.attachments,
    }
  );
}
