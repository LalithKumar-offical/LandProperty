import axiosInstance from "./interceptors";

export const applyHome = async (data: {
  homeId: number;
  userId: string;
  message?: string;
}) => {
  const response = await axiosInstance.post("/HomeApplication", data, {
    withCredentials: true, 
  });
  return response.data; 
};


export const getHomeApplicationById = async (id: number) => {
  const response = await axiosInstance.get(`/HomeApplication/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
