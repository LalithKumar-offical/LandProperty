export interface CreateLand {
  landDescription?: string;
  landAddress?: string;
  landCity?: string;
  landState?: string;
  landPincode?: string;
  landAreaInSqFt: number;
  landPriceInitial: number;
  userId: string;
}

export interface LandList {
  landId: number;
  landDescription?: string;
  landCity?: string;
  landPriceInitial: number;
  landStatusApproved: boolean;
  status: boolean;
}

export interface LandDetails {
  landId: number;
  landDescription?: string;
  landAddress?: string;
  landCity?: string;
  landState?: string;
  landAreaInSqFt: number;
  landPriceInitial: number;
  landStatusApproved: boolean;
  status: boolean;
  rejectedReason?: string;
  userId: string;
  userName?: string;
  landDocuments?: LandDocuments[];
}

export interface UpdateLand {
  landId: number;
  landDescription?: string;
  landAddress?: string;
  landPriceInitial: number;
  status: boolean;
}

export interface LandDocuments {
  documentId: number;
  documentName?: string;
  documentUrl?: string;
}
