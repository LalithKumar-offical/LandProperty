export type DocumentType =
  | "SaleDeed"
  | "OwnershipProof"
  | "PropertyTax"
  | "Other";

export interface LandDocument {
  landDocumentId: number;
  documentType?: string | null;
  documentPath?: string | null;
  documentDetailsExtracted?: string | null;
  landId?: number | null;
}

export interface CreateLandDocument {
  landId: number;
  documentType: string;
  file: File;
}

export interface UploadLandDocumentRequest {
  landId: number;
  file: File;
  type: DocumentType;
}
