"use client";

import { Button } from "@/components/ui/shadcn/button";
import { FormFieldType } from "@/types/form";
import {
  CheckSquare,
  Circle,
  FileText,
  Globe,
  List,
  Phone as PhoneIcon,
  Plus,
  ToggleLeft,
  Type,
} from "lucide-react";

type FieldTypeEntry = {
  id: string;
  type: FormFieldType;
  label: string;
};

export function FieldItem({
  item,
  onAdd,
}: {
  item: FieldTypeEntry;
  onAdd: (item: FieldTypeEntry) => void;
}) {
  const iconProps = { className: "size-4 text-muted-foreground shrink-0" };

  const renderIcon = () => {
    switch (item.type) {
      case "input":
        return <Type {...iconProps} />;
      case "textarea":
        return <FileText {...iconProps} />;
      case "select":
        return <List {...iconProps} />;
      case "checkbox":
        return <CheckSquare {...iconProps} />;
      case "radio":
        return <Circle {...iconProps} />;
      case "switch":
        return <ToggleLeft {...iconProps} />;
      case "phone":
        return <PhoneIcon {...iconProps} />;
      case "country":
        return <Globe {...iconProps} />;
      default:
        return <Type {...iconProps} />;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        {renderIcon()}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{item.label}</div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAdd(item)}
        className="size-6"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
