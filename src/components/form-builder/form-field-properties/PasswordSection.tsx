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
import { FieldPropertySectionProps } from "./types";

type Props = FieldPropertySectionProps;

export function PasswordSection({ field, onUpdate }: Props) {
  if (!(field.type === "input" && field.inputType === "password")) {
    return null;
  }
  return (
    <div className="space-y-2">
      <Label htmlFor="password-preset">Password Policy</Label>
      <Select
        value={field.validation?.password?.preset || "medium"}
        onValueChange={(preset: "weak" | "medium" | "strong" | "custom") =>
          onUpdate({
            validation: {
              ...field.validation,
              password: { ...field.validation?.password, preset },
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
          <SelectItem value="strong">
            Strong (upper + lower + number + special)
          </SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="pwd-min">Min Length</Label>
          <Input
            id="pwd-min"
            type="number"
            value={field.validation?.password?.minLength || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...field.validation,
                  password: {
                    ...field.validation?.password,
                    minLength: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
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
                checked={field.validation?.password?.requireUppercase || false}
                onCheckedChange={(checked) =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      password: {
                        ...field.validation?.password,
                        requireUppercase: checked || undefined,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="pwd-upper" className="text-sm">
                Uppercase
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="pwd-lower"
                checked={field.validation?.password?.requireLowercase || false}
                onCheckedChange={(checked) =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      password: {
                        ...field.validation?.password,
                        requireLowercase: checked || undefined,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="pwd-lower" className="text-sm">
                Lowercase
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="pwd-number"
                checked={field.validation?.password?.requireNumber || false}
                onCheckedChange={(checked) =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      password: {
                        ...field.validation?.password,
                        requireNumber: checked || undefined,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="pwd-number" className="text-sm">
                Number
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="pwd-special"
                checked={field.validation?.password?.requireSpecial || false}
                onCheckedChange={(checked) =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      password: {
                        ...field.validation?.password,
                        requireSpecial: checked || undefined,
                      },
                    },
                  })
                }
              />
              <Label htmlFor="pwd-special" className="text-sm">
                Special
              </Label>
            </div>
          </div>
        </div>
      </div>

      {field.validation?.password?.preset === "custom" && (
        <div className="space-y-2">
          <Input
            placeholder="Custom regex pattern"
            value={field.validation?.password?.pattern || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...field.validation,
                  password: {
                    ...field.validation?.password,
                    pattern: e.target.value,
                  },
                },
              })
            }
          />
          <Input
            placeholder="Error message (optional)"
            value={field.validation?.password?.message || ""}
            onChange={(e) =>
              onUpdate({
                validation: {
                  ...field.validation,
                  password: {
                    ...field.validation?.password,
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
