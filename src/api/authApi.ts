import axiosInstance from "./interceptors";

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/Auth/login", credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const registerUser = async (data: {
  userName: string;
  userEmail: string;
  userPhoneNo: string;
  userPassword: string;
}) => {
  const response = await axiosInstance.post("/Auth/register", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/Auth/logout", null, {
    withCredentials: true,
  });
  return response.data;
};
