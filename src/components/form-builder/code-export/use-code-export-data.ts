import {
  generateReactComponent,
  generateZodSchema,
} from "@/lib/code-generator";
import { collectDependencies } from "@/lib/dependencies";
import { useFormStore } from "@/store/form-store";
import { useMemo } from "react";

export function useCodeExportData() {
  const formConfig = useFormStore((state) => state.formConfig);

  const generated = useMemo(() => {
    return {
      schema: generateZodSchema(formConfig),
      component: generateReactComponent(formConfig),
      dependencies: collectDependencies(formConfig),
    };
  }, [formConfig]);

  return {
    formConfig,
    ...generated,
    hasFields: formConfig.fields.length > 0,
  };
}
