import { PollItem } from './poll-item.model';
import { Poll } from './poll.model';

export interface PollItemAction {
  id: number;
  name: string;
  pollItem: PollItem;
  priority: number;
  effect: number;
  taskLevelId: number;
  tasksLevel: any;
  tasksId: number;
  tasks: any;
  orderId: number;
  order: any;
  date: string;
  isVisible: boolean;
  poll: Poll;
  pollId: number;
}
