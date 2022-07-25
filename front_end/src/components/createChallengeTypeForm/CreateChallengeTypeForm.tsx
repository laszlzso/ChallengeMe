import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller, FieldValues, FieldErrors } from "react-hook-form";
import {
  convertServiceErrorToUseFormError,
  getValidationProps,
  getValidationPropsWithField
} from "../../utils/form";
import {
  ChallengeType,
  NewChallengeTypeShape,
  useChallengeTypesClient
} from "../../clients/challengeTypes";

type FormData = {
  name: string;
  unit: string;
};

type Props = {
  onSuccess: () => void;
};

export default function CreateChallengeScheduleForm({ onSuccess }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setError,
    watch,
    clearErrors
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      unit: ""
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  const { createChallengeType } = useChallengeTypesClient();

  const onSubmit = (data: FormData) => {
    setLoading(true);

    createChallengeType(data as NewChallengeTypeShape)
      .then(() => {
        onSuccess?.();
      })
      .catch((errors) =>
        convertServiceErrorToUseFormError(errors, setError, watch, clearErrors)
      )
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Typography variant="h4" gutterBottom component="div">
        Create Challenge Type
      </Typography>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { mb: 2 },
          "& .MuiButton-root": { mb: 2 }
        }}
        autoComplete="off"
      >
        <TextField
          {...register("name", { required: true, minLength: 1 })}
          {...getValidationProps(errors, "name")}
          fullWidth
          label="Activity name (eg. Running)"
          variant="standard"
        />
        {/* TODO(ricsi): don't allow numbers here! */}
        <TextField
          {...register("unit", { required: true, minLength: 1 })}
          {...getValidationProps(errors, "unit")}
          fullWidth
          label="Activity unit (eg. km)"
          variant="standard"
        />
        <LoadingButton
          onClick={handleSubmit(onSubmit)}
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          Create type
        </LoadingButton>
      </Box>
    </>
  );
}
