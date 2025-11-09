"use client";

import { FieldItem } from "@/components/builder/layout/field-item";
import { fieldTypes } from "@/components/builder/layout/field-properties/field-types";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { generateFieldId } from "@/lib/fields/field-utils";
import { useFormStore } from "@/stores/form-store";

export function Sidebar() {
  const { addField, formConfig } = useFormStore();

  const handleAddField = (fieldType: (typeof fieldTypes)[number]) => {
    const existingIds = formConfig.fields.map((f) => f.id);
    const fieldId = generateFieldId(fieldType.label, existingIds);

    const newField = {
      id: fieldId,
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
    <div className="flex h-full flex-col overflow-hidden border-r border-border bg-background w-64">
      <header className="border-b p-3">
        <h3 className="text-lg font-semibold text-foreground">Form Fields</h3>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {fieldTypes.map((fieldType) => (
          <FieldItem
            key={fieldType.id}
            item={fieldType}
            onAdd={handleAddField}
          />
        ))}
      </div>

      <footer className="border-t border-border p-3">
        <ThemeSwitcher />
      </footer>
    </div>
  );
}
