export type ObjectTypeEnum = "phone" | "bike" | "notebook" | "other";
export type SearchResultType = "safe" | "stolen" | "not_found";

export interface SearchResult {
  type: SearchResultType;
  theftInfo?: {
    date: Date;
    location: string;
    boNumber: string;
  };
}

export interface EmergencyContact {
  name: string;
  phone: string;
  description?: string;
  address?: string;
}
