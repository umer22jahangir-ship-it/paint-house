export interface Car {
  id: number;
  company: string;
  model: string;
  year: number;
}

export interface Color {
  id: number;
  car_id: number;
  color_name: string;
  paint_code: string;
}

export interface PaintAvailability {
  id: number;
  color_id: number;
  imported_available: number;
  china_available: number;
}

export interface PaintMatchResult {
  color_name: string;
  paint_code: string;
  imported_available: boolean;
  china_available: boolean;
}

export interface AdminColorRow {
  color_id: number;
  color_name: string;
  paint_code: string;
  imported_available: boolean;
  china_available: boolean;
  car_id: number;
  company: string;
  model: string;
  year: number;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  media_type: "image" | "video";
  media_url: string;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  company: string;
  model: string;
  year: string;
  created_at: string;
}

export interface PaintSearchParams {
  company: string;
  model: string;
  year: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  company?: string;
  model?: string;
  year?: string;
  message?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Review {
  id: number;
  name: string;
  car: string;
  rating: number;
  comment: string;
  created_at: string;
  approved: number;
}

