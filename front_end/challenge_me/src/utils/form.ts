import { FieldErrors, FieldValues } from "react-hook-form";

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
