import { UserDetails } from '../../shared/models/user-details';
import { PollItem } from './poll-item.model';
import { Poll } from './poll.model';

export interface PollDetail {
  id: number;
  pollItemId: number;
  pollItem: PollItem;
  pollId: number;
  pollItemValue: boolean;
  poll: Poll;
  appUserId: string;
  appUser: UserDetails;
  date: string;
}
