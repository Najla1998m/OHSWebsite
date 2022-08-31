import { PollApproval } from './poll-approva.model';

export interface PollItem {
  id: number;
  name: string;
  isVisitable: boolean;
  pollId: number;
}
