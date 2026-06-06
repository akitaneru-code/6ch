export interface Thread {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  post_count: number;
  bump_at: string;
  is_archived: boolean;
  is_locked: boolean;
  posts?: Post[];
}

export interface Post {
  id: string;
  thread_id: string;
  name: string;
  email?: string;
  subject?: string;
  body: string;
  image_path?: string;
  image_name?: string;
  image_size?: number;
  image_width?: number;
  image_height?: number;
  created_at: string;
  ip_hash?: string;
  user_agent?: string;
  is_op: boolean;
}

export interface CreateThreadRequest {
  title: string;
  name?: string;
  email?: string;
  body: string;
  image?: Express.Multer.File;
}

export interface CreatePostRequest {
  name?: string;
  email?: string;
  subject?: string;
  body: string;
  image?: Express.Multer.File;
}
