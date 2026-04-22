export interface OCRData {
  vendor: string;
  date: string;
  amount: string;
  gstin: string;
  items: number;
}

export interface AIService {
  id: string;
  title_key: string;
  description_key: string;
  type_key: string;
  icon_name: string;
  title?: string;
  description?: string;
  type?: string;
  icon?: React.ReactNode;
  status?: string;
}

export interface NicCode {
  code: string;
  description: string;
  category?: string;
  subtext?: string;
  [key: string]: string | undefined;
}

export interface EligibilityChecks {
  age: boolean;
  turnover: boolean;
  innovation: boolean;
}
