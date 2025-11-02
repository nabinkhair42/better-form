"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FieldPropertySectionProps } from "./types";

type Props = FieldPropertySectionProps;

export function ValidationBasicsSection({ field, onUpdate }: Props) {
  return (
    <div className="space-y-3">
      <Label>Validation</Label>
      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={field.validation?.required || false}
          onCheckedChange={(checked) =>
            onUpdate({
              validation: {
                ...field.validation,
                required: checked,
              },
            })
          }
        />
        <Label htmlFor="required" className="text-sm">
          Required
        </Label>
      </div>

      {(field.type === "input" || field.type === "textarea") && (
        <>
          <div className="space-y-2">
            <Label htmlFor="min-length">Min Length</Label>
            <Input
              id="min-length"
              type="number"
              value={field.validation?.min || ""}
              onChange={(e) =>
                onUpdate({
                  validation: {
                    ...field.validation,
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
              value={field.validation?.max || ""}
              onChange={(e) =>
                onUpdate({
                  validation: {
                    ...field.validation,
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
