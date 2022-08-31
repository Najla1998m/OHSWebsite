import { Department } from './department';

export interface UserDepartments {
  id: number;
  name: string;
  correspondingDeptId: number;
  departement: Department;
  departementId: number;
  userId: any;
}
