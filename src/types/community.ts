export interface FounderUpdate {
  id: string;
  founder: string;
  company: string;
  update: string;
  type: string;
  category: string;
  time: string;
}

export interface PostDB {
  id: string;
  founder_name: string;
  company_name: string;
  content: string;
  type: string;
  category: string;
}
