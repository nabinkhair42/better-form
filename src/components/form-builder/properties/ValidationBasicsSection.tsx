"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/types/form";

type Props = {
  selectedField: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
};

export function ValidationBasicsSection({ selectedField, onUpdate }: Props) {
  return (
    <div className="space-y-3">
      <Label>Validation</Label>
      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={selectedField.validation?.required || false}
          onCheckedChange={(checked) =>
            onUpdate({
              validation: {
                ...selectedField.validation,
                required: checked,
              },
            })
          }
        />
        <Label htmlFor="required" className="text-sm">
          Required
        </Label>
      </div>

      {(selectedField.type === "input" || selectedField.type === "textarea") && (
        <>
          <div className="space-y-2">
            <Label htmlFor="min-length">Min Length</Label>
            <Input
              id="min-length"
              type="number"
              value={selectedField.validation?.min || ""}
              onChange={(e) =>
                onUpdate({
                  validation: {
                    ...selectedField.validation,
                    min: e.target.value ? parseInt(e.target.value) : undefined,
                  },
                })
              }
              placeholder="Minimum length"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-length">Max Length</Label>
            <Input
              id="max-length"
              type="number"
              value={selectedField.validation?.max || ""}
              onChange={(e) =>
                onUpdate({
                  validation: {
                    ...selectedField.validation,
                    max: e.target.value ? parseInt(e.target.value) : undefined,
                  },
                })
              }
              placeholder="Maximum length"
            />
          </div>
        </>
      )}
    </div>
  );
}


