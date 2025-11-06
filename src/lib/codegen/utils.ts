import type { ImportNeeds } from "@/types/codegen";
import type { FormField } from "@/types/form";

export function createInitialImportNeeds(): ImportNeeds {
  return {
    Button: true,
    Form: false,
    FormControl: false,
    FormField: false,
    FormItem: false,
    FormLabel: false,
    FormMessage: false,
    Input: false,
    Textarea: false,
    Select: false,
    SelectContent: false,
    SelectItem: false,
    SelectTrigger: false,
    SelectValue: false,
    Checkbox: false,
    RadioGroup: false,
    RadioGroupItem: false,
    Switch: false,
    Label: false,
    PhoneInput: false,
    CountryDropdown: false,
  };
}

export function applyBaseFormImports(
  field: FormField,
  importNeeds: ImportNeeds,
) {
  importNeeds.Form = true;
  importNeeds.FormControl = true;
  importNeeds.FormField = true;
  importNeeds.FormItem = true;
  importNeeds.FormMessage = true;

  if (shouldShowLabel(field)) {
    importNeeds.FormLabel = true;
  }

  switch (field.type) {
    case "input":
      importNeeds.Input = true;
      break;
    case "textarea":
      importNeeds.Textarea = true;
      break;
    case "select":
      importNeeds.Select = true;
      importNeeds.SelectContent = true;
      importNeeds.SelectItem = true;
      importNeeds.SelectTrigger = true;
      importNeeds.SelectValue = true;
      break;
    case "checkbox":
      importNeeds.Checkbox = true;
      importNeeds.Label = true;
      break;
    case "radio":
      importNeeds.RadioGroup = true;
      importNeeds.RadioGroupItem = true;
      importNeeds.Label = true;
      break;
    case "switch":
      importNeeds.Switch = true;
      importNeeds.Label = true;
      break;
    case "phone":
      importNeeds.PhoneInput = true;
      break;
    case "country":
      importNeeds.CountryDropdown = true;
      break;
    default:
      break;
  }
}

export function getDefaultValueSnippet(field: FormField): string {
  if (field.type === "checkbox" || field.type === "switch") {
    return `    ${field.id}: false,`;
  }

  if (field.type === "input" && field.inputType === "number") {
    const dv = field.defaultValue;
    const num = typeof dv === "number" ? dv : undefined;
    return `    ${field.id}: ${num === undefined ? "undefined" : num},`;
  }

  const defaultValue = field.defaultValue ?? "";
  return `    ${field.id}: ${JSON.stringify(defaultValue)},`;
}

export function buildFormFieldSnippet(
  field: FormField,
  component: string,
  showLabel: boolean,
): string {
  const labelLine = showLabel ? `<FormLabel>${field.label}</FormLabel>` : "";

  return `        <FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              ${labelLine}
              <FormControl>
                ${component}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
}

export function sanitizeComponentName(name: string): string {
  return name.replace(/\s+/g, "");
}

export function shouldShowLabel(field: FormField): boolean {
  return !(field.type === "checkbox" || field.type === "switch");
}

export function applyOptional(schema: string, field: FormField): string {
  if (!field.validation?.required) {
    return `${schema}.optional()`;
  }
  return schema;
}
