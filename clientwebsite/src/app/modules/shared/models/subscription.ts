import { Attachment } from './attachment';

export interface Subscription {
  subscriptionType: {
    id: number;
    name: string;
  };
  attachments: {
    attachments: Attachment[];
    subscriptionTypeAttachmentId: number;
    subscriptionTypeAttachmentMappingId: number;
  }[];
}
