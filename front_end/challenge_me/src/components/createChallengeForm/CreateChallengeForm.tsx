import React, { useState } from "react";
import { TextField, Box } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useForm, Controller, FieldValues, FieldErrors } from "react-hook-form";
import {
  getValidationProps,
  getValidationPropsWithField
} from "../../utils/form";
<<<<<<< HEAD
import { NewChallengeShape, useChallengesClient } from "../../clients";
=======
import { useChallengesClient } from "../../clients";
>>>>>>> Refactoring api + react hooks

type FormData = {
  title: string;
  startDate: Date | null;
  endDate: Date | null;
};

export default function CreateChallengeForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      startDate: new Date(),
      endDate: new Date()
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  const { createChallenge } = useChallengesClient();

  const onSubmit = (data: FormData) => {
    setLoading(true);

<<<<<<< HEAD
    createChallenge(data as NewChallengeShape).then(() => {
=======
    createChallenge(data).then(() => {
>>>>>>> Refactoring api + react hooks
      setLoading(false);
      window.location.assign("/challenges");
    });
  };

  const validateEndDate = (value: FormData["endDate"]) => {
    const startDate = getValues("startDate");
    return (
      !value || !startDate || value >= startDate || "Should be after start date"
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <h2>Create Your Challenge</h2>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 2 },
          "& .MuiButton-root": { m: 2 }
        }}
        autoComplete="off"
      >
        <TextField
          {...register("title", { required: true, minLength: 2 })}
          {...getValidationProps(errors, "title")}
          fullWidth
          label="Title"
          variant="standard"
        />
        <Controller
          name="startDate"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <DesktopDatePicker
              {...field}
              label="Start date"
              inputFormat="MM/dd/yyyy"
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...getValidationPropsWithField(errors, field)}
                  fullWidth
                  variant="standard"
                />
              )}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          rules={{
            required: true,
            validate: validateEndDate
          }}
          render={({ field }) => (
            <DesktopDatePicker
              {...field}
              label="End date"
              inputFormat="MM/dd/yyyy"
              minDate={getValues("startDate")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...getValidationPropsWithField(errors, field)}
                  fullWidth
                  variant="standard"
                />
              )}
            />
          )}
        />
        <LoadingButton
          onClick={handleSubmit(onSubmit)}
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          Create challenge
        </LoadingButton>
      </Box>
    </LocalizationProvider>
  );
}
