import { Department } from './Department';

export interface Category {
  id: number;
  name: string;
  isVisible: boolean;
  forContact: boolean;
  forOrders: boolean;
  departementId: number;
  departement: Department;
  parentID: number;
  subCategories: any[];
}
