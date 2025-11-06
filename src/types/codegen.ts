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

export type FieldPlan = SchemaFieldPlan &
  FieldRenderPlan & {
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

/**
 * FilePlan represents all files that will be generated for a form.
 *
 * @property schema - The Zod validation schema file
 * @property form - The React form component file
 * @property customComponents - Custom components built on top of shadcn (not in shadcn registry)
 *                              Examples: phone-input, country-dropdown, file-upload, etc.
 *                              These are distributed as files in the registry, not as registryDependencies
 */
export type FilePlan = {
  schema: GeneratedFile;
  form: GeneratedFile;
  customComponents: GeneratedFile[];
};
