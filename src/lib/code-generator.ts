import { FormConfig, FormField } from '@/types/form';

export function generateZodSchema(formConfig: FormConfig): string {
  const imports = `import { z } from 'zod';`;
  
  const schemaFields = formConfig.fields.map(field => {
    let fieldSchema = '';
    
    switch (field.type) {
      case 'input':
      case 'textarea':
        fieldSchema = 'z.string()';
        if (field.validation?.min) {
          fieldSchema += `.min(${field.validation.min})`;
        }
        if (field.validation?.max) {
          fieldSchema += `.max(${field.validation.max})`;
        }
        break;
      case 'select':
      case 'radio':
        if (field.options && field.options.length > 0) {
          const enumValues = field.options.map(opt => `"${opt.value}"`).join(', ');
          fieldSchema = `z.enum([${enumValues}])`;
        } else {
          fieldSchema = 'z.string()';
        }
        break;
      case 'checkbox':
      case 'switch':
        fieldSchema = 'z.boolean()';
        break;
      default:
        fieldSchema = 'z.string()';
    }
    
    if (!field.validation?.required) {
      fieldSchema += '.optional()';
    }
    
    return `  ${field.id}: ${fieldSchema}, // ${field.label}`;
  }).join('\n');
  
  const schema = `
const formSchema = z.object({
${schemaFields}
});

export type FormData = z.infer<typeof formSchema>;
`;

  return `${imports}\n${schema}`;
}

export function generateReactComponent(formConfig: FormConfig): string {
  const imports = `'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { formSchema, FormData } from './schema';`;

  const defaultValues = formConfig.fields.map(field => {
    const defaultValue = field.defaultValue || (field.type === 'checkbox' || field.type === 'switch' ? false : '');
    return `    ${field.id}: ${JSON.stringify(defaultValue)},`;
  }).join('\n');

  const formFields = formConfig.fields.map(field => {
    let fieldComponent = '';
    
    switch (field.type) {
      case 'input':
        fieldComponent = `<Input type="${field.inputType || 'text'}" placeholder="${field.placeholder || ''}" {...field} />`;
        break;
      case 'textarea':
        fieldComponent = `<Textarea placeholder="${field.placeholder || ''}" {...field} />`;
        break;
      case 'select':
        const selectOptions = field.options?.map(opt => 
          `                    <SelectItem value="${opt.value}">${opt.label}</SelectItem>`
        ).join('\n') || '';
        fieldComponent = `<Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="${field.placeholder || 'Select an option'}" />
                  </SelectTrigger>
                  <SelectContent>
${selectOptions}
                  </SelectContent>
                </Select>`;
        break;
      case 'checkbox':
        fieldComponent = `<div className="flex items-center space-x-2">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  <Label>${field.label}</Label>
                </div>`;
        break;
      case 'radio':
        const radioOptions = field.options?.map(opt => 
          `                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="${opt.value}" />
                      <Label>${opt.label}</Label>
                    </div>`
        ).join('\n') || '';
        fieldComponent = `<RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
${radioOptions}
                </RadioGroup>`;
        break;
      case 'switch':
        fieldComponent = `<div className="flex items-center space-x-2">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  <Label>${field.label}</Label>
                </div>`;
        break;
    }

    const showLabel = field.type !== 'checkbox' && field.type !== 'switch';
    
    return `        <FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              ${showLabel ? `<FormLabel>${field.label}</FormLabel>` : ''}
              <FormControl>
                ${fieldComponent}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
  }).join('\n');

  const component = `
export function ${formConfig.name.replace(/\s+/g, '')}Form() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
${defaultValues}
    },
  });

  function onSubmit(values: FormData) {
    console.log(values);
    // Handle form submission here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
${formFields}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}`;

  return `${imports}\n${component}`;
}

export function generateFormConfig(formConfig: FormConfig): string {
  return `export const formConfig = ${JSON.stringify(formConfig, null, 2)};`;
}