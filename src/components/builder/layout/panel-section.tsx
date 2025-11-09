"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/shadcn/button";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { cn } from "@/lib/utils";
import { useFormStore } from "@/stores/form-store";

interface PanelSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  scrollAreaClassName?: string;
  contentClassName?: string;
  showClearButton?: boolean;
}

export function PanelSection({
  title,
  children,
  className,
  scrollAreaClassName,
  contentClassName,
  showClearButton = true,
}: PanelSectionProps) {
  const { formConfig, clearForm } = useFormStore();

  return (
    <div className={cn("flex-1 overflow-hidden", className)}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-[10px]">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {showClearButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearForm}
              disabled={formConfig.fields.length === 0}
              className="shadow-none"
            >
              Clear Form
            </Button>
          )}
        </div>
        <ScrollArea className={cn("flex-1", scrollAreaClassName)}>
          <div className={contentClassName}>{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
