export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface BlogListResponse {
  data: BlogPost[];
  message: string;
  success: boolean;
}
