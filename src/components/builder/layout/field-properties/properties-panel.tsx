"use client";

// Panel container imports only
import { EmailSection } from "@/components/builder/layout/field-properties/email-section";
import { GeneralSection } from "@/components/builder/layout/field-properties/general-section";
import { NumberSection } from "@/components/builder/layout/field-properties/number-section";
import { OptionsSection } from "@/components/builder/layout/field-properties/options-section";
import { PasswordSection } from "@/components/builder/layout/field-properties/password-section";
import { UrlSection } from "@/components/builder/layout/field-properties/url-section";
import { ValidationBasicsSection } from "@/components/builder/layout/field-properties/validation-basics-section";
import { generateFieldId } from "@/lib/fields/field-utils";
import { useFormStore } from "@/store/form-store";

export function PropertiesPanel() {
  const { formConfig, selectedFieldId, updateField } = useFormStore();

  const selectedField = formConfig.fields.find(
    (field) => field.id === selectedFieldId,
  );

  if (!selectedField) {
    return (
      <div className="w-64 lg:w-72 border-l border-border bg-card p-4 h-full">
        <div className="text-center text-muted-foreground mt-8">
          <p className="text-sm">Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleFieldUpdate = (updates: Partial<typeof selectedField>) => {
    updateField(selectedField.id, updates);
  };

  const handleLabelChange = (newLabel: string) => {
    const existingIds = formConfig.fields
      .filter((f) => f.id !== selectedField.id)
      .map((f) => f.id);
    const newId = generateFieldId(newLabel, existingIds);

    handleFieldUpdate({
      label: newLabel,
      id: newId,
    });
  };

  // Options manipulation moved into OptionsSection

  const needsOptions =
    selectedField.type === "select" || selectedField.type === "radio";

  return (
    <div className="w-64 lg:w-72 border-r border bg-sidebar h-full overflow-y-auto">
      <div className="p-3 border-b h-[93px]">
        <h3 className="text-lg font-semibold text-foreground">
          Field Properties
        </h3>
        <p className="text-sm text-muted-foreground capitalize">
          {selectedField.type} Field
        </p>
      </div>

      <div className="space-y-4 p-3">
        <GeneralSection
          field={selectedField}
          onLabelChange={handleLabelChange}
          onUpdate={handleFieldUpdate}
        />

        <EmailSection field={selectedField} onUpdate={handleFieldUpdate} />
        <PasswordSection field={selectedField} onUpdate={handleFieldUpdate} />
        <NumberSection field={selectedField} onUpdate={handleFieldUpdate} />
        <UrlSection field={selectedField} onUpdate={handleFieldUpdate} />

        {/* Options for Select and Radio */}
        {needsOptions && (
          <OptionsSection field={selectedField} onUpdate={handleFieldUpdate} />
        )}

        <ValidationBasicsSection
          field={selectedField}
          onUpdate={handleFieldUpdate}
        />
      </div>
    </div>
  );
}
