"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormStore } from "@/store/form-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LiveFieldControl } from "./live-field-control";
import { PreviewEmptyState } from "./preview-empty-state";
import { buildDefaultValues, buildFormSchema } from "./schema";

export function LivePreview() {
  const formConfig = useFormStore((state) => state.formConfig);

  const schema = useMemo(() => buildFormSchema(formConfig), [formConfig]);
  type FormValues = z.infer<typeof schema>;

  const defaultValues = useMemo(
    () => buildDefaultValues(formConfig) as FormValues,
    [formConfig],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (values: FormValues) => {
    toast.custom(() => (
      <div className="bg-card p-3 border w-96">
        <h4 className="font-semibold">Form Submitted</h4>
        <pre className="bg-muted font-mono max-h-16 overflow-auto">
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    ));
  };

  if (formConfig.fields.length === 0) {
    return <PreviewEmptyState />;
  }

  return (
    <div className="p-4">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {formConfig.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formConfig.description}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {formConfig.fields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id as keyof FormValues}
              render={({ field: formField }) => (
                <FormItem>
                  {field.type !== "checkbox" && field.type !== "switch" && (
                    <FormLabel>{field.label}</FormLabel>
                  )}
                  <FormControl>
                    <LiveFieldControl field={field} formField={formField} />
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
