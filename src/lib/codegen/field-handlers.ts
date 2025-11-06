import { buildSchemaForField } from "@/lib/codegen//schema-builders";
import { applyOptional } from "@/lib/codegen//utils";
import type { FieldHandlerContext, FieldHandlerResult } from "@/types/codegen";
import type { FormField } from "@/types/form";

export function handleField({
  field,
}: FieldHandlerContext): FieldHandlerResult {
  const schema = applyOptional(buildSchemaForField(field), field);
  const component = buildComponent(field);

  return {
    schema,
    component,
  };
}

function buildComponent(field: FormField): string {
  switch (field.type) {
    case "input":
      return `<Input type="${field.inputType || "text"}" placeholder="${
        field.placeholder || ""
      }" {...field} />`;
    case "textarea":
      return `<Textarea placeholder="${field.placeholder || ""}" {...field} />`;
    case "select":
      return buildSelectComponent(field);
    case "checkbox":
      return `<div className="flex items-center space-x-2">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  <Label>${field.label}</Label>
                </div>`;
    case "radio":
      return buildRadioComponent(field);
    case "switch":
      return `<div className="flex items-center space-x-2">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  <Label>${field.label}</Label>
                </div>`;
    case "phone":
      return `<PhoneInput value={field.value} onChange={field.onChange} />`;
    case "country":
      return `<CountryDropdown defaultValue={field.value} onChange={(country) => field.onChange(country.alpha3)} />`;
    default:
      return `<Input placeholder="${field.placeholder || ""}" {...field} />`;
  }
}

function buildSelectComponent(field: FormField): string {
  const selectOptions =
    field.options
      ?.map(
        (opt) =>
          `                    <SelectItem value="${opt.value}">${opt.label}</SelectItem>`,
      )
      .join("\n") || "";

  return `<Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="${
                      field.placeholder || "Select an option"
                    }" />
                  </SelectTrigger>
                  <SelectContent>
${selectOptions}
                  </SelectContent>
                </Select>`;
}

function buildRadioComponent(field: FormField): string {
  const radioOptions =
    field.options
      ?.map(
        (opt) =>
          `                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="${opt.value}" />
                      <Label>${opt.label}</Label>
                    </div>`,
      )
      .join("\n") || "";

  return `<RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
${radioOptions}
                </RadioGroup>`;
}
