"use client";

import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { FieldPropertySectionProps } from "./types";

type Props = FieldPropertySectionProps;

export function EmailSection({ field, onUpdate }: Props) {
  if (!(field.type === "input" && field.inputType === "email")) {
    return null;
  }
  return (
    <div className="space-y-2">
      <Label htmlFor="email-preset">Email Validation</Label>
      <Select
        value={field.validation?.email?.preset || "standard"}
        onValueChange={(preset: "standard" | "rfc5322" | "custom") =>
          onUpdate({
            validation: {
              ...field.validation,
              email: { ...field.validation?.email, preset },
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

      {field.validation?.email?.preset === "custom" && (
        <div className="space-y-2">
          <Input
            placeholder="Custom regex pattern"
            value={field.validation?.email?.pattern || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...field.validation,
                  email: {
                    ...field.validation?.email,
                    pattern: e.target.value,
                  },
                },
              })
            }
          />
          <Input
            placeholder="Error message (optional)"
            value={field.validation?.email?.message || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...field.validation,
                  email: {
                    ...field.validation?.email,
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
