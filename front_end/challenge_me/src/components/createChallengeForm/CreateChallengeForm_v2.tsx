import React, { useState } from "react";
import { TextField } from "@mui/material";
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
    register
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      startDate: new Date(),
      endDate: new Date()
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (data: FormData) => {
    setLoading(true);

    fetch("/api/challenges/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(() => {
      setLoading(false);
      window.location.assign("/challenges");
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <h2>Create Your Challenge</h2>
      <form>
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
                  style={{ marginTop: 30 }}
                />
              )}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <DesktopDatePicker
              {...field}
              label="End date"
              inputFormat="MM/dd/yyyy"
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...getValidationPropsWithField(errors, field)}
                  fullWidth
                  variant="standard"
                  style={{ marginTop: 30 }}
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
          style={{ marginTop: 30 }}
        >
          Create challenge
        </LoadingButton>
      </form>
    </LocalizationProvider>
  );
}
