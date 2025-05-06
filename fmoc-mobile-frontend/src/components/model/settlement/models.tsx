export type SettlementRequest = {
    id: string | null
    userId: string | null
    usageNominal: number | null
    transactionDate: string | null
    submissionDate: string | null
    latitude: number | null
    longitude: number | null
    description: string | null
    buktiPenggunaanDanaImgData: string | null;
  };

  export interface SettlementDetails {
    id: string;
    userId: string;
    category: string;
    nominal: number;
    usageNominal: number;
    description: string;
    buktiPenggunaanDanaUrl: string;
    additionalSettlementUrl: string;
    latitude: number;
    longitude: number;
    transactionDate: string;
    submissionDate: string; 
    status: string;
  }

  