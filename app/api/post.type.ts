import {DocumentPickerResponse} from 'react-native-document-picker';

export interface Post {
  id: string;
  author: string;
  description: string;
  files: DocumentPickerResponse[];
  users_liked: string[];
  createdAt: string;
  updatedAt: string;
}
