import { Attachment } from './attachment';
import { UserDetails } from './user-details';

export interface Task {
  number: number;
  creatorId: string;
  assignedToId: string;
  assignedTo: any;
  departementId: number;
  description: string;
  tasksLevelId: number;
  tasksStatusId: number;
  companyId: number;
  extraFields: any;
  notificationTypeId: number;
  tasksAttachments: any;
  subscriptionAttachments: Attachment;
  formsId: number;
  taskLocation: any;
  id: number;
  createdAt: Date;
  creator: any;
  targetDate: string;
  targetTime: string;
  managementId: number;
  teamId: number;
}
