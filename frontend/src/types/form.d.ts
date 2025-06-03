export interface FormErrors {
  name?: string;
  [key: string]: string | undefined; // For dynamic errors
}

export interface FormInstance {
  editableContent: string;
  $el: HTMLElement;
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
