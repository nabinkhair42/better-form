'use client';

import { useFormStore } from '@/store/form-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { InputType } from '@/types/form';

export function PropertiesPanel() {
  const { formConfig, selectedFieldId, updateField } = useFormStore();
  
  const selectedField = formConfig.fields.find(field => field.id === selectedFieldId);

  if (!selectedField) {
    return (
      <div className="w-80 lg:w-96 border-l border-border bg-card p-4 h-full overflow-y-auto">
        <div className="text-center text-muted-foreground mt-8">
          <p className="text-sm">Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleFieldUpdate = (updates: any) => {
    updateField(selectedField.id, updates);
  };

  const addOption = () => {
    const currentOptions = selectedField.options || [];
    const newOption = { label: `Option ${currentOptions.length + 1}`, value: `option-${currentOptions.length + 1}` };
    handleFieldUpdate({ options: [...currentOptions, newOption] });
  };

  const removeOption = (index: number) => {
    const currentOptions = selectedField.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    handleFieldUpdate({ options: newOptions });
  };

  const updateOption = (index: number, field: 'label' | 'value', value: string) => {
    const currentOptions = selectedField.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    handleFieldUpdate({ options: newOptions });
  };

  const needsOptions = selectedField.type === 'select' || selectedField.type === 'radio';

  return (
    <div className="w-80 lg:w-96 border-l border-border bg-card p-4 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Field Properties
        </h3>
        <p className="text-sm text-muted-foreground capitalize">
          {selectedField.type} Field
        </p>
      </div>

      <div className="space-y-4">
        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={(e) => handleFieldUpdate({ label: e.target.value })}
            placeholder="Field label"
          />
        </div>

        {/* Input Type */}
        {selectedField.type === 'input' && (
          <div className="space-y-2">
            <Label htmlFor="input-type">Input Type</Label>
            <Select
              value={selectedField.inputType || 'text'}
              onValueChange={(value: InputType) => handleFieldUpdate({ inputType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select input type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="password">Password</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="tel">Phone</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="search">Search</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Placeholder */}
        {(selectedField.type === 'input' || selectedField.type === 'textarea' || selectedField.type === 'select') && (
          <div className="space-y-2">
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={selectedField.placeholder || ''}
              onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
              placeholder="Placeholder text"
            />
          </div>
        )}

        {/* Default Value */}
        <div className="space-y-2">
          <Label htmlFor="field-default">Default Value</Label>
          {selectedField.type === 'textarea' ? (
            <Textarea
              id="field-default"
              value={selectedField.defaultValue || ''}
              onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
              placeholder="Default value"
            />
          ) : (
            <Input
              id="field-default"
              value={selectedField.defaultValue || ''}
              onChange={(e) => handleFieldUpdate({ defaultValue: e.target.value })}
              placeholder="Default value"
            />
          )}
        </div>

        {/* Options for Select and Radio */}
        {needsOptions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {(selectedField.options || []).map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Label"
                    value={option.label}
                    onChange={(e) => updateOption(index, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={option.value}
                    onChange={(e) => updateOption(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="h-10 w-10 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation */}
        <div className="space-y-3">
          <Label>Validation</Label>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={selectedField.validation?.required || false}
              onCheckedChange={(checked) => 
                handleFieldUpdate({ 
                  validation: { ...selectedField.validation, required: checked } 
                })
              }
            />
            <Label htmlFor="required" className="text-sm">Required</Label>
          </div>

          {(selectedField.type === 'input' || selectedField.type === 'textarea') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="min-length">Min Length</Label>
                <Input
                  id="min-length"
                  type="number"
                  value={selectedField.validation?.min || ''}
                  onChange={(e) => 
                    handleFieldUpdate({ 
                      validation: { 
                        ...selectedField.validation, 
                        min: e.target.value ? parseInt(e.target.value) : undefined 
                      } 
                    })
                  }
                  placeholder="Minimum length"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-length">Max Length</Label>
                <Input
                  id="max-length"
                  type="number"
                  value={selectedField.validation?.max || ''}
                  onChange={(e) => 
                    handleFieldUpdate({ 
                      validation: { 
                        ...selectedField.validation, 
                        max: e.target.value ? parseInt(e.target.value) : undefined 
                      } 
                    })
                  }
                  placeholder="Maximum length"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}