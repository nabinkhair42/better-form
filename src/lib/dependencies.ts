import { FormConfig } from "@/types/form";

export type ShadcnDependency = {
  slug: string;
  reason: string;
};

export type PackageDependency = {
  name: string;
  reason: string;
};

export type ProjectComponentDependency = {
  name: string;
  reason: string;
};

export type CommandVariant = {
  label: string;
  command: string;
};

export type DependencyActionType = "registry-add" | "package-install";

export type DependencyAction = {
  id: string;
  type: DependencyActionType;
  label: string;
  description?: string;
  commands: CommandVariant[];
};

export type DependencyPlan = {
  shadcn: ShadcnDependency[];
  packages: PackageDependency[];
  projectComponents: ProjectComponentDependency[];
  actions: DependencyAction[];
};

export type DependencySummary = {
  shadcn: string[];
  packages: PackageDependency[];
};

export function planDependencies(config: FormConfig): DependencyPlan {
  const shadcnMap = new Map<string, ShadcnDependency>();
  const packageMap = new Map<string, PackageDependency>();
  const projectComponentMap = new Map<string, ProjectComponentDependency>();

  const addShadcn = (slug: string, reason: string) => {
    if (!shadcnMap.has(slug)) {
      shadcnMap.set(slug, { slug, reason });
    }
  };

  const addPackage = (name: string, reason: string) => {
    if (!packageMap.has(name)) {
      packageMap.set(name, { name, reason });
    }
  };

  const addProjectComponent = (name: string, reason: string) => {
    if (!projectComponentMap.has(name)) {
      projectComponentMap.set(name, { name, reason });
    }
  };

  // Base requirements for every generated form
  addShadcn("button", "Submit button");
  addShadcn("form", "Form field wrappers");
  addPackage("zod", "Validation schema");
  addPackage("@hookform/resolvers", "Zod resolver for React Hook Form");
  addPackage("react-hook-form", "Form state management");

  for (const field of config.fields) {
    switch (field.type) {
      case "input":
        addShadcn("input", "Text inputs");
        break;
      case "textarea":
        addShadcn("textarea", "Multi-line text areas");
        break;
      case "select":
        addShadcn("select", "Select dropdown");
        break;
      case "checkbox":
        addShadcn("checkbox", "Checkbox field");
        addShadcn("label", "Form label");
        break;
      case "radio":
        addShadcn("radio-group", "Radio group field");
        addShadcn("label", "Form label");
        break;
      case "switch":
        addShadcn("switch", "Toggle switch");
        addShadcn("label", "Form label");
        break;
      case "phone":
        addShadcn("command", "Phone country search");
        addShadcn("popover", "Phone country picker popover");
        addShadcn("scroll-area", "Scrollable phone country list");
        addShadcn("input", "Phone number input field");
        addShadcn("button", "Country selector trigger");
        addPackage(
          "react-phone-number-input",
          "Phone number input utilities",
        );
        addProjectComponent(
          "phone-input",
          "PhoneInput composite built on shadcn primitives",
        );
        break;
      case "country":
        addShadcn("command", "Country search");
        addShadcn("popover", "Country selector popover");
        addPackage("react-circle-flags", "Flag icons for countries");
        addPackage("country-data-list", "Country metadata dataset");
        addProjectComponent(
          "country-dropdown",
          "CountryDropdown composite built on shadcn primitives",
        );
        break;
      default:
        break;
    }
  }

  const shadcn = Array.from(shadcnMap.values()).sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
  const packages = Array.from(packageMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const projectComponents = Array.from(projectComponentMap.values()).sort(
    (a, b) => a.name.localeCompare(b.name),
  );

  const actions: DependencyAction[] = [];

  if (shadcn.length > 0) {
    actions.push({
      id: "shadcn-add",
      type: "registry-add",
      label: "Add shadcn components",
      description: "Install required UI primitives via shadcn CLI",
      commands: buildShadcnCommandVariants(shadcn.map((item) => item.slug)),
    });
  }

  if (packages.length > 0) {
    actions.push({
      id: "install-packages",
      type: "package-install",
      label: "Install npm packages",
      description: "Install package dependencies for generated code",
      commands: buildPackageCommandVariants(packages.map((pkg) => pkg.name)),
    });
  }

  return {
    shadcn,
    packages,
    projectComponents,
    actions,
  };
}

export function collectDependencies(config: FormConfig): DependencySummary {
  const plan = planDependencies(config);
  return {
    shadcn: plan.shadcn.map((item) => item.slug),
    packages: plan.packages,
  };
}

function buildShadcnCommandVariants(slugs: string[]): CommandVariant[] {
  if (slugs.length === 0) return [];
  const resources = slugs.join(" ");
  return [
    {
      label: "npm",
      command: `npx shadcn@latest add ${resources}`,
    },
    {
      label: "pnpm",
      command: `pnpm dlx shadcn@latest add ${resources}`,
    },
    {
      label: "yarn",
      command: `yarn dlx shadcn@latest add ${resources}`,
    },
    {
      label: "bun",
      command: `bunx shadcn@latest add ${resources}`,
    },
  ];
}

function buildPackageCommandVariants(names: string[]): CommandVariant[] {
  if (names.length === 0) return [];
  const packages = names.join(" ");
  return [
    {
      label: "npm",
      command: `npm install ${packages}`,
    },
    {
      label: "pnpm",
      command: `pnpm add ${packages}`,
    },
    {
      label: "yarn",
      command: `yarn add ${packages}`,
    },
    {
      label: "bun",
      command: `bun add ${packages}`,
    },
  ];
}
