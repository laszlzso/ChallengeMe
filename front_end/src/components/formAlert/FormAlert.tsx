import { Alert, Box } from "@mui/material";
import React, { FC } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors?: FieldErrors;
};

const FormAlert: FC<Props> = ({ errors }) => {
  if (!errors?.non_field_errors) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error">{errors.non_field_errors.message}</Alert>
    </Box>
  );
};

export default FormAlert;
