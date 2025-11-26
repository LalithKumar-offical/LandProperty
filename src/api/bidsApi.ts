import axiosInstance from "./interceptors";

export const addBid = async (data: {
  UserId: string;
  HomeId?: number;
  LandId?: number | null;
  BidAmountByUser: number;
  PropertyType: number;
}) => {
  // Clean the data to ensure proper format
  const cleanData = {
    ...data,
    UserId: String(data.UserId),
    HomeId: data.HomeId || null,
    LandId: data.LandId || null,
    BidAmountByUser: Number(data.BidAmountByUser),
    PropertyType: Number(data.PropertyType)
  };
  
  console.log('Sending bid data to API:', cleanData); // Debug log
  const response = await axiosInstance.post("/Bids", cleanData, {
    withCredentials: true,
  });
  return response.data;
};

export const updateBidByOwner = async (data: {
  BidId: number;
  BidAmountByOwner: number;
  PurchaseRequest?: boolean;
}) => {
  const response = await axiosInstance.put("/Bids", data, {
    withCredentials: true,
  });
  return response.data;
};


export const updateBidByUser = async (data: {
  BidId: number;
  BidAmountByUser: number;
}) => {
  const response = await axiosInstance.put("/Bids", data, {
    withCredentials: true,
  });
  return response.data;
};


export const getBidById = async (id: number) => {
  const response = await axiosInstance.get(`/Bids/${id}`, {
    withCredentials: true,
  });
  return response.data;
};


export const getBidsByUser = async (userId: string) => {
  const response = await axiosInstance.get(`/Bids/user/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};


export const getBidsByProperty = async (homeId?: number, landId?: number) => {
  const params: any = {};
  if (homeId) params.homeId = homeId;
  if (landId) params.landId = landId;

  const response = await axiosInstance.get("/Bids/property", {
    params,
    withCredentials: true,
  });
  return response.data;
};


export const getBidsByOwner = async (ownerId: string) => {
  const response = await axiosInstance.get(`/Bids/owner/${ownerId}`, {
    withCredentials: true,
  });
  return response.data;
};


