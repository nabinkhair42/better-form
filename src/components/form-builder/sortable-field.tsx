'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '@/types/form';
import { useFormStore } from '@/store/form-store';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { FieldRenderer } from './field-renderer';

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
        relative group rounded-lg p-4 bg-background/50
        ${isDragging ? 'opacity-50' : ''}
        ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-primary/5'}
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