export class VariableDto {
  _id: string;
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  createdAt: Date;
  updatedAt: Date;
}
