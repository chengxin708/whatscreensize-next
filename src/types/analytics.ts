export interface PageViewRequest {
  page_type: 'tv' | 'monitor' | 'guide';
  page_identifier: string | null;
  session_id: string;
}

export interface PageViewResponse {
  success: boolean;
  message?: string;
}
