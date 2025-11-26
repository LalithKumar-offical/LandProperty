import axiosInstance from "./interceptors";

export const applyLand = async (data: {
  landId: number;
  userId: string;
  message?: string;
}) => {
  const response = await axiosInstance.post("/LandApplication", data, {
    withCredentials: true, 
  });
  return response.data; 
};

export const getLandApplicationById = async (id: number) => {
  const response = await axiosInstance.get(`/LandApplication/${id}`, {
    withCredentials: true,
  });
  return response.data; 
};
