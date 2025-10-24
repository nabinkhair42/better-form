'use client';

import { LivePreview } from './live-preview';

export function PreviewContent() {
  return (
    <div className="flex-1 overflow-auto relative bg-background">
      <div className="h-full p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Live Preview
            </h2>
            <p className="text-sm text-muted-foreground">
              This is how your form will look and behave
            </p>
          </div>
          <LivePreview />
        </div>
      </div>
    </div>
  );
}