
export type DocumentType =
  | "SaleDeed"
  | "OwnershipProof"
  | "PropertyTax"
  | "Other";

export interface HomeDocument {
  HomeDocumnetsId: number;
  DocumentType: number;
  DocumentPath: string;
  DocumentDetailsExtracted?: string | null;
  HomeId: number;
}

export interface CreateHomeDocument {
  homeId: number;
  documentType: string;
  file: File; 
}
export interface UploadHomeDocumentRequest {
  homeId: number;
  file: File; 
  type: DocumentType;
}
