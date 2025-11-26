import axiosInstance from "./interceptors";

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/User", { withCredentials: true });
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await axiosInstance.get(`/User/${id}`, { withCredentials: true });
  return response.data;
};

export const addUser = async (data: {
  UserName: string;
  UserEmail: string;
  UserPhoneNo: string;
  UserPassword: string;
  RoleId?: number;
}) => {
  const response = await axiosInstance.post("/User", data);
  return response.data;
};

export const updateUser = async (data: {
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhoneNo?: string;
  userBalance?: number;
  roleId?: number;
}) => {
  const response = await axiosInstance.put("/User", data, { withCredentials: true });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/User/${id}`, { withCredentials: true });
  return response.data;
};

export const getCurrentUser = async (userId: string) => {
  const response = await axiosInstance.get(`/User/${userId}`, { withCredentials: true });
  return response.data;
};
