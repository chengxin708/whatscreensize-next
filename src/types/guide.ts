export interface Guide {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: 'tv' | 'monitor' | 'general';
  reading_time: number;
  file_path: string;
  icon_name: string;
  gradient_from: string;
  gradient_to: string;
  sort_order: number;
  is_published: boolean;
}

export interface GuideListResponse {
  guides: Guide[];
}
