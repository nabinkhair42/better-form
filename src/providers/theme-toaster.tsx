"use client";

import { Toaster } from "@/components/ui/shadcn/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <Toaster richColors position="bottom-center" />
      {children}
    </NextThemesProvider>
  );
}
