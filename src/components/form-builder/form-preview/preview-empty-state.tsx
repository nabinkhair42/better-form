import { cn } from "@/lib/utils";

interface PreviewEmptyStateProps {
  className?: string;
}

export function PreviewEmptyState({ className }: PreviewEmptyStateProps) {
  return (
    <div className={cn("p-4", className)}>
      <div className="mx-auto flex h-64 w-full max-w-lg flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-center">
        <h3 className="text-base font-semibold text-foreground">
          Nothing to preview yet
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add fields to the form builder to see them render in the live preview.
        </p>
      </div>
    </div>
  );
}
