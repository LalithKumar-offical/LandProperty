import type {  CreateHome, UpdateHome } from "../types/homeOwnerType";

import axiosInstance from "./interceptors";

export const getAllHomes = async () => {
  const response = await axiosInstance.get("/HomeOwner", { withCredentials: true });
  return response;
};

export const getHomeById = async (id: number) => {
  const response = await axiosInstance.get(`/HomeOwner/${id}`, { withCredentials: true });
  return response;
};

export const addHome = async (data: CreateHome) => {
  const response = await axiosInstance.post("/HomeOwner", data, { withCredentials: true });
  return response;
};

export const updateHome = async (data: UpdateHome) => {
  const response = await axiosInstance.put("/HomeOwner", data, { withCredentials: true });
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

export const getDocumentsByHomeId = async (homeId: number) => {
  const response = await axiosInstance.get(`/HomeOwner/${homeId}/documents`, {
    withCredentials: true,
  });
  return response;
};

export const getFileUrl = (documentId: number) => {
  return `https://localhost:7200/api/HomeOwner/documents/${documentId}/file`;
};

export const getFileFromPath = (documentPath: string) => {
  const fileName = documentPath.split('\\').pop();
  const isImage = documentPath.includes('Images');
  const folder = isImage ? 'Images' : 'Documents';
  return `https://localhost:7200/Uploads/${folder}/${fileName}`;
};

export const getDocumentsByType = async (homeId: number, type: string) => {
  const response = await axiosInstance.get(`/HomeOwner/${homeId}/documents/type/${type}`, {
    withCredentials: true,
  });
  return response;
};

export const deleteDocument = async (documentId: number) => {
  const response = await axiosInstance.delete(`/HomeOwner/documents/${documentId}`, {
    withCredentials: true,
  });
  return response;
};

export const approveHome = async (homeId: number) => {
  console.log('approveHome called with homeId:', homeId);
  const response = await axiosInstance.put(`/HomeOwner/${homeId}/approve`, null, {
    withCredentials: true,
  });
  console.log('approveHome response:', response);
  return response;
};

export const rejectHome = async (homeId: number, reason: string) => {
  console.log('rejectHome called with homeId:', homeId, 'reason:', reason);
  const response = await axiosInstance.put(
    `/HomeOwner/${homeId}/reject?reason=${encodeURIComponent(reason)}`,
    {},
    { withCredentials: true }
  );
  console.log('rejectHome response:', response);
  return response;
};

export const filterHomes = async (params: {
  approved?: boolean;
  active?: boolean;
  userId?: string;
}) => {
  const response = await axiosInstance.get("/HomeOwner/filter", {
    params,
    withCredentials: true,
  });
  return response;
};

export const getApprovedHomes = async () => {
  const response = await axiosInstance.get("/HomeOwner/approved", { withCredentials: true });
  return response;
};

export const getRejectedHomes = async () => {
  const response = await axiosInstance.get("/HomeOwner/rejected", { withCredentials: true });
  return response;
};

export const getPendingHomes = async () => {
  const allHomes = await getHomesWithOwnerAndDocs();
  return allHomes.data.filter((home: any) => home.HomeStatusApproved === false);
};

export const getActiveHomes = async () => {
  const response = await axiosInstance.get("/HomeOwner/active", { withCredentials: true });
  return response;
};

export const getHomesWithOwnerAndDocs = async () => {
  const response = await axiosInstance.get("/HomeOwner/full-details", {
    withCredentials: true,
  });
  return response;
};

export const getHomeWithOwnerAndDocsById = async (id: number) => {
  const response = await axiosInstance.get(`/HomeOwner/${id}/full-details`, {
    withCredentials: true,
  });
  return response;
};

export const getOwnerDashboardSummary = async (userId: string) => {
  const response = await axiosInstance.get(`/OwnerDashboard/summary?userId=${userId}`, {
    withCredentials: true,
  });
  return response;
};
