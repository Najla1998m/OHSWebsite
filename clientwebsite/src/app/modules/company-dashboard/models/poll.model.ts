import { Company } from '../../shared/models/company';
import { PollApproval } from './poll-approva.model';
import { PollDetail } from './poll-detail.model';
import { PollItemAction } from './poll-item-action.model';
import { PollItem } from './poll-item.model';

export interface Poll {
  id: number;
  name: string;
  date: string;
  totalEmployees: number;
  companyId: number;
  company: Company;
  pollItems: PollItem;
  pollDetails: PollDetail;
  pollItemAction: PollItemAction;
  pollApproval: PollApproval;
}
