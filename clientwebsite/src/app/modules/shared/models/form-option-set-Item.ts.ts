import { FormOptionSet } from './form-option-set';

export interface FormOptionSetItem {
  id: number;
  name: string;
  valueAR: string;
  valueEN: string;
  formOptionSetId: number;
  formOptionSet: FormOptionSet;
}
