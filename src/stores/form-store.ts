import { FormConfig, FormField } from "@/types/form";
import { create } from "zustand";

interface FormStore {
  formConfig: FormConfig;
  selectedFieldId: string | null;

  // Actions
  setFormConfig: (config: FormConfig) => void;
  updateFormMeta: (updates: { name?: string; description?: string }) => void;
  addField: (field: FormField) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  setSelectedField: (fieldId: string | null) => void;
  clearForm: () => void;
}

const defaultFormConfig: FormConfig = {
  id: "form-1",
  name: "Better Form",
  description: "Form description",
  fields: [],
};

export const useFormStore = create<FormStore>((set) => ({
  formConfig: defaultFormConfig,
  selectedFieldId: null,

  setFormConfig: (config) => set({ formConfig: config }),

  updateFormMeta: (updates) =>
    set((state) => ({
      formConfig: {
        ...state.formConfig,
        ...updates,
      },
    })),

  addField: (field) =>
    set((state) => ({
      formConfig: {
        ...state.formConfig,
        fields: [...state.formConfig.fields, field],
      },
    })),

  updateField: (fieldId, updates) =>
    set((state) => ({
      formConfig: {
        ...state.formConfig,
        fields: state.formConfig.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field,
        ),
      },
      // If the field ID is being updated, update selectedFieldId too
      selectedFieldId:
        state.selectedFieldId === fieldId && updates.id
          ? updates.id
          : state.selectedFieldId,
    })),

  removeField: (fieldId) =>
    set((state) => ({
      formConfig: {
        ...state.formConfig,
        fields: state.formConfig.fields.filter((field) => field.id !== fieldId),
      },
      selectedFieldId:
        state.selectedFieldId === fieldId ? null : state.selectedFieldId,
    })),

  reorderFields: (startIndex, endIndex) =>
    set((state) => {
      const fields = [...state.formConfig.fields];
      const [removed] = fields.splice(startIndex, 1);
      fields.splice(endIndex, 0, removed);

      return {
        formConfig: {
          ...state.formConfig,
          fields,
        },
      };
    }),

  setSelectedField: (fieldId) => set({ selectedFieldId: fieldId }),

  clearForm: () =>
    set({
      formConfig: defaultFormConfig,
      selectedFieldId: null,
    }),
}));
