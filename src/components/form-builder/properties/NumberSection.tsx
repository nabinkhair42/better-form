"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/types/form";

type Props = {
  selectedField: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
};

export function NumberSection({ selectedField, onUpdate }: Props) {
  if (!(selectedField.type === "input" && selectedField.inputType === "number")) {
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
            value={selectedField.validation?.number?.min ?? ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...selectedField.validation,
                  number: {
                    ...selectedField.validation?.number,
                    min: e.target.value === "" ? undefined : Number(e.target.value),
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
            value={selectedField.validation?.number?.max ?? ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...selectedField.validation,
                  number: {
                    ...selectedField.validation?.number,
                    max: e.target.value === "" ? undefined : Number(e.target.value),
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
          checked={selectedField.validation?.number?.integer || false}
          onCheckedChange={(checked) =>
            onUpdate({
              validation: {
                ...selectedField.validation,
                number: {
                  ...selectedField.validation?.number,
                  integer: checked || undefined,
                },
              },
            })
          }
        />
        <Label htmlFor="num-int" className="text-sm">Integer only</Label>
      </div>
    </div>
  );
}


