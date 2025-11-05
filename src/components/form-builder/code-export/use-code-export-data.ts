import {
  generateReactComponent,
  generateZodSchema,
} from "@/lib/code-generator";
import {
  planDependencies,
  type DependencyPlan,
  type DependencySummary,
} from "@/lib/dependencies";
import { planFiles } from "@/lib/codegen/file-planner";
import type { FilePlan } from "@/lib/codegen/types";
import { useFormStore } from "@/store/form-store";
import { useMemo } from "react";

export function useCodeExportData() {
  const formConfig = useFormStore((state) => state.formConfig);

  const generated = useMemo(() => {
    const dependencyPlan = planDependencies(formConfig);
    const dependencies: DependencySummary = {
      shadcn: dependencyPlan.shadcn.map((item) => item.slug),
      packages: dependencyPlan.packages,
    };
    const filePlan = planFiles(formConfig);

    return {
      schema: generateZodSchema(formConfig),
      component: generateReactComponent(formConfig),
      dependencyPlan,
      dependencies,
      filePlan,
    };
  }, [formConfig]);

  return {
    formConfig,
    ...generated,
    hasFields: formConfig.fields.length > 0,
  };
}
