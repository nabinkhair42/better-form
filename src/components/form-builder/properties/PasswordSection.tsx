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
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/types/form";

type Props = {
  selectedField: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
};

export function PasswordSection({ selectedField, onUpdate }: Props) {
  if (!(selectedField.type === "input" && selectedField.inputType === "password")) {
    return null;
  }
  return (
    <div className="space-y-2">
      <Label htmlFor="password-preset">Password Policy</Label>
      <Select
        value={selectedField.validation?.password?.preset || "medium"}
        onValueChange={(preset: "weak" | "medium" | "strong" | "custom") =>
          onUpdate({
            validation: {
              ...selectedField.validation,
              password: { ...selectedField.validation?.password, preset },
            },
          })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose policy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weak">Weak (length only)</SelectItem>
          <SelectItem value="medium">Medium (lowercase + number)</SelectItem>
          <SelectItem value="strong">Strong (upper + lower + number + special)</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="pwd-min">Min Length</Label>
          <Input
            id="pwd-min"
            type="number"
            value={selectedField.validation?.password?.minLength || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...selectedField.validation,
                  password: {
                    ...selectedField.validation?.password,
                    minLength: e.target.value ? parseInt(e.target.value) : undefined,
                  },
                },
              })
            }
            placeholder="e.g. 8"
          />
        </div>
        <div className="space-y-2">
          <Label>Character Requirements</Label>
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center gap-2">
              <Switch
                id="pwd-upper"
                checked={selectedField.validation?.password?.requireUppercase || false}
                onCheckedChange={(checked) =>
                  onUpdate({
                    validation: {
                      ...selectedField.validation,
                      password: {
                        ...selectedField.validation?.password,
                        requireUppercase: checked || undefined,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="pwd-upper" className="text-sm">Uppercase</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="pwd-lower"
                checked={selectedField.validation?.password?.requireLowercase || false}
                onCheckedChange={(checked) =>
                  onUpdate({
                    validation: {
                      ...selectedField.validation,
                      password: {
                        ...selectedField.validation?.password,
                        requireLowercase: checked || undefined,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="pwd-lower" className="text-sm">Lowercase</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="pwd-number"
                checked={selectedField.validation?.password?.requireNumber || false}
                onCheckedChange={(checked) =>
                  onUpdate({
                    validation: {
                      ...selectedField.validation,
                      password: {
                        ...selectedField.validation?.password,
                        requireNumber: checked || undefined,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="pwd-number" className="text-sm">Number</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="pwd-special"
                checked={selectedField.validation?.password?.requireSpecial || false}
                onCheckedChange={(checked) =>
                  onUpdate({
                    validation: {
                      ...selectedField.validation,
                      password: {
                        ...selectedField.validation?.password,
                        requireSpecial: checked || undefined,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="pwd-special" className="text-sm">Special</Label>
            </div>
          </div>
        </div>
      </div>

      {selectedField.validation?.password?.preset === "custom" && (
        <div className="space-y-2">
          <Input
            placeholder="Custom regex pattern"
            value={selectedField.validation?.password?.pattern || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...selectedField.validation,
                  password: {
                    ...selectedField.validation?.password,
                    pattern: e.target.value,
                  },
                },
              })
            }
          />
          <Input
            placeholder="Error message (optional)"
            value={selectedField.validation?.password?.message || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...selectedField.validation,
                  password: {
                    ...selectedField.validation?.password,
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


