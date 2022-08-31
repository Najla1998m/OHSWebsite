import { Package } from 'src/app/pages/packagesPage/package';
import { Subscription } from './subscription';

export interface AllUserDetails {
  jobTitle: string;
  userRoles: any;
  packageId: string;
  package: Package;
  subscriptionTypeId: number;
  subscriptionType: Subscription;
  isDateExpired: string;
  chargeDate: string;
  duration: number;
  employeesNumbers: number;
  packageAllowedDays: number;
  isActive: boolean;
  companyId: number;
  fullName: string;
  company: any;
  userDepartments: any;
  id: string;
  userName: string;
  email: string;
}
