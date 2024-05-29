export interface Notification {
  id: string;
  topics: string[];
  title: string;
  data: any;
  body: string;
  seen: boolean;
  time: string;
}
