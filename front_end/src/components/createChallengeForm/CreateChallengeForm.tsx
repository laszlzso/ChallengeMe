import React, { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
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
import { Challenge, NewChallengeShape } from "../../clients/challenges";

type FormData = {
  title: string;
  start_date: Date | null;
  end_date: Date | null;
};

type onCreateChallengeShape = (data: NewChallengeShape) => Promise<void>;

type Props = {
  onCreateChallenge: onCreateChallengeShape;
  challenge?: Challenge;
};

export default function CreateChallengeForm({
  onCreateChallenge,
  challenge
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      start_date: new Date(),
      end_date: new Date()
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (data: FormData) => {
    setLoading(true);

    onCreateChallenge(data as NewChallengeShape).finally(() =>
      setLoading(false)
    );
  };

  const validateEndDate = (value: FormData["end_date"]) => {
    const start_date = getValues("start_date");
    return (
      !value ||
      !start_date ||
      value >= start_date ||
      "Should be after start date"
    );
  };

  if (challenge) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Typography variant="h4" gutterBottom component="div">
          Your Challenge
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
            fullWidth
            label="Title"
            variant="standard"
            value={challenge.title}
            disabled
          />
          <DesktopDatePicker
            label="Start date"
            inputFormat="MM/dd/yyyy"
            disabled
            onChange={() => {}}
            value={challenge.start_date}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="standard" />
            )}
          />
          <DesktopDatePicker
            label="End date"
            inputFormat="MM/dd/yyyy"
            disabled
            onChange={() => {}}
            value={challenge.end_date}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="standard" />
            )}
          />
        </Box>
      </LocalizationProvider>
    );
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="h4" gutterBottom component="div">
        Create Your Challenge
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
          {...register("title", { required: true, minLength: 2 })}
          {...getValidationProps(errors, "title")}
          fullWidth
          label="Title"
          variant="standard"
        />
        <Controller
          name="start_date"
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
          name="end_date"
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
              minDate={getValues("start_date")}
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
