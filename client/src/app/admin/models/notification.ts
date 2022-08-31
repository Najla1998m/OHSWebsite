export interface Notification {
  id: number;
  date: Date;
  title: string;
  isRead: boolean;
  isDeleted: boolean;
  body: string;
  userId: string;
  user: string;
  notificationTypeId: number;
  notificationType: string;
}
