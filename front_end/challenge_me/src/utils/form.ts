import {
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormSetError,
  UseFormWatch
} from "react-hook-form";

type ServiceErrors = Record<string, string[]>;

export const getValidationPropsWithField = (
  errors: FieldErrors,
  field: FieldValues
) => getValidationProps(errors, field.name);

export const getValidationProps = (errors: FieldErrors, name: string) => ({
  error: !!errors[name],
  helperText:
    (errors[name]?.type === "required" && "Required") ||
    (errors[name]?.type === "minLength" && "Too short") ||
    (errors[name]?.type === "validate" && errors[name]?.message)
});

export const convertServiceErrorToUseFormError = (
  errors: ServiceErrors = {},
  setError: UseFormSetError<any>,
  watch: UseFormWatch<any>,
  clearErrors: UseFormClearErrors<any>
) => {
  Object.entries(errors)?.forEach(([key, value]) =>
    setError(key, { type: "validate", message: value.join("\n") })
  );
  watch(() => {
    clearErrors("non_field_errors");
  });
};
