import axiosInstance from './interceptors';

export interface DashboardSummary {
  users: any[];
  homes: any[];
  lands: any[];
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await axiosInstance.get('/AdminDashboard/summary');
  return response.data;
};
