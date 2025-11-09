"use client";

import { useState } from "react";

import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { TrashIcon, XIcon } from "lucide-react";

interface ClearFormDialogProps {
  disabled?: boolean;
  onConfirm: () => void;
}

export function ClearFormDialog({ disabled, onConfirm }: ClearFormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="shadow-none"
        >
          <TrashIcon className="size-4" />
          Clear Form
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear form?</DialogTitle>
          <DialogDescription>
            This will remove all fields and reset the form configuration. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            <XIcon className="size-4" />
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            <TrashIcon className="size-4" />
            Clear form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
