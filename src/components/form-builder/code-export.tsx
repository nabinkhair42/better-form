"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  generateReactComponent,
  generateZodSchema,
} from "@/lib/code-generator";
import { useFormStore } from "@/store/form-store";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CodeExport() {
  const { formConfig } = useFormStore();
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"schema" | "component">("schema");

  const zodSchema = generateZodSchema(formConfig);
  const reactComponent = generateReactComponent(formConfig);

  const copyToClipboard = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
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
    <div className="p-4">
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg mb-6 max-w-fit">
        <Button
          variant={activeTab === "schema" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("schema")}
          className="h-8"
        >
          Zod Schema
        </Button>
        <Button
          variant={activeTab === "component" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("component")}
          className="h-8"
        >
          React Component
        </Button>
      </div>

      {activeTab === "schema" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              schema.ts
            </p>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(zodSchema, "schema")}
              className="h-7 gap-2"
            >
              {copiedTab === "schema" ? (
                <>
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={zodSchema}
            readOnly
            className="font-mono text-xs min-h-[500px] resize-none"
          />
        </div>
      )}

      {activeTab === "component" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              form-component.tsx
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(reactComponent, "component")}
              className="h-8 gap-2"
            >
              {copiedTab === "component" ? (
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
        </div>
      )}
    </div>
  );
}
