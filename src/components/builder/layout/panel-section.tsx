"use client";

import type { ReactNode } from "react";

import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { cn } from "@/lib/utils";
import { useFormStore } from "@/stores/form-store";
import { ClearFormDialog } from "./clear-form-dialog";

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
        <div className="border-b ">
          <div className="max-w-5xl mx-auto w-full py-[10px] px-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {showClearButton && (
              <ClearFormDialog
                disabled={formConfig.fields.length === 0}
                onConfirm={clearForm}
              />
            )}
          </div>
        </div>
        <ScrollArea
          className={cn("flex-1 h-screen pb-32", scrollAreaClassName)}
        >
          <div className={contentClassName}>{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
