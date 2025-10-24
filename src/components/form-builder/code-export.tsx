"use client";

import { Button } from "@/components/ui/button";
import { CodeBlockClient } from "@/components/ui/extended/code-block-client";
import {
  generateReactComponent,
  generateZodSchema,
} from "@/lib/code-generator";
import { useFormStore } from "@/store/form-store";
import { useState } from "react";
export function CodeExport() {
  const { formConfig } = useFormStore();
  const [activeTab, setActiveTab] = useState<"schema" | "component">("schema");

  const zodSchema = generateZodSchema(formConfig);
  const reactComponent = generateReactComponent(formConfig);

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
          <CodeBlockClient
            code={zodSchema}
            language="typescript"
            meta='title="schema.ts"'
          />
        </div>
      )}

      {activeTab === "component" && (
        <div className="space-y-4">
          <CodeBlockClient
            code={reactComponent}
            language="tsx"
            meta='title="form-component.tsx"'
          />
        </div>
      )}
    </div>
  );
}
