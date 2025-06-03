export interface FormErrors {
  name?: string;
  [key: string]: string | undefined; // For dynamic errors
}

export interface FormInstance {
  editableContent: string;
  $el: HTMLElement;
}

export interface FormSelectOption {
  id: string;
  name: string;
}

export interface FormProps {
  content?: any;
  description?: string;
  errors?: FormErrors;
  hasMargin?: boolean;
  isRequired?: boolean;
  labelId: string;
  labelName: string;
  optionName?: string;
  options?: array<FormSelectOption>;
  placeholder?: string;
  type?: string;
}
