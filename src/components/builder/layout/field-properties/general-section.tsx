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
import { Textarea } from "@/components/ui/shadcn/textarea";
import { INPUT_TYPE_CATALOG } from "@/lib/fields/fields-catalog";
import { InputType } from "@/types/form";
import { FieldPropertySectionProps } from "./types";

type Props = FieldPropertySectionProps & {
  onLabelChange: (newLabel: string) => void;
};

export function GeneralSection({ field, onLabelChange, onUpdate }: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="field-label">Label</Label>
        <Input
          id="field-label"
          value={field.label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Field label"
        />
      </div>

      {field.type === "input" && (
        <div className="space-y-2">
          <Label htmlFor="input-type">Input Type</Label>
          <Select
            value={field.inputType || "text"}
            onValueChange={(value: InputType) => onUpdate({ inputType: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select input type" />
            </SelectTrigger>
            <SelectContent>
              {INPUT_TYPE_CATALOG.map((meta) => (
                <SelectItem key={meta.type} value={meta.type}>
                  <div className="flex items-center gap-2">
                    <meta.icon className="h-4 w-4" />
                    <span>{meta.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(field.type === "input" ||
        field.type === "textarea" ||
        field.type === "select") && (
        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder text"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="field-default">Default Value</Label>
        {field.type === "textarea" ? (
          <Textarea
            id="field-default"
            value={String(field.defaultValue ?? "")}
            onChange={(e) => onUpdate({ defaultValue: e.target.value })}
            placeholder="Default value"
          />
        ) : (
          <Input
            id="field-default"
            value={String(field.defaultValue ?? "")}
            onChange={(e) => onUpdate({ defaultValue: e.target.value })}
            placeholder="Default value"
          />
        )}
      </div>
    </>
  );
}
