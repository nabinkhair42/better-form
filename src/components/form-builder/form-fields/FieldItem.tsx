"use client";

import { Button } from "@/components/ui/button";
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
  description: string;
};


export function FieldItem({
  item,
  onAdd,
}: {
  item: FieldTypeEntry;
  onAdd: (item: FieldTypeEntry) => void;
}) {
  const iconProps = { className: "h-4 w-4 text-muted-foreground shrink-0" };

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
          <div className="text-xs text-muted-foreground truncate">
            {item.description}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAdd(item)}
        className="h-7 w-7"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
