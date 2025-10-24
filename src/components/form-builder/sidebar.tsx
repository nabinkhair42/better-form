'use client';

import { FormFieldType } from '@/types/form';
import { useFormStore } from '@/store/form-store';
import { Button } from '@/components/ui/button';
import {
  Type,
  List,
  CheckSquare,
  Circle,
  FileText,
  ToggleLeft,
  Plus
} from 'lucide-react';

const fieldTypes = [
  {
    id: 'input',
    type: 'input' as FormFieldType,
    label: 'Text Input',
    description: 'Single line text input'
  },
  {
    id: 'textarea',
    type: 'textarea' as FormFieldType,
    label: 'Textarea',
    description: 'Multi-line text input'
  },
  {
    id: 'select',
    type: 'select' as FormFieldType,
    label: 'Select',
    description: 'Dropdown selection'
  },
  {
    id: 'checkbox',
    type: 'checkbox' as FormFieldType,
    label: 'Checkbox',
    description: 'Single checkbox'
  },
  {
    id: 'radio',
    type: 'radio' as FormFieldType,
    label: 'Radio Group',
    description: 'Multiple choice selection'
  },
  {
    id: 'switch',
    type: 'switch' as FormFieldType,
    label: 'Switch',
    description: 'Toggle switch'
  }
];

const getFieldIcon = (type: FormFieldType) => {
  switch (type) {
    case 'input':
      return Type;
    case 'textarea':
      return FileText;
    case 'select':
      return List;
    case 'checkbox':
      return CheckSquare;
    case 'radio':
      return Circle;
    case 'switch':
      return ToggleLeft;
    default:
      return Type;
  }
};

export function Sidebar() {
  const { addField } = useFormStore();

  const generateFieldId = () => `field-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  const handleAddField = (fieldType: typeof fieldTypes[0]) => {
    const newField = {
      id: generateFieldId(),
      type: fieldType.type,
      inputType: fieldType.type === 'input' ? 'text' as const : undefined,
      label: fieldType.label,
      placeholder: fieldType.type === 'input' ? 'Enter text...' :
                  fieldType.type === 'textarea' ? 'Enter text...' :
                  fieldType.type === 'select' ? 'Select an option' : undefined,
      defaultValue: fieldType.type === 'checkbox' || fieldType.type === 'switch' ? false : '',
      options: fieldType.type === 'select' || fieldType.type === 'radio' ? [
        { label: 'Option 1', value: 'option-1' },
        { label: 'Option 2', value: 'option-2' }
      ] : undefined,
      validation: {
        required: false
      }
    };

    addField(newField);
  };

  return (
    <div className="w-64 lg:w-72 border-r border-border bg-card p-4 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Form Fields
        </h3>
        <p className="text-sm text-muted-foreground">
          Click the + button to add fields to your form
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {fieldTypes.map((fieldType) => {
          const Icon = getFieldIcon(fieldType.type);
          return (
            <div
              key={fieldType.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{fieldType.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{fieldType.description}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAddField(fieldType)}
                className="h-8 w-8 p-0 hover:bg-primary/10 flex-shrink-0 ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}