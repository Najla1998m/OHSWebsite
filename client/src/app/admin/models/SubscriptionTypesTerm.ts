import { subscriptionTypeDto } from './subscriptionType';

export interface SubscriptionTypesTermDto {
  id: number;
  subscriptionTypeId: number;
  termsContent: string;
  subscriptionType: subscriptionTypeDto;
}
