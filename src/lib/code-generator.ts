import { FormConfig, type FormField } from "@/types/form";
import { handleField } from "./codegen/field-handlers";
import { buildImportBlock } from "./codegen/imports";
import type { FieldPlan, FormAnalysis, ImportNeeds } from "./codegen/types";
import {
  applyBaseFormImports,
  buildFormFieldSnippet,
  createInitialImportNeeds,
  getDefaultValueSnippet,
  sanitizeComponentName,
  shouldShowLabel,
} from "./codegen/utils";

export function generateZodSchema(formConfig: FormConfig): string {
  const analysis = analyzeForm(formConfig);
  const imports = `import { z } from 'zod';`;

  const schemaFields = analysis.fields
    .map((field) => `  ${field.id}: ${field.schema}, // ${field.label}`)
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
  const analysis = analyzeForm(formConfig);
  const imports = buildImportBlock(analysis.importNeeds);

  const defaultValues = analysis.fields
    .map((field) => field.defaultValueSnippet)
    .join("\n");

  const formFields = analysis.fields
    .map((field) => field.formFieldSnippet)
    .join("\n");

  const component = `
export function ${analysis.componentName}Form() {
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

function analyzeForm(formConfig: FormConfig): FormAnalysis {
  const importNeeds = createInitialImportNeeds();
  const fields = formConfig.fields.map((field) =>
    analyzeField(field, importNeeds),
  );

  return {
    componentName: sanitizeComponentName(formConfig.name),
    fields,
    importNeeds,
  };
}

function analyzeField(field: FormField, importNeeds: ImportNeeds): FieldPlan {
  applyBaseFormImports(field, importNeeds);

  const { schema, component, defaultValueSnippet, showLabelOverride } =
    handleField({
      field,
      importNeeds,
    });

  const resolvedDefault =
    defaultValueSnippet !== undefined
      ? defaultValueSnippet
      : getDefaultValueSnippet(field);

  const showLabel = showLabelOverride ?? shouldShowLabel(field);
  const formFieldSnippet = buildFormFieldSnippet(field, component, showLabel);

  return {
    id: field.id,
    label: field.label,
    schema,
    component,
    showLabel,
    defaultValueSnippet: resolvedDefault,
    formFieldSnippet,
  };
}

