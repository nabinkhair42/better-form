'use client';

import { CodeExport } from './code-export';

export function CodeContent() {
  return (
    <div className="flex-1 overflow-auto relative bg-background">
      <div className="h-full p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Export Code
            </h2>
            <p className="text-sm text-muted-foreground">
              Copy the generated code to use in your project
            </p>
          </div>
          <CodeExport />
        </div>
      </div>
    </div>
  );
}