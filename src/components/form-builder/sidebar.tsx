"use client";

import { Button } from "@/components/ui/button";
import { useFormStore } from "@/store/form-store";
import { FormFieldType } from "@/types/form";
import {
  CheckSquare,
  Circle,
  FileText,
  List,
  Plus,
  ToggleLeft,
  Type,
} from "lucide-react";

const fieldTypes = [
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
];

const getFieldIcon = (type: FormFieldType) => {
  switch (type) {
    case "input":
      return Type;
    case "textarea":
      return FileText;
    case "select":
      return List;
    case "checkbox":
      return CheckSquare;
    case "radio":
      return Circle;
    case "switch":
      return ToggleLeft;
    default:
      return Type;
  }
};

export function Sidebar() {
  const { addField } = useFormStore();

  const handleAddField = (fieldType: (typeof fieldTypes)[0]) => {
    const generateFieldId = () =>
      `field-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    const newField = {
      id: generateFieldId(),
      type: fieldType.type,
      inputType: fieldType.type === "input" ? ("text" as const) : undefined,
      label: fieldType.label,
      placeholder:
        fieldType.type === "input"
          ? "Enter text..."
          : fieldType.type === "textarea"
          ? "Enter text..."
          : fieldType.type === "select"
          ? "Select an option"
          : undefined,
      defaultValue:
        fieldType.type === "checkbox" || fieldType.type === "switch"
          ? false
          : "",
      options:
        fieldType.type === "select" || fieldType.type === "radio"
          ? [
              { label: "Option 1", value: "option-1" },
              { label: "Option 2", value: "option-2" },
            ]
          : undefined,
      validation: {
        required: false,
      },
    };

    addField(newField);
  };

  return (
    <div className="w-64 lg:w-72 border-r border-border bg-popover h-full overflow-y-auto">
      <div className="flex flex-col gap-4">
        <header className="p-3 border-b h-[93px]">
          <h3 className="text-lg font-semibold text-foreground">Form Fields</h3>
          <p className="text-sm text-muted-foreground">
            Click the + button to add fields to your form
          </p>
        </header>

        <div className="flex flex-col gap-4 px-3">
          {fieldTypes.map((fieldType) => {
            const Icon = getFieldIcon(fieldType.type);
            return (
              <div
                key={fieldType.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {fieldType.label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {fieldType.description}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAddField(fieldType)}
                  className="h-7 w-7"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
