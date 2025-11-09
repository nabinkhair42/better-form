"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/shadcn/button";
import { ReactNode, useEffect, useState } from "react";

type ThemeOption = {
  id: "light" | "dark";
  label: string;
  icon: ReactNode;
};

const THEME_OPTIONS: ThemeOption[] = [
  { id: "light", label: "Light", icon: <Sun className="size-4" /> },
  { id: "dark", label: "Dark", icon: <Moon className="size-4" /> },
];

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!mounted) {
    return null;
  }

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-muted-foreground">Theme</p>
      <div className="flex gap-px border rounded-full p-px w-fit">
        {THEME_OPTIONS.map((option) => {
          const isActive = activeTheme === option.id;

          return (
            <Button
              key={option.id}
              type="button"
              className="h-6 w-6 rounded-full"
              variant={isActive ? "outline" : "ghost"}
              size="icon"
              onClick={() => setTheme(option.id)}
            >
              {option.icon}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
