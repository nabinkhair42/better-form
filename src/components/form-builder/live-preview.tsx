'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStore } from '@/store/form-store';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function LivePreview() {
  const { formConfig } = useFormStore();

  // Generate Zod schema dynamically
  const generateSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    formConfig.fields.forEach(field => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case 'input':
        case 'textarea':
          fieldSchema = z.string();
          if (field.validation?.min) {
            fieldSchema = (fieldSchema as z.ZodString).min(field.validation.min);
          }
          if (field.validation?.max) {
            fieldSchema = (fieldSchema as z.ZodString).max(field.validation.max);
          }
          break;
        case 'select':
        case 'radio':
          fieldSchema = z.string();
          break;
        case 'checkbox':
        case 'switch':
          fieldSchema = z.boolean();
          break;
        default:
          fieldSchema = z.string();
      }

      if (field.validation?.required) {
        if (field.type === 'checkbox' || field.type === 'switch') {
          fieldSchema = fieldSchema.refine(val => val === true, {
            message: `${field.label} is required`
          });
        }
      } else {
        fieldSchema = fieldSchema.optional();
      }

      schemaFields[field.id] = fieldSchema;
    });

    return z.object(schemaFields);
  };

  const schema = generateSchema();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formConfig.fields.reduce((acc, field) => {
      acc[field.id] = field.defaultValue || (field.type === 'checkbox' || field.type === 'switch' ? false : '');
      return acc;
    }, {} as Record<string, any>)
  });

  const onSubmit = (values: any) => {
    console.log('Form submitted:', values);
    alert('Form submitted! Check console for values.');
  };

  if (formConfig.fields.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Add fields to see the live preview</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-card shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {formConfig.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formConfig.description}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {formConfig.fields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id}
              render={({ field: formField }) => (
                <FormItem>
                  {field.type !== 'checkbox' && field.type !== 'switch' && (
                    <FormLabel>{field.label}</FormLabel>
                  )}
                  <FormControl>
                    {(() => {
                      switch (field.type) {
                        case 'input':
                          return (
                            <Input
                              type={field.inputType || 'text'}
                              placeholder={field.placeholder}
                              {...formField}
                            />
                          );
                        case 'textarea':
                          return (
                            <Textarea
                              placeholder={field.placeholder}
                              {...formField}
                            />
                          );
                        case 'select':
                          return (
                            <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                              <SelectTrigger>
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
                        case 'checkbox':
                          return (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={formField.value}
                                onCheckedChange={formField.onChange}
                              />
                              <Label>{field.label}</Label>
                            </div>
                          );
                        case 'radio':
                          return (
                            <RadioGroup
                              onValueChange={formField.onChange}
                              defaultValue={formField.value}
                            >
                              {field.options?.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option.value} />
                                  <Label>{option.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          );
                        case 'switch':
                          return (
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formField.value}
                                onCheckedChange={formField.onChange}
                              />
                              <Label>{field.label}</Label>
                            </div>
                          );
                        default:
                          return <div>Unknown field type</div>;
                      }
                    })()}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" className="w-full">
            Submit Form
          </Button>
        </form>
      </Form>
    </div>
  );
}