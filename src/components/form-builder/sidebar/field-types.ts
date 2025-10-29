import { FormFieldType } from "@/types/form";

export const fieldTypes = [
  {
    id: "input",
    type: "input" as FormFieldType,
    label: "Text Input",
    description: "Single line text input",
  },
  {
    id: "textarea",
    type: "textarea" as FormFieldType,
    label: "Textarea",
    description: "Multi-line text input",
  },
  {
    id: "select",
    type: "select" as FormFieldType,
    label: "Select",
    description: "Dropdown selection",
  },
  {
    id: "checkbox",
    type: "checkbox" as FormFieldType,
    label: "Checkbox",
    description: "Single checkbox",
  },
  {
    id: "radio",
    type: "radio" as FormFieldType,
    label: "Radio Group",
    description: "Multiple choice selection",
  },
  {
    id: "switch",
    type: "switch" as FormFieldType,
    label: "Switch",
    description: "Toggle switch",
  },
  {
    id: "phone",
    type: "phone" as FormFieldType,
    label: "Phone",
    description: "International phone input",
  },
  {
    id: "country",
    type: "country" as FormFieldType,
    label: "Country",
    description: "Country dropdown (ISO 3166)",
  },
];
