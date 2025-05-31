export interface FormErrors {
  name?: string;
}

export interface FormProps {
  content?: any;
  description?: string;
  errors?: FormErrors;
  isRequired?: boolean;
  labelId: string;
  labelName: string;
  placeholder?: string;
  type?: string;
}
