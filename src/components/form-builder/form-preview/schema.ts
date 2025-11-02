import { FormConfig, FormField } from "@/types/form";
import { z, ZodTypeAny } from "zod";

// Phone pattern matches E.164 numbers (used by the preview form validation)
const PHONE_PATTERN = /^\+?[1-9]\d{1,14}$/;

function createStringSchema(field: FormField) {
  let schema = z.string();

  if (field.validation?.min) {
    schema = schema.min(field.validation.min);
  }

  if (field.validation?.max) {
    schema = schema.max(field.validation.max);
  }

  return schema;
}

function createNumberSchema(field: FormField) {
  let schema = z.coerce.number();
  const rules = field.validation?.number;

  if (rules?.min !== undefined) {
    schema = schema.refine((value) => value >= rules.min!, {
      message: `Must be at least ${rules.min}`,
    });
  }

  if (rules?.max !== undefined) {
    schema = schema.refine((value) => value <= rules.max!, {
      message: `Must be at most ${rules.max}`,
    });
  }

  if (rules?.integer) {
    schema = schema.refine((value) => Number.isInteger(value), {
      message: "Must be an integer",
    });
  }

  return schema;
}

function createBaseSchema(field: FormField): ZodTypeAny {
  switch (field.type) {
    case "input": {
      if (field.inputType === "email") {
        return z.string().email();
      }

      if (field.inputType === "url") {
        return z.string().url();
      }

      if (field.inputType === "number") {
        return createNumberSchema(field);
      }

      return createStringSchema(field);
    }

    case "textarea":
      return createStringSchema(field);

    case "select":
    case "radio":
      return z.string();

    case "checkbox":
    case "switch":
      return z.boolean();

    case "phone":
      return z.string().regex(PHONE_PATTERN, "Invalid phone number");

    case "country":
      return z.string().min(1, "Please select a country");

    default:
      return z.string();
  }
}

function applyRequirement(schema: ZodTypeAny, field: FormField) {
  if (!field.validation?.required) {
    return schema.optional();
  }

  if (field.type === "checkbox" || field.type === "switch") {
    return schema.refine((value) => value === true, {
      message: `${field.label} is required`,
    });
  }

  return schema;
}

export function buildFormSchema(formConfig: FormConfig) {
  const shape: Record<string, ZodTypeAny> = {};

  for (const field of formConfig.fields) {
    const base = createBaseSchema(field);
    shape[field.id] = applyRequirement(base, field);
  }

  return z.object(shape);
}

export function buildDefaultValues(formConfig: FormConfig) {
  return formConfig.fields.reduce((acc, field) => {
    if (field.type === "checkbox" || field.type === "switch") {
      acc[field.id] = (field.defaultValue as boolean) ?? false;
      return acc;
    }

    if (field.type === "input" && field.inputType === "number") {
      acc[field.id] = (field.defaultValue as number) ?? undefined;
      return acc;
    }

    acc[field.id] = (field.defaultValue as string) ?? "";
    return acc;
  }, {} as Record<string, string | boolean | number | undefined>);
}
