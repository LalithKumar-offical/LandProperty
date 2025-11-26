
export interface UserHomeApplication {
  applicationId: number;
  userId: string; 
  userName?: string | null;
  homeId: number;
  homeDescription?: string | null;
  offeredAmount: number;
  status?: string | null;
  purchasedDate?: string | null; 
}
export interface CreateUserHomeApplication {
  userId: string;
  homeId: number;
  offeredAmount: number;
}

export interface UserLandApplication {
  applicationId: number;
  userId: string;
  userName?: string | null;
  landId: number;
  landDescription?: string | null;
  offeredAmount: number;
  status?: string | null;
  purchasedDate?: string | null;
}

export interface CreateUserLandApplication {
  userId: string;
  landId: number;
  offeredAmount: number;
}
