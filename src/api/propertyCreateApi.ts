import axiosInstance from './interceptors';

export interface CreateHome {
  HomeDiscription: string;
  HomeName: string;
  HomeAddress: string;
  HomeCity: string;
  HomeState: string;
  HomePincode: string;
  AreaInSqFt: number;
  HomePriceInital: number;
  UserId: string;
}

export interface UpdateHome {
  HomeName: string;
  HomeId: number;
  HomeDiscription: string;
  HomeAddress: string;
  HomePriceInital: number;
  Status: boolean;
}

export interface CreateLand {
  LandName: string;
  LandLocation: string;
  LandDescription: string;
  LandPrice: number;
  LandArea: number;
  UserId: string;
}

export interface UpdateLand {
  LandId: number;
  LandName: string;
  LandLocation: string;
  LandDescription: string;
  LandPrice: number;
  LandArea: number;
  UserId: string;
}

export const addHome = async (data: CreateHome) => {
  const response = await axiosInstance.post("/HomeOwner", data, { withCredentials: true });
  return response;
};

export const updateHome = async (data: UpdateHome) => {
  const response = await axiosInstance.put("/HomeOwner", data, { withCredentials: true });
  return response;
};

export const addLand = async (data: CreateLand) => {
  const response = await axiosInstance.post("/LandOwner", data, { withCredentials: true });
  return response;
};

export const createLand = async (data: CreateLand) => {
  const response = await axiosInstance.post("/LandOwner", data, { withCredentials: true });
  return response.data;
};

export const updateLand = async (data: UpdateLand) => {
  const response = await axiosInstance.put("/LandOwner", data, { withCredentials: true });
  return response;
};

export const uploadHomeDocument = async (data: {
  homeId: number;
  file: File;
  type: string;
}) => {
  const formData = new FormData();
  formData.append("HomeId", data.homeId.toString());
  formData.append("File", data.file);
  formData.append("Type", data.type);

  const response = await axiosInstance.post("/HomeOwner/upload", formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const uploadLandDocument = async (data: {
  landId: number;
  file: File;
  type: string;
}) => {
  const formData = new FormData();
  formData.append("LandId", data.landId.toString());
  formData.append("File", data.file);
  formData.append("Type", data.type);

  const response = await axiosInstance.post("/LandOwner/upload", formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};