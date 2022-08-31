export interface Package {
  id: number;
  name: string;
  symbol: string;
  isVisible: boolean;
  isDeleted: boolean;
  forVendors: boolean;
  forClients: boolean;
  employeesNumbers: number;
  duration: number;
  allowedDays: number;
  pricePerEmployee: number;
}
