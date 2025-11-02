import { FormField } from "@/types/form";

export type FieldPropertySectionProps = {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onLabelChange?: (value: string) => void;
};
