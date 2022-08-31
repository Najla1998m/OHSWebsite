import { Form } from './form';
import { FormItemType } from './form-Item-type';
import { FormOptionSet } from './form-option-set';

export interface FormItem {
  id: number;
  name: string;
  displayNameAr: string;
  displayNameEn: string;
  defaultValue: string;
  value: string;
  formOptionSetId: number;
  formOptionSet: FormOptionSet;
  formItemType: FormItemType;
  formId: number;
  form: Form;
}
