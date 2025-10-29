import { FormConfig } from "@/types/form";

export type DependencySummary = {
  shadcn: string[]; // component import identifiers
  packages: { name: string; reason: string }[]; // npm packages if any
};

// Minimal dependency mapping for current field set
export function collectDependencies(config: FormConfig): DependencySummary {
  const shadcn = new Set<string>();
  const packages: { name: string; reason: string }[] = [];

  // base needs
  shadcn.add("button");
  shadcn.add("form");

  for (const f of config.fields) {
    if (f.type === "input") shadcn.add("input");
    if (f.type === "textarea") shadcn.add("textarea");
    if (f.type === "select") shadcn.add("select");
    if (f.type === "checkbox") shadcn.add("checkbox");
    if (f.type === "radio") shadcn.add("radio-group");
    if (f.type === "switch") shadcn.add("switch");
    if (f.type === "phone") {
      shadcn.add("button");
      shadcn.add("command");
      shadcn.add("popover");
      shadcn.add("scroll-area");
      shadcn.add("input");
      // external package used by our PhoneInput wrapper
      packages.push({
        name: "react-phone-number-input",
        reason: "Phone input UI",
      });
    }
    if (f.type === "country") {
      shadcn.add("button");
      shadcn.add("command");
      shadcn.add("popover");
      packages.push({ name: "react-circle-flags", reason: "Country flags" });
      packages.push({
        name: "country-data-list",
        reason: "Country dataset (ISO 3166)",
      });
    }
    if (["checkbox", "switch", "radio"].includes(f.type)) shadcn.add("label");

    // zod and resolver (npm)
    if (f.type) {
      // all forms use zod + resolver through code generation
    }
  }

  // Always include these packages for generated code
  packages.push({ name: "zod", reason: "Validation schema" });
  packages.push({
    name: "@hookform/resolvers",
    reason: "Zod resolver for RHF",
  });
  packages.push({ name: "react-hook-form", reason: "Form state management" });

  return { shadcn: Array.from(shadcn).sort(), packages };
}
