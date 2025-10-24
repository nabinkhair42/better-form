"use client";

import { Button } from "@/components/ui/button";
import { useFormStore } from "@/store/form-store";
import { FormField } from "@/types/form";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { FieldRenderer } from "./field-renderer";

interface SortableFieldProps {
  field: FormField;
}

export function SortableField({ field }: SortableFieldProps) {
  const { removeField, setSelectedField, selectedFieldId } = useFormStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedFieldId === field.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group
        ${isDragging ? "opacity-50" : "p-3 rounded"}
        ${isSelected ? "border rounded py-3" : "hover:bg-primary/5"}
        transition-colors
      `}
      onClick={() => setSelectedField(field.id)}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
        onClick={(e) => {
          e.stopPropagation();
          removeField(field.id);
        }}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>

      {/* Field Content */}
      <div className="pl-6 pr-10">
        <FieldRenderer field={field} />
      </div>
    </div>
  );
}
