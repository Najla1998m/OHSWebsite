import { FormOptionSetItem } from './form-option-set-Item.ts';

export interface FormOptionSet {
  id: number;
  name: string;
  displayNameAr: string;
  displayNameEn: string;
  defaultValue: string;
  formOptionSetItems: FormOptionSetItem[];
}
