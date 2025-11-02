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
import { FormField as FormBuilderField } from "@/types/form";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface LiveFieldControlProps {
  field: FormBuilderField;
  formField: ControllerRenderProps<FieldValues, string>;
}

// Renders a live, controlled form field for the preview pane.
export function LiveFieldControl({ field, formField }: LiveFieldControlProps) {
  switch (field.type) {
    case "input":
      return (
        <Input
          type={field.inputType || "text"}
          placeholder={field.placeholder}
          {...formField}
          value={(formField.value as string | number | undefined) ?? ""}
        />
      );

    case "textarea":
      return (
        <Textarea
          placeholder={field.placeholder}
          {...formField}
          value={(formField.value as string | undefined) ?? ""}
        />
      );

    case "select":
      return (
        <Select
          onValueChange={formField.onChange}
          defaultValue={(formField.value as string | undefined) ?? undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.placeholder} />
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
            checked={(formField.value as boolean | undefined) ?? false}
            onCheckedChange={formField.onChange}
          />
          <Label>{field.label}</Label>
        </div>
      );

    case "radio":
      return (
        <RadioGroup
          onValueChange={formField.onChange}
          defaultValue={(formField.value as string | undefined) ?? undefined}
        >
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} />
              <Label>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "switch":
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={(formField.value as boolean | undefined) ?? false}
            onCheckedChange={formField.onChange}
          />
          <Label>{field.label}</Label>
        </div>
      );

    case "phone":
      return (
        <PhoneInput
          value={(formField.value as string | undefined) ?? ""}
          onChange={formField.onChange}
        />
      );

    case "country":
      return (
        <CountryDropdown
          defaultValue={(formField.value as string | undefined) ?? undefined}
          onChange={(country) => formField.onChange(country.alpha3)}
        />
      );

    default:
      return <div className="text-muted-foreground">Unknown field type</div>;
  }
}
