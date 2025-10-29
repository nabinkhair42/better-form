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
import { Textarea } from "@/components/ui/textarea";
import { INPUT_TYPE_CATALOG } from "@/lib/fields-catalog";
import { FormField, InputType } from "@/types/form";

type Props = {
  selectedField: FormField;
  onLabelChange: (newLabel: string) => void;
  onUpdate: (updates: Partial<FormField>) => void;
};

export function GeneralSection({
  selectedField,
  onLabelChange,
  onUpdate,
}: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="field-label">Label</Label>
        <Input
          id="field-label"
          value={selectedField.label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Field label"
        />
      </div>

      {selectedField.type === "input" && (
        <div className="space-y-2">
          <Label htmlFor="input-type">Input Type</Label>
          <Select
            value={selectedField.inputType || "text"}
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

      {(selectedField.type === "input" ||
        selectedField.type === "textarea" ||
        selectedField.type === "select") && (
        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={selectedField.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder text"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="field-default">Default Value</Label>
        {selectedField.type === "textarea" ? (
          <Textarea
            id="field-default"
            value={String(selectedField.defaultValue ?? "")}
            onChange={(e) => onUpdate({ defaultValue: e.target.value })}
            placeholder="Default value"
          />
        ) : (
          <Input
            id="field-default"
            value={String(selectedField.defaultValue ?? "")}
            onChange={(e) => onUpdate({ defaultValue: e.target.value })}
            placeholder="Default value"
          />
        )}
      </div>
    </>
  );
}
