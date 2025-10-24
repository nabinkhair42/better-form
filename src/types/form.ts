export type FormFieldType =
  | "input"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "switch"
  | "custom";

export type InputType = 
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search";

export type ValidationRules = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
};

export type ConditionalRule = {
  fieldId: string;
  operator: "equals" | "not" | "gt" | "lt";
  value: any;
};

export type FormField = {
  id: string;
  type: FormFieldType;
  inputType?: InputType; // For input fields
  label: string;
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  validation?: ValidationRules;
  conditional?: ConditionalRule;
};

export type FormConfig = {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
};

export type DragItem = {
  id: string;
  type: FormFieldType;
  label: string;
};