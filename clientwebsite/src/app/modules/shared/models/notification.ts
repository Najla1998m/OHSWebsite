import { Poll } from '../../company-dashboard/models/poll.model';
import { NotificationType } from './notification-type';
import { Task } from './task';
import { UserDetails } from './user-details';

export interface Notification {
  id: number;
  date: string;
  dateTime: string;
  title: string;
  body: string;
  isRead: boolean;
  isDeleted: boolean;
  userId: string;
  user: UserDetails;
  notificationTypeId: number;
  notificationType: NotificationType;
  tasksId: number;
  tasks: Task;
  pollId: number;
  poll: Poll;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unReadedCount: number;
  readedCount: number;
}
