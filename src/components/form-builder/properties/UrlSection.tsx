"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/types/form";

type Props = {
  selectedField: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
};

export function UrlSection({ selectedField, onUpdate }: Props) {
  if (!(selectedField.type === "input" && selectedField.inputType === "url")) {
    return null;
  }
  return (
    <div className="space-y-2">
      <Label>URL Validation</Label>
      <Select
        value={selectedField.validation?.url?.preset || "standard"}
        onValueChange={(preset: "standard" | "custom") =>
          onUpdate({
            validation: {
              ...selectedField.validation,
              url: { ...selectedField.validation?.url, preset },
            },
          })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose preset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard (.url())</SelectItem>
          <SelectItem value="custom">Custom regex</SelectItem>
        </SelectContent>
      </Select>
      {selectedField.validation?.url?.preset === "custom" && (
        <div className="space-y-2">
          <Input
            placeholder="Custom regex pattern"
            value={selectedField.validation?.url?.pattern || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...selectedField.validation,
                  url: { ...selectedField.validation?.url, pattern: e.target.value },
                },
              })
            }
          />
          <Input
            placeholder="Error message (optional)"
            value={selectedField.validation?.url?.message || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...selectedField.validation,
                  url: { ...selectedField.validation?.url, message: e.target.value },
                },
              })
            }
          />
        </div>
      )}
    </div>
  );
}


