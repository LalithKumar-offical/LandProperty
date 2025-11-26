import axios from "axios";
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: "https://localhost:7200/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      toast.error("Unauthorized access. Please login again.");
    }

    if (status === 403) {
      toast.error("Access forbidden. You don't have permission.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
