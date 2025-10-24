'use client';

import { useState } from 'react';
import { useFormStore } from '@/store/form-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { generateZodSchema, generateReactComponent } from '@/lib/code-generator';

export function CodeExport() {
  const { formConfig } = useFormStore();
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const zodSchema = generateZodSchema(formConfig);
  const reactComponent = generateReactComponent(formConfig);

  const copyToClipboard = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (formConfig.fields.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Add fields to generate code</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-card shadow-sm">
      <Tabs defaultValue="schema" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="schema">Zod Schema</TabsTrigger>
          <TabsTrigger value="component">React Component</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schema" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">schema.ts</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(zodSchema, 'schema')}
              className="h-8 gap-2"
            >
              {copiedTab === 'schema' ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={zodSchema}
            readOnly
            className="font-mono text-xs min-h-[500px] resize-none"
          />
        </TabsContent>
        
        <TabsContent value="component" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">form-component.tsx</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(reactComponent, 'component')}
              className="h-8 gap-2"
            >
              {copiedTab === 'component' ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={reactComponent}
            readOnly
            className="font-mono text-xs min-h-[500px] resize-none"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}