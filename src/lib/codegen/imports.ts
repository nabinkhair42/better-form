import type { ImportNeedKey, ImportNeeds } from "@/types/codegen";

const FORM_IMPORT_KEYS: ImportNeedKey[] = [
  "Form",
  "FormControl",
  "FormField",
  "FormItem",
  "FormLabel",
  "FormMessage",
];

const SELECT_IMPORT_KEYS: ImportNeedKey[] = [
  "Select",
  "SelectContent",
  "SelectItem",
  "SelectTrigger",
  "SelectValue",
];

export function buildImportBlock(
  importNeeds: ImportNeeds,
  formSlug?: string,
  schemaName: string = "formSchema",
  typeName: string = "FormData",
): string {
  const formImports = FORM_IMPORT_KEYS.filter((key) => importNeeds[key]).join(
    ",\n  ",
  );
  const selectImports = SELECT_IMPORT_KEYS.filter(
    (key) => importNeeds[key],
  ).join(", ");

  const importLines = [
    `'use client';`,
    "",
    "import { useForm } from 'react-hook-form';",
    "import { zodResolver } from '@hookform/resolvers/zod';",
  ];

  if (importNeeds.Button) {
    importLines.push("import { Button } from '@/components/ui/button';");
  }

  if (formImports) {
    importLines.push(
      `import {\n  ${formImports}\n} from '@/components/ui/form';`,
    );
  }

  if (importNeeds.Input) {
    importLines.push("import { Input } from '@/components/ui/input';");
  }

  if (importNeeds.Textarea) {
    importLines.push("import { Textarea } from '@/components/ui/textarea';");
  }

  if (selectImports) {
    importLines.push(
      `import { ${selectImports} } from '@/components/ui/select';`,
    );
  }

  if (importNeeds.Checkbox) {
    importLines.push("import { Checkbox } from '@/components/ui/checkbox';");
  }

  if (importNeeds.RadioGroup || importNeeds.RadioGroupItem) {
    importLines.push(
      "import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';",
    );
  }

  if (importNeeds.Switch) {
    importLines.push("import { Switch } from '@/components/ui/switch';");
  }

  if (importNeeds.Label) {
    importLines.push("import { Label } from '@/components/ui/label';");
  }

  if (importNeeds.PhoneInput) {
    importLines.push(
      "import { PhoneInput } from '@/components/ui/phone-input';",
    );
  }

  if (importNeeds.CountryDropdown) {
    importLines.push(
      "import { CountryDropdown } from '@/components/ui/country-dropdown';",
    );
  }

  // Schema import - relative path from form to schema directory with dynamic names
  const schemaImport = formSlug
    ? `import { ${schemaName}, ${typeName} } from '@/components/better-form/schema/${formSlug}';`
    : `import { ${schemaName}, ${typeName} } from '../schema';`;
  importLines.push(schemaImport);

  return importLines.join("\n");
}
