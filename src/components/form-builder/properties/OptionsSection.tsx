"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/form";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  selectedField: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
};

export function OptionsSection({ selectedField, onUpdate }: Props) {
  const needsOptions = selectedField.type === "select" || selectedField.type === "radio";
  if (!needsOptions) return null;

  const addOption = () => {
    const currentOptions = selectedField.options || [];
    const newOption = {
      label: `Option ${currentOptions.length + 1}`,
      value: `option-${currentOptions.length + 1}`,
    };
    onUpdate({ options: [...currentOptions, newOption] });
  };

  const removeOption = (index: number) => {
    const currentOptions = selectedField.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, field: "label" | "value", value: string) => {
    const currentOptions = selectedField.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = { ...newOptions[index], [field]: value } as { label: string; value: string };
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Options</Label>
        <Button variant="outline" size="sm" onClick={addOption} className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {(selectedField.options || []).map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Label"
              value={option.label}
              onChange={(e) => updateOption(index, "label", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={option.value}
              onChange={(e) => updateOption(index, "value", e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={() => removeOption(index)} className="h-10 w-10 p-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}


