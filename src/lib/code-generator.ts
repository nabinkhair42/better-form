import { FormConfig } from "@/types/form";

export function generateZodSchema(formConfig: FormConfig): string {
  const imports = `import { z } from 'zod';`;

  const schemaFields = formConfig.fields
    .map((field) => {
      let fieldSchema = "";

      switch (field.type) {
        case "input":
          // Handle input subtypes
          if (field.inputType === "email") {
            const preset = field.validation?.email?.preset || "standard";
            if (preset === "standard") {
              fieldSchema = "z.string().email()";
            } else if (preset === "rfc5322") {
              // RFC5322-ish regex (simplified)
              fieldSchema =
                "z.string().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$/)";
            } else if (
              preset === "custom" &&
              field.validation?.email?.pattern
            ) {
              const message =
                field.validation?.email?.message || "Invalid email";
              fieldSchema = `z.string().regex(new RegExp(${JSON.stringify(
                field.validation.email.pattern,
              )}), ${JSON.stringify(message)})`;
            } else {
              fieldSchema = "z.string().email()";
            }
          } else if (field.inputType === "password") {
            const pwd = field.validation?.password || {};
            const min = pwd.minLength || field.validation?.min;
            let schema = "z.string()";
            if (min) schema += `.min(${min})`;

            const requireUpper = pwd.requireUppercase;
            const requireLower = pwd.requireLowercase;
            const requireNum = pwd.requireNumber;
            const requireSpecial = pwd.requireSpecial;
            const preset = pwd.preset || "medium";

            if (preset === "custom" && pwd.pattern) {
              const message = pwd.message || "Invalid password";
              schema += `.regex(new RegExp(${JSON.stringify(
                pwd.pattern,
              )}), ${JSON.stringify(message)})`;
            } else {
              // Build lookahead-based regex according to requirements or preset
              let rules: {
                upper: boolean;
                lower: boolean;
                num: boolean;
                special: boolean;
              } = {
                upper: false,
                lower: false,
                num: false,
                special: false,
              };
              if (preset === "weak") {
                // only length enforced
              } else if (preset === "medium") {
                // lower + number
                rules = {
                  upper: false,
                  lower: true,
                  num: true,
                  special: false,
                };
              } else if (preset === "strong") {
                rules = {
                  upper: true,
                  lower: true,
                  num: true,
                  special: true,
                };
              }
              const effUpper = requireUpper ?? rules.upper;
              const effLower = requireLower ?? rules.lower;
              const effNum = requireNum ?? rules.num;
              const effSpecial = requireSpecial ?? rules.special;
              const parts: string[] = [];
              if (effUpper) parts.push("(?=.*[A-Z])");
              if (effLower) parts.push("(?=.*[a-z])");
              if (effNum) parts.push("(?=.*[0-9])");
              if (effSpecial) parts.push("(?=.*[^A-Za-z0-9])");
              const message =
                pwd.message || "Password does not meet requirements";
              if (parts.length > 0) {
                const pattern = `^${parts.join("")}.+$`;
                schema += `.regex(new RegExp(${JSON.stringify(
                  pattern,
                )}), ${JSON.stringify(message)})`;
              }
            }
            fieldSchema = schema;
          } else if (field.inputType === "number") {
            // Coerce to number
            const num = field.validation?.number || {};
            let schema = "z.coerce.number()";
            if (typeof num.min === "number") schema += `.min(${num.min})`;
            if (typeof num.max === "number") schema += `.max(${num.max})`;
            if (num.integer) schema += `.int()`;
            fieldSchema = schema;
          } else if (field.inputType === "url") {
            const url = field.validation?.url || {};
            if (url.preset === "custom" && url.pattern) {
              const message = url.message || "Invalid URL";
              fieldSchema = `z.string().regex(new RegExp(${JSON.stringify(
                url.pattern,
              )}), ${JSON.stringify(message)})`;
            } else {
              fieldSchema = "z.string().url()";
            }
          } else {
            fieldSchema = "z.string()";
            if (field.validation?.min) {
              fieldSchema += `.min(${field.validation.min})`;
            }
            if (field.validation?.max) {
              fieldSchema += `.max(${field.validation.max})`;
            }
            if (field.validation?.pattern) {
              fieldSchema += `.regex(new RegExp(${JSON.stringify(
                field.validation.pattern,
              )}))`;
            }
          }
          break;
        case "textarea":
          fieldSchema = "z.string()";
          if (field.validation?.min) {
            fieldSchema += `.min(${field.validation.min})`;
          }
          if (field.validation?.max) {
            fieldSchema += `.max(${field.validation.max})`;
          }
          if (field.validation?.pattern) {
            fieldSchema += `.regex(new RegExp(${JSON.stringify(
              field.validation.pattern,
            )}))`;
          }
          break;
        case "select":
        case "radio":
          if (field.options && field.options.length > 0) {
            const enumValues = field.options
              .map((opt) => `"${opt.value}"`)
              .join(", ");
            fieldSchema = `z.enum([${enumValues}])`;
          } else {
            fieldSchema = "z.string()";
          }
          break;
        case "checkbox":
        case "switch":
          fieldSchema = "z.boolean()";
          break;
        case "country":
          fieldSchema =
            "z.string().regex(/^[A-Z]{3}$/, 'Invalid country code (alpha-3)')";
          break;
        case "phone": {
          const phone = field.validation?.phone || {};
          if (phone.preset === "custom" && phone.pattern) {
            const message = phone.message || "Invalid phone number";
            fieldSchema = `z.string().regex(new RegExp(${JSON.stringify(
              phone.pattern,
            )}), ${JSON.stringify(message)})`;
          } else {
            fieldSchema =
              "z.string().regex(/^\\+?[1-9]\\d{1,14}$/, 'Invalid phone number (E.164)')";
          }
          break;
        }
        default:
          fieldSchema = "z.string()";
      }

      if (!field.validation?.required) {
        fieldSchema += ".optional()";
      }

      return `  ${field.id}: ${fieldSchema}, // ${field.label}`;
    })
    .join("\n");

  const schema = `
export const formSchema = z.object({
${schemaFields}
});

export type FormData = z.infer<typeof formSchema>;
`;

  return `${imports}\n${schema}`;
}

export function generateReactComponent(formConfig: FormConfig): string {
  // Determine required UI imports based on fields used
  const needs = {
    Button: true, // always for submit
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
  } as Record<string, boolean>;

  for (const f of formConfig.fields) {
    needs.Form =
      needs.FormControl =
      needs.FormField =
      needs.FormItem =
      needs.FormMessage =
        true;
    if (f.type !== "checkbox" && f.type !== "switch") needs.FormLabel = true;
    if (f.type === "input") needs.Input = true;
    if (f.type === "textarea") needs.Textarea = true;
    if (f.type === "select") {
      needs.Select =
        needs.SelectContent =
        needs.SelectItem =
        needs.SelectTrigger =
        needs.SelectValue =
          true;
    }
    if (f.type === "checkbox") needs.Checkbox = true;
    if (f.type === "radio") needs.RadioGroup = needs.RadioGroupItem = true;
    if (f.type === "switch") needs.Switch = true;
    if (f.type === "phone") needs.PhoneInput = true;
    if (f.type === "country") needs.CountryDropdown = true;
    if (f.type === "checkbox" || f.type === "switch" || f.type === "radio")
      needs.Label = true;
  }

  const formImports = [
    ...[
      "Form",
      "FormControl",
      "FormField",
      "FormItem",
      "FormLabel",
      "FormMessage",
    ].filter((k) => needs[k]),
  ].join(",\n  ");
  const selectImports = [
    ...[
      "Select",
      "SelectContent",
      "SelectItem",
      "SelectTrigger",
      "SelectValue",
    ].filter((k) => needs[k]),
  ].join(", ");

  const importLines = [
    `'use client';`,
    "",
    "import { useForm } from 'react-hook-form';",
    "import { zodResolver } from '@hookform/resolvers/zod';",
  ];
  if (needs.Button)
    importLines.push("import { Button } from '@/components/ui/button';");
  if (formImports)
    importLines.push(
      `import {\n  ${formImports}\n} from '@/components/ui/form';`,
    );
  if (needs.Input)
    importLines.push("import { Input } from '@/components/ui/input';");
  if (needs.Textarea)
    importLines.push("import { Textarea } from '@/components/ui/textarea';");
  if (selectImports)
    importLines.push(
      `import { ${selectImports} } from '@/components/ui/select';`,
    );
  if (needs.Checkbox)
    importLines.push("import { Checkbox } from '@/components/ui/checkbox';");
  if (needs.RadioGroup || needs.RadioGroupItem)
    importLines.push(
      "import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';",
    );
  if (needs.Switch)
    importLines.push("import { Switch } from '@/components/ui/switch';");
  if (needs.Label)
    importLines.push("import { Label } from '@/components/ui/label';");
  if (needs.PhoneInput)
    importLines.push(
      "import { PhoneInput } from '@/components/ui/phone-input';",
    );
  if (needs.CountryDropdown)
    importLines.push(
      "import { CountryDropdown } from '@/components/ui/country-dropdown';",
    );
  importLines.push("import { formSchema, FormData } from './schema';");

  const imports = importLines.join("\n");

  const defaultValues = formConfig.fields
    .map((field) => {
      // Checkbox/switch defaults to boolean false
      if (field.type === "checkbox" || field.type === "switch") {
        return `    ${field.id}: false,`;
      }
      // Number inputs: prefer numeric default; otherwise undefined to avoid NaN with z.coerce.number()
      if (field.type === "input" && field.inputType === "number") {
        const dv = field.defaultValue;
        const num = typeof dv === "number" ? dv : undefined;
        return `    ${field.id}: ${num === undefined ? "undefined" : num},`;
      }
      // Others default to provided value or empty string
      const defaultValue = field.defaultValue ?? "";
      return `    ${field.id}: ${JSON.stringify(defaultValue)},`;
    })
    .join("\n");

  const formFields = formConfig.fields
    .map((field) => {
      let fieldComponent = "";

      switch (field.type) {
        case "input":
          fieldComponent = `<Input type="${
            field.inputType || "text"
          }" placeholder="${field.placeholder || ""}" {...field} />`;
          break;
        case "textarea":
          fieldComponent = `<Textarea placeholder="${
            field.placeholder || ""
          }" {...field} />`;
          break;
        case "select":
          const selectOptions =
            field.options
              ?.map(
                (opt) =>
                  `                    <SelectItem value="${opt.value}">${opt.label}</SelectItem>`,
              )
              .join("\n") || "";
          fieldComponent = `<Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="${
                      field.placeholder || "Select an option"
                    }" />
                  </SelectTrigger>
                  <SelectContent>
${selectOptions}
                  </SelectContent>
                </Select>`;
          break;
        case "checkbox":
          fieldComponent = `<div className="flex items-center space-x-2">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  <Label>${field.label}</Label>
                </div>`;
          break;
        case "radio":
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
          fieldComponent = `<RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
${radioOptions}
                </RadioGroup>`;
          break;
        case "switch":
          fieldComponent = `<div className="flex items-center space-x-2">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  <Label>${field.label}</Label>
                </div>`;
          break;
        case "phone":
          fieldComponent = `<PhoneInput value={field.value} onChange={field.onChange} />`;
          break;
        case "country":
          fieldComponent = `<CountryDropdown defaultValue={field.value} onChange={(country) => field.onChange(country.alpha3)} />`;
          break;
      }

      const showLabel = field.type !== "checkbox" && field.type !== "switch";

      return `        <FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              ${showLabel ? `<FormLabel>${field.label}</FormLabel>` : ""}
              <FormControl>
                ${fieldComponent}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    })
    .join("\n");

  const component = `
export function ${formConfig.name.replace(/\s+/g, "")}Form() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
${defaultValues}
    },
  });

  function onSubmit(values: FormData) {
    console.log(values);
    // Handle form submission here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
${formFields}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}`;

  return `${imports}\n${component}`;
}

export function generateFormConfig(formConfig: FormConfig): string {
  return `export const formConfig = ${JSON.stringify(formConfig, null, 2)};`;
}
