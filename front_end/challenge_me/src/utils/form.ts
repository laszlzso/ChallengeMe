import { FieldErrors, FieldValues } from "react-hook-form";

export const getValidationPropsWithField = (
  errors: FieldErrors,
  field: FieldValues
) => ({
  error: !!errors[field.name],
  helperText:
    (errors[field.name]?.type === "required" && "Required") ||
    (errors[field.name]?.type === "minLength" && "Too short")
});

export const getValidationProps = (errors: FieldErrors, name: string) => ({
  error: !!errors[name],
  helperText:
    (errors[name]?.type === "required" && "Required") ||
    (errors[name]?.type === "minLength" && "Too short")
});
