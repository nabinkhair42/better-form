import { FormFieldType } from "@/types/form";

export const fieldTypes = [
  {
    id: "input",
    type: "input" as FormFieldType,
    label: "Text Input",
  },
  {
    id: "textarea",
    type: "textarea" as FormFieldType,
    label: "Textarea",
  },
  {
    id: "select",
    type: "select" as FormFieldType,
    label: "Select",
  },
  {
    id: "checkbox",
    type: "checkbox" as FormFieldType,
    label: "Checkbox",
  },
  {
    id: "radio",
    type: "radio" as FormFieldType,
    label: "Radio Group",
  },
  {
    id: "switch",
    type: "switch" as FormFieldType,
    label: "Switch",
  },
  {
    id: "phone",
    type: "phone" as FormFieldType,
    label: "Phone",
  },
  {
    id: "country",
    type: "country" as FormFieldType,
    label: "Country",
  },
];
