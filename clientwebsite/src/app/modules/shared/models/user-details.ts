import { Attachment } from './attachment';
import { Company } from './company';
import { UserDepartments } from './userDepartments';
import { UserRoles } from './userRoles';

export interface UserDetails {
  user: {
    allAttachmentsUploaded: false;
    company: Company;
    email: string;
    fullName: string;
    id: string;
    isActive: boolean;
    isTeamManager: boolean;
    isVerified: boolean;
    password: string;
    phoneNumber: string;
    userDepartments: UserDepartments[];
    userRoles: UserRoles[];
    username: 'mme12346920@gmail.com';
    userPhoto: string;
  };
  attachmentWithSubscriptionTypeId: {
    attachment: Attachment;
    subscriptionTypeId: number;
  }[];
}
