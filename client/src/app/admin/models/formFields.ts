import { DropDownForm } from './DropDownForm';
import { FormFileType } from './formFileType';
import { MainForm } from './MainForm';

export interface FormFields {
  id: number;
  name: string;
  displayNameAr: string;
  displayNameEn: string;
  defaultValue: string;
  value: string;
  formOptionSetId: number;
  formOptionSet: DropDownForm;
  formItemTypeId: number;
  formItemType: FormFileType;
  formId: number;
  form: MainForm;
}
