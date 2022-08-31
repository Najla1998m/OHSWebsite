import { User } from './user.model';

export interface Department {
  id: number;
  name: string;
  parentId: number;
  IsDeleted: boolean;
  correspondingDeptId: number;
  unitType: string;
  departementLocation: string;
  userDepartments: User[];
  companyId: any;
}
