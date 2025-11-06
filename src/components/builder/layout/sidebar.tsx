"use client";

import { FieldItem } from "@/components/builder/layout/field-properties/field-item";
import { fieldTypes } from "@/components/builder/layout/field-properties/field-types";
import { generateFieldId } from "@/lib/fields/field-utils";
import { useFormStore } from "@/store/form-store";

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
    <div className="w-64 lg:w-72 border-r border-border bg-popover h-full overflow-y-auto">
      <div className="flex flex-col gap-4">
        <header className="p-3 border-b h-[93px]">
          <h3 className="text-lg font-semibold text-foreground">Form Fields</h3>
          <p className="text-sm text-muted-foreground">
            Click the + button to add fields to your form
          </p>
        </header>

        <div className="flex flex-col gap-4 px-3">
          {fieldTypes.map((fieldType) => (
            <FieldItem
              key={fieldType.id}
              item={fieldType}
              onAdd={handleAddField}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
