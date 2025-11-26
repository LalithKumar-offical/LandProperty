import {type HomeDocument } from "./homeDocumentType";

export interface CreateHome {
  homeDiscription?: string | null;
  homeAddress?: string | null;
  homeCity?: string | null;
  homeState?: string | null;
  homePincode?: string | null;
  areaInSqFt: number;
  homePriceInital: number;
  userId: string; 
}

export interface HomeList {
  homeId: number;
  homeDiscription?: string | null;
  homeCity?: string | null;
  homePriceInital: number;
  homeStatusApproved: boolean;
  rejectedReason?: string | null;
  status: boolean;
}

export interface HomeDetails {
  homeId: number;
  homeDiscription?: string | null;
  homeAddress?: string | null;
  homeCity?: string | null;
  homeState?: string | null;
  areaInSqFt: number;
  homePriceInital: number;
  homeStatusApproved: boolean;
  status: boolean;
  rejectedReason?: string | null;
  userId: string; 
  userName?: string | null;
  homeDocuments?: HomeDocument[] | null; 
}

export interface UpdateHome {
  homeId: number;
  homeDiscription?: string | null;
  homeAddress?: string | null;
  homePriceInital: number;
  status: boolean;
}

export interface UpdateHomeStatus {
  homeId: number;
  homeStatusApproved: boolean;
}

export interface HomeWithOwnerAndDocuments {
  HomeId: number;
  HomeName: string | null;
  HomeDescription: string | null;
  HomeAddress: string | null;
  HomeCity: string | null;
  HomeState: string | null;
  HomePincode: string | null;
  HomePhoneno: string | null;
  HomePriceInital: number;
  HomeStatusApproved: boolean;
  IsActive: boolean;
  OwnerId: string;
  OwnerName: string | null;
  OwnerEmail: string | null;
  OwnerPhoneNo: string | null;
  Documents: HomeDocument[];
}
