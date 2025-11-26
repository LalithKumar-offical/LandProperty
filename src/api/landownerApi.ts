import axiosInstance from "./interceptors";

// ================== BASIC CRUD ==================

// 👀 Get all lands
export const getAllLands = async () => {
  const response = await axiosInstance.get("/LandOwner", { withCredentials: true });
  return response;
};

// 👀 Get land by ID
export const getLandById = async (id: number) => {
  const response = await axiosInstance.get(`/LandOwner/${id}`, { withCredentials: true });
  return response;
};

// 🏞️ Add a new land (PropertyOwner only)
export const addLand = async (data: any) => {
  const response = await axiosInstance.post("/LandOwner", data, { withCredentials: true });
  return response;
};

// ✏️ Update land (PropertyOwner only)
export const updateLand = async (data: any) => {
  const response = await axiosInstance.put("/LandOwner", data, { withCredentials: true });
  return response;
};

// ================== DOCUMENT MANAGEMENT ==================

// 📤 Upload a land document (PropertyOwner / Admin)
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

// 📄 Get all documents for a land
export const getDocumentsByLandId = async (landId: number) => {
  const response = await axiosInstance.get(`/LandOwner/${landId}/documents`, {
    withCredentials: true,
  });
  return response;
};

// 📁 Get file from backend using document path
export const getLandFileFromPath = (documentPath: string) => {
  const fileName = documentPath.split('\\').pop();
  const isImage = documentPath.includes('Images');
  const folder = isImage ? 'Images' : 'Documents';
  return `https://localhost:7200/Uploads/${folder}/${fileName}`;
};

// ❌ Delete document (Admin only)
export const deleteLandDocument = async (documentId: number) => {
  const response = await axiosInstance.delete(`/LandOwner/documents/${documentId}`, {
    withCredentials: true,
  });
  return response;
};

// ================== ADMIN ACTIONS ==================

// ✅ Approve land (Admin only)
export const approveLand = async (id: number) => {
  const response = await axiosInstance.post(`/LandOwner/${id}/approve`, null, {
    withCredentials: true,
  });
  return response.data;
};

// ❌ Reject land (Admin only)
export const rejectLand = async (id: number, reason: string) => {
  const response = await axiosInstance.post(`/LandOwner/${id}/reject`, reason, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
};

// ================== OPTIMIZED SINGLE REQUEST FUNCTIONS ==================

// 🏞️ Get all lands with owner and documents (single request)
export const getLandsWithOwnerAndDocs = async () => {
  const response = await axiosInstance.get("/LandOwner/land/full-details", {
    withCredentials: true,
  });
  return response;
};

// 🏞️ Get single land with owner and documents by ID (single request)
export const getLandWithOwnerAndDocsById = async (id: number) => {
  const response = await axiosInstance.get(`/LandOwner/${id}/full-details`, {
    withCredentials: true,
  });
  return response;
};

// 🕓 Get pending lands with full details (Admin only) - Single request with filtering
export const getPendingLands = async () => {
  const allLands = await getLandsWithOwnerAndDocs();
  return allLands.data.filter((land: any) => land.LandStatusApproved === false);
};

// ✅ Get approved lands (Admin only)
export const getApprovedLands = async () => {
  const allLands = await getLandsWithOwnerAndDocs();
  return allLands.data.filter((land: any) => land.LandStatusApproved === true);
};

// ❌ Get rejected lands (Admin only)
export const getRejectedLands = async () => {
  const allLands = await getLandsWithOwnerAndDocs();
  return allLands.data.filter((land: any) => land.LandStatusApproved === false && land.IsActive === false);
};

// 🏡 Get active lands (All roles)
export const getActiveLands = async () => {
  const allLands = await getLandsWithOwnerAndDocs();
  return allLands.data.filter((land: any) => land.IsActive === true);
};