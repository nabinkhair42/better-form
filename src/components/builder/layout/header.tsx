"use client";

import { GithubIcon } from "@/assets/icons";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/shadcn/button";
import { useFormStore } from "@/stores/form-store";
import { Code, Grid2X2Check, Menu, View, X } from "lucide-react";

interface HeaderProps {
  activeTab: "builder" | "preview" | "code";
  onTabChange: (tab: "builder" | "preview" | "code") => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  propertiesOpen: boolean;
  onPropertiesToggle: () => void;
}

const TabsConfig = [
  {
    id: "builder",
    label: "Builder",
    icon: <Grid2X2Check className="size-4" />,
  },
  { id: "preview", label: "Preview", icon: <View className="size-4" /> },
  { id: "code", label: "Code", icon: <Code className="size-4" /> },
];

export function Header({
  activeTab,
  onTabChange,
  sidebarOpen,
  onSidebarToggle,
  onPropertiesToggle,
}: HeaderProps) {
  const { selectedFieldId } = useFormStore();

  return (
    <header className="border-b p-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Logo and mobile sidebar toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden h-8 w-8 p-0"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
          <AppIcon size={20} aria-hidden className="shrink-0" />
          <h1 className="text-xl font-semibold text-foreground hidden md:flex">
            Better Form
          </h1>
        </div>

        {/* Center - Navigation tabs */}
        <div className="flex items-center gap-1 border p-px rounded-lg">
          {TabsConfig.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "outline" : "ghost"}
              size="sm"
              onClick={() =>
                onTabChange(tab.id as "builder" | "preview" | "code")
              }
              className="h-7 w-7 md:h-8 md:w-fit"
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span className="hidden md:flex">{tab.label}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Right side - Field count and actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              window.open(
                "https://github.com/nabinkhair42/better-form",
                "_blank"
              );
            }}
            className="rounded-full"
          >
            <GithubIcon className="size-4" />
          </Button>
          {/* Mobile properties toggle - only show when field is selected */}
          {selectedFieldId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPropertiesToggle}
              className="lg:hidden h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
