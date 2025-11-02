"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FieldPropertySectionProps } from "./types";

type Props = FieldPropertySectionProps;

export function NumberSection({ field, onUpdate }: Props) {
  if (!(field.type === "input" && field.inputType === "number")) {
    return null;
  }
  return (
    <div className="space-y-2">
      <Label>Number Rules</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="num-min">Min</Label>
          <Input
            id="num-min"
            type="number"
            value={field.validation?.number?.min ?? ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...field.validation,
                  number: {
                    ...field.validation?.number,
                    min:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  },
                },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="num-max">Max</Label>
          <Input
            id="num-max"
            type="number"
            value={field.validation?.number?.max ?? ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...field.validation,
                  number: {
                    ...field.validation?.number,
                    max:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  },
                },
              })
            }
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="num-int"
          checked={field.validation?.number?.integer || false}
          onCheckedChange={(checked) =>
            onUpdate({
              validation: {
                ...field.validation,
                number: {
                  ...field.validation?.number,
                  integer: checked || undefined,
                },
              },
            })
          }
        />
        <Label htmlFor="num-int" className="text-sm">
          Integer only
        </Label>
      </div>
    </div>
  );
}
