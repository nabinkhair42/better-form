import { InputType } from "@/types/form";
import {
  Hash,
  Link2,
  Lock,
  Mail,
  Search,
  Type as TypeIcon,
} from "lucide-react";
import { ComponentType } from "react";

export type InputTypeMeta = {
  type: InputType;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const INPUT_TYPE_CATALOG: InputTypeMeta[] = [
  { type: "text", label: "Text", icon: TypeIcon },
  { type: "email", label: "Email", icon: Mail },
  { type: "password", label: "Password", icon: Lock },
  { type: "number", label: "Number", icon: Hash },
  { type: "url", label: "URL", icon: Link2 },
  { type: "search", label: "Search", icon: Search },
];

export function getInputTypeMeta(type: InputType): InputTypeMeta | undefined {
  return INPUT_TYPE_CATALOG.find((t) => t.type === type);
}
