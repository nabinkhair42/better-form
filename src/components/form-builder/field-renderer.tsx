"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/types/form";

interface FieldRendererProps {
  field: FormField;
}

export function FieldRenderer({ field }: FieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case "input":
        return (
          <Input
            type={field.inputType || "text"}
            placeholder={field.placeholder || "Enter text..."}
            defaultValue={field.defaultValue as string | undefined}
            disabled
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder || "Enter text..."}
            defaultValue={field.defaultValue as string | undefined}
            disabled
          />
        );

      case "select":
        return (
          <Select disabled>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={field.placeholder || "Select an option"}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              disabled
              defaultChecked={field.defaultValue as boolean | undefined}
            />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            disabled
            defaultValue={field.defaultValue as string | undefined}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.id}-${option.value}`}
                />
                <Label htmlFor={`${field.id}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.id}
              disabled
              defaultChecked={field.defaultValue as boolean | undefined}
            />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        );

      case "phone":
        return (
          <div className="flex">
            <PhoneInput
              disabled
              value={(field.defaultValue as string) || ""}
              onChange={() => {}}
              className="w-full"
            />
          </div>
        );

      case "country":
        return (
          <div className="flex">
            <CountryDropdown
              disabled
              defaultValue={field.defaultValue as string | undefined}
            />
          </div>
        );

      default:
        return <div className="text-muted-foreground">Unknown field type</div>;
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && field.type !== "switch" && (
        <Label className="text-sm font-medium">{field.label}</Label>
      )}
      {renderField()}
      {field.validation?.required && (
        <p className="text-xs text-muted-foreground">* Required</p>
      )}
    </div>
  );
}
