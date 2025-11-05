import type { FormField } from "@/types/form";

export type ImportNeedKey =
  | "Button"
  | "Form"
  | "FormControl"
  | "FormField"
  | "FormItem"
  | "FormLabel"
  | "FormMessage"
  | "Input"
  | "Textarea"
  | "Select"
  | "SelectContent"
  | "SelectItem"
  | "SelectTrigger"
  | "SelectValue"
  | "Checkbox"
  | "RadioGroup"
  | "RadioGroupItem"
  | "Switch"
  | "Label"
  | "PhoneInput"
  | "CountryDropdown";

export type ImportNeeds = Record<ImportNeedKey, boolean>;

export type SchemaFieldPlan = {
  id: string;
  label: string;
  schema: string;
};

export type FieldRenderPlan = {
  component: string;
  showLabel: boolean;
  defaultValueSnippet: string;
};

export type FieldPlan = SchemaFieldPlan & FieldRenderPlan & {
  formFieldSnippet: string;
};

export type FormAnalysis = {
  componentName: string;
  fields: FieldPlan[];
  importNeeds: ImportNeeds;
};

export type FieldHandlerContext = {
  field: FormField;
  importNeeds: ImportNeeds;
};

export type FieldHandlerResult = {
  schema: string;
  component: string;
  defaultValueSnippet?: string;
  showLabelOverride?: boolean;
};

export type GeneratedFile = {
  id: string;
  label: string;
  description?: string;
  language: "typescript" | "tsx";
  path: string;
  displayPath: string;
  code: string;
};

export type FilePlan = {
  schema: GeneratedFile;
  form: GeneratedFile;
  customComponents: GeneratedFile[];
};
