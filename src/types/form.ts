export type FormFieldType =
  | "input"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "switch"
  | "phone"
  | "country"
  | "custom";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "url"
  | "search";

export type ValidationRules = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
  // Email-specific validation (applies when inputType === "email")
  email?: {
    preset?: "standard" | "rfc5322" | "custom";
    pattern?: string; // used when preset === "custom"
    message?: string;
  };
  // Password-specific validation (applies when inputType === "password")
  password?: {
    preset?: "weak" | "medium" | "strong" | "custom";
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecial?: boolean;
    pattern?: string; // when preset === "custom"
    message?: string;
  };
  // Number-specific validation (applies when inputType === "number")
  number?: {
    integer?: boolean;
    min?: number;
    max?: number;
  };
  // URL-specific validation
  url?: {
    preset?: "standard" | "custom";
    pattern?: string;
    message?: string;
  };
  // Phone-specific validation (applies when type === "phone")
  phone?: {
    preset?: "e164" | "custom";
    pattern?: string;
    message?: string;
  };
};

export type ConditionalRule = {
  fieldId: string;
  operator: "equals" | "not" | "gt" | "lt";
  value: string | number | boolean;
};

export type FormField = {
  id: string;
  type: FormFieldType;
  inputType?: InputType; // For input fields
  label: string;
  placeholder?: string;
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
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
