import { MiniUser } from './profile';

export interface Post {
  id: number;
  title: string;
  content: string;
  photo: string | null;
  user: MiniUser;
  created: string;
  likes: MiniUser[];
  shares: MiniUser[];
  comments: number;
  views: number;
}

export interface CreatePost {
  title: string;
  content: string;
  photo: string;
}

export interface Comment{
    id: number;
    content: string;
    user: MiniUser;
    created: string;
}