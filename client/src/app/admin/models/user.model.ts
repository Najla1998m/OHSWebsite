import { Role } from './role.model';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  isActive: boolean;
  userRoles: any;
  isTeamManager: boolean;
  userDepartments: any;
  departementId: number;
  subscriptionTypeId: any;
  companyId: any;
}
