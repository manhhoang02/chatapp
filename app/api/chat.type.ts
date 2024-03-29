// Generated by https://quicktype.io

export interface ChatProps {
  _id: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage?: LastMessage;
}

export interface Member {
  _id: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
// Generated by https://quicktype.io

export interface LastMessage {
  _id: string;
  chatId: string;
  senderId: string;
  files: string[];
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
// Generated by https://quicktype.io

export interface ResMessages {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  sender: Sender;
  id: string;
}

export interface Sender {
  _id: string;
  first_name: string;
  last_name: string;
  avatar: null;
}
// Generated by https://quicktype.io

export interface ResSendMessage {
  chatId: string;
  senderId: string;
  text: string;
  files: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
