import { Attachment } from './attachment';

export interface subscriptionTypeDto {
  id: number;
  name: string;
}

export interface Subscription {
  subscriptionType: subscriptionTypeDto;
  attachment: {
    attachment: Attachment;
    subscriptionTypeAttachmentId: number;
  }[];
}
