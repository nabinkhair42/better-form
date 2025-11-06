"use client";

import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { cn } from "@/lib/utils";
import { Edit2 } from "lucide-react";
import { useCallback, useState } from "react";

type CanvasFormHeaderProps = {
  name: string;
  description?: string;
  onNameSubmit: (value: string) => void;
  onDescriptionSubmit: (value: string) => void;
};

export function CanvasFormHeader({
  name,
  description,
  onNameSubmit,
  onDescriptionSubmit,
}: CanvasFormHeaderProps) {
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  const handleNameCommit = useCallback(
    (value: string) => {
      onNameSubmit(value || "Untitled Form");
      setEditingName(false);
    },
    [onNameSubmit],
  );

  const handleDescriptionCommit = useCallback(
    (value: string) => {
      onDescriptionSubmit(value || "Form description");
      setEditingDescription(false);
    },
    [onDescriptionSubmit],
  );

  return (
    <div className="rounded-lg p-6 border bg-sidebar">
      {editingName ? (
        <Input
          defaultValue={name}
          className="text-2xl font-semibold border-none p-1 h-auto shadow-none rounded-none focus-visible:ring-0 focus-visible:bg-muted/50"
          onBlur={(event) => handleNameCommit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleNameCommit(event.currentTarget.value);
            }
            if (event.key === "Escape") {
              setEditingName(false);
            }
          }}
          autoFocus
        />
      ) : (
        <button
          type="button"
          className={cn(
            "group flex items-center gap-2 cursor-pointer",
            "text-left",
          )}
          onClick={() => setEditingName(true)}
        >
          <h2 className="text-2xl font-semibold text-foreground">{name}</h2>
          <Edit2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}

      {editingDescription ? (
        <Textarea
          defaultValue={description}
          className="text-sm text-muted-foreground mt-2 border-none p-1 focus-visible:ring-0 resize-none shadow-none rounded-none focus-visible:bg-muted/50"
          onBlur={(event) => handleDescriptionCommit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleDescriptionCommit(event.currentTarget.value);
            }
            if (event.key === "Escape") {
              setEditingDescription(false);
            }
          }}
          autoFocus
          rows={2}
        />
      ) : (
        <button
          type="button"
          className={cn(
            "group flex items-center gap-2 cursor-pointer mt-2",
            "text-left",
          )}
          onClick={() => setEditingDescription(true)}
        >
          <p className="text-sm text-muted-foreground">{description}</p>
          <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}
    </div>
  );
}
