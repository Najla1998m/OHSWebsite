import { UserDetails } from '../../shared/models/user-details';
import { PollItem } from './poll-item.model';
import { Poll } from './poll.model';

export interface PollApproval {
  id: number;
  appUserId: string;
  appUser: UserDetails;
  pollItemId: number;
  pollItem: PollItem;
  actionTaken: boolean;
  date: string;
  poll: Poll;
  pollId: number;
}
