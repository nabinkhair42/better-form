import { cn } from "@/lib/utils";

interface CodeExportEmptyStateProps {
  className?: string;
}

export function CodeExportEmptyState({ className }: CodeExportEmptyStateProps) {
  return (
    <div className={cn("p-4", className)}>
      <div className="mx-auto flex h-64 w-full max-w-lg flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-center">
        <h3 className="text-base font-semibold text-foreground">
          No code to export yet
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create some fields in the form builder to generate code snippets.
        </p>
      </div>
    </div>
  );
}
