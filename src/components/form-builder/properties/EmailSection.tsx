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

export function EmailSection({ selectedField, onUpdate }: Props) {
  if (!(selectedField.type === "input" && selectedField.inputType === "email")) {
    return null;
  }
  return (
    <div className="space-y-2">
      <Label htmlFor="email-preset">Email Validation</Label>
      <Select
        value={selectedField.validation?.email?.preset || "standard"}
        onValueChange={(preset: "standard" | "rfc5322" | "custom") =>
          onUpdate({
            validation: {
              ...selectedField.validation,
              email: { ...selectedField.validation?.email, preset },
            },
          })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose preset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard (.email())</SelectItem>
          <SelectItem value="rfc5322">RFC5322 (regex)</SelectItem>
          <SelectItem value="custom">Custom regex</SelectItem>
        </SelectContent>
      </Select>

      {selectedField.validation?.email?.preset === "custom" && (
        <div className="space-y-2">
          <Input
            placeholder="Custom regex pattern"
            value={selectedField.validation?.email?.pattern || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...selectedField.validation,
                  email: {
                    ...selectedField.validation?.email,
                    pattern: e.target.value,
                  },
                },
              })
            }
          />
          <Input
            placeholder="Error message (optional)"
            value={selectedField.validation?.email?.message || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...selectedField.validation,
                  email: {
                    ...selectedField.validation?.email,
                    message: e.target.value,
                  },
                },
              })
            }
          />
        </div>
      )}
    </div>
  );
}


