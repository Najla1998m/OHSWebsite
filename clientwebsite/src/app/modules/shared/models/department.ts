import { User } from './User';

export interface Department {
  id: number;
  name: string;
  parentId: number;
  IsDeleted: boolean;
  correspondingDeptId: number;
  unitType: string;
  departementLocation: {
    address: string;
    longitude: number;
    latitude: number;
    zoom: number;
  };
  userDepartments: User[];
}
