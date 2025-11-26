
export type PropertyType = "Home" | "Land" | null;

export interface CreateBid {
  userId: string; 
  homeId?: number | null; 
  landId?: number | null;
  bidAmountByUser: number;
  propertyType?: PropertyType; 
}

export interface BidResponse {
  BidId: number;
  BidAmountByUser: number;
  BidAmountByOwner: number;
  HomeName?: string | null;
  LandName?: string | null;
  PurchaseRequest: boolean;
  PropertyType: number;
  userName?: string;
}
