/**
 * Defines the structure of a variable.
 */
export interface Variable {
  /**
   * The name of the variable within the scope (inputs or outputs).
   */
  name: string;

  /**
   * The expected data type of the variable (e.g., 'string', 'number', 'object', 'boolean', 'array', 'any').
   */
  type: string;

  /**
   * Optional description of the variable's purpose or content.
   */
  description?: string;

  /**
   * Optional: Indicates if this variable is required.
   */
  required?: boolean;

  /**
   * Optional: Default value for the variable if not provided.
   */
  defaultValue?: any;


  /**
   * Optional: Reference link to system variable
   */
  systemRef?: string

  /**
   * Optional: For enum type, comma-separated string
   */
  enumOptions?: string[];
  // Add validation rules, example values, etc., if needed
  // validation?: object;
  // example?: any;
}

export enum DocumentStatus {
  COMPLETED = 'completed',
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  FAILED = 'failed'
}
