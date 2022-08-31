export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  isActive: boolean;
  userRoles: any;
  userDepartments: any;
}
