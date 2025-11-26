import axiosInstance from "./interceptors";

export const getAllLogs = async () => {
  const response = await axiosInstance.get("/Logger", { withCredentials: true });
  return response.data;
};

export const deleteAllLogs = async () => {
  const response = await axiosInstance.delete("/Logger/delete-all", { withCredentials: true });
  return response.data; 
};

export const filterLogsByAction = async (action?: string) => {
  const response = await axiosInstance.get("/Logger/filter", {
    params: action ? { action } : {},
    withCredentials: true,
  });
  return response.data;
};
