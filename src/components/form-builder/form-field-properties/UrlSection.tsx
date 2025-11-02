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
import { FieldPropertySectionProps } from "./types";

type Props = FieldPropertySectionProps;

export function UrlSection({ field, onUpdate }: Props) {
  if (!(field.type === "input" && field.inputType === "url")) {
    return null;
  }
  return (
    <div className="space-y-2">
      <Label>URL Validation</Label>
      <Select
        value={field.validation?.url?.preset || "standard"}
        onValueChange={(preset: "standard" | "custom") =>
          onUpdate({
            validation: {
              ...field.validation,
              url: { ...field.validation?.url, preset },
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
      {field.validation?.url?.preset === "custom" && (
        <div className="space-y-2">
          <Input
            placeholder="Custom regex pattern"
            value={field.validation?.url?.pattern || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...field.validation,
                  url: { ...field.validation?.url, pattern: e.target.value },
                },
              })
            }
          />
          <Input
            placeholder="Error message (optional)"
            value={field.validation?.url?.message || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...field.validation,
                  url: { ...field.validation?.url, message: e.target.value },
                },
              })
            }
          />
        </div>
      )}
    </div>
  );
}
