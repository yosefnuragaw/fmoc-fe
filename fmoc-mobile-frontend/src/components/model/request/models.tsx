export type RequestDana = {
    requestId: string
    wo: string
    category: string
    nominal: number
    status: string
    submissionDate: string
    settled: boolean;
}

export type DetailRequestDana = {
    id: string;               // UUID to string conversion
    wo: string;
    userId: string;          // UUID to string conversion
    nominal: number;
    imgData: string;
    latitude: number;
    longitude: number;
    submissionDate: string;  // or Date, depending on how you process it
    category: string;
    status: string;
    end: boolean;
    approved: boolean;
  };
  
