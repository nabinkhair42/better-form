import type { FormField } from "@/types/form";

function buildInputSchema(field: FormField): string {
  if (field.inputType === "email") {
    const preset = field.validation?.email?.preset || "standard";
    if (preset === "standard") {
      return "z.string().email()";
    }
    if (preset === "rfc5322") {
      return "z.string().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$/)";
    }
    if (preset === "custom" && field.validation?.email?.pattern) {
      const message = field.validation?.email?.message || "Invalid email";
      return `z.string().regex(new RegExp(${JSON.stringify(
        field.validation.email.pattern,
      )}), ${JSON.stringify(message)})`;
    }
    return "z.string().email()";
  }

  if (field.inputType === "password") {
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
      return schema;
    }

    let rules = {
      upper: false,
      lower: false,
      num: false,
      special: false,
    };

    if (preset === "medium") {
      rules = { upper: false, lower: true, num: true, special: false };
    } else if (preset === "strong") {
      rules = { upper: true, lower: true, num: true, special: true };
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

    const message = pwd.message || "Password does not meet requirements";
    if (parts.length > 0) {
      const pattern = `^${parts.join("")}.+$`;
      schema += `.regex(new RegExp(${JSON.stringify(
        pattern,
      )}), ${JSON.stringify(message)})`;
    }

    return schema;
  }

  if (field.inputType === "number") {
    const num = field.validation?.number || {};
    let schema = "z.coerce.number()";
    if (typeof num.min === "number") schema += `.min(${num.min})`;
    if (typeof num.max === "number") schema += `.max(${num.max})`;
    if (num.integer) schema += `.int()`;
    return schema;
  }

  if (field.inputType === "url") {
    const url = field.validation?.url || {};
    if (url.preset === "custom" && url.pattern) {
      const message = url.message || "Invalid URL";
      return `z.string().regex(new RegExp(${JSON.stringify(
        url.pattern,
      )}), ${JSON.stringify(message)})`;
    }
    return "z.string().url()";
  }

  return buildDefaultStringSchema(field);
}

function buildTextareaSchema(field: FormField): string {
  return buildDefaultStringSchema(field);
}

function buildChoiceSchema(field: FormField): string {
  if (field.options && field.options.length > 0) {
    const enumValues = field.options
      .map((opt) => `"${opt.value}"`)
      .join(", ");
    return `z.enum([${enumValues}])`;
  }
  return "z.string()";
}

function buildPhoneSchema(field: FormField): string {
  const phone = field.validation?.phone || {};
  if (phone.preset === "custom" && phone.pattern) {
    const message = phone.message || "Invalid phone number";
    return `z.string().regex(new RegExp(${JSON.stringify(
      phone.pattern,
    )}), ${JSON.stringify(message)})`;
  }
  return "z.string().regex(/^\\+?[1-9]\\d{1,14}$/, 'Invalid phone number (E.164)')";
}

function buildDefaultStringSchema(field: FormField): string {
  let schema = "z.string()";
  if (field.validation?.min) {
    schema += `.min(${field.validation.min})`;
  }
  if (field.validation?.max) {
    schema += `.max(${field.validation.max})`;
  }
  if (field.validation?.pattern) {
    schema += `.regex(new RegExp(${JSON.stringify(field.validation.pattern)}))`;
  }
  return schema;
}

export function buildSchemaForField(field: FormField): string {
  switch (field.type) {
    case "input":
      return buildInputSchema(field);
    case "textarea":
      return buildTextareaSchema(field);
    case "select":
    case "radio":
      return buildChoiceSchema(field);
    case "checkbox":
    case "switch":
      return "z.boolean()";
    case "country":
      return "z.string().regex(/^[A-Z]{3}$/, 'Invalid country code (alpha-3)')";
    case "phone":
      return buildPhoneSchema(field);
    default:
      return buildDefaultStringSchema(field);
  }
}
