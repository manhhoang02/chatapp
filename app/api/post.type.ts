import {MediaType} from 'app/store/homeStore';

export interface Post {
  id: string;
  author: string;
  description: string;
  files: MediaType[];
  users_liked: string[];
  createdAt: string;
  updatedAt: string;
}
