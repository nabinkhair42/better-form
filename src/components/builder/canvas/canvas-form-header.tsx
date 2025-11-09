"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { cn } from "@/lib/utils";
import { Edit2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const handleNameCommit = useCallback(
    (value: string) => {
      onNameSubmit(value || "Untitled Form");
      setEditingName(false);
    },
    [onNameSubmit]
  );

  const handleDescriptionCommit = useCallback(
    (value: string) => {
      onDescriptionSubmit(value || "Form description");
      setEditingDescription(false);
    },
    [onDescriptionSubmit]
  );

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  useEffect(() => {
    if (editingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
      descriptionRef.current.select();
    }
  }, [editingDescription]);

  return (
    <div className="rounded-lg p-6 border bg-background">
      {editingName ? (
        <Input
          ref={nameInputRef}
          defaultValue={name}
          className="text-2xl font-semibold border-none h-auto shadow-none focus-visible:ring-0 focus-visible:bg-muted/50"
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
        <Button
          variant={"ghost"}
          className={cn(
            "group flex items-center gap-2 cursor-pointer",
            "text-left"
          )}
          onClick={() => setEditingName(true)}
        >
          <h2 className="text-2xl font-semibold text-foreground">{name}</h2>
          <Edit2 className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      )}

      {editingDescription ? (
        <Textarea
          ref={descriptionRef}
          defaultValue={description}
          className="text-sm text-muted-foreground border-none focus-visible:ring-0 resize-none shadow-none focus-visible:bg-muted/50"
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
        <Button
          variant={"ghost"}
          className={cn(
            "group flex items-center gap-2 cursor-pointer",
            "text-left"
          )}
          onClick={() => setEditingDescription(true)}
        >
          <p className="text-sm text-muted-foreground">{description}</p>
          <Edit2 className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      )}
    </div>
  );
}
