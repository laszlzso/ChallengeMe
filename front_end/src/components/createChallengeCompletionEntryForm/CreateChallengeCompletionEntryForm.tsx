import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Modal,
  Button,
  IconButton,
  Alert
} from "@mui/material";
import { ContentPasteOffSharp, Send as SendIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useForm, Controller, FieldValues, FieldErrors } from "react-hook-form";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import {
  convertServiceErrorToUseFormError,
  getValidationProps,
  getValidationPropsWithField
} from "../../utils/form";
import {
  ChallengeType,
  useChallengeTypesClient
} from "../../clients/challengeTypes";
import { useAsync } from "react-use";
import {
  ChallengeSchedule,
  NewChallengeScheduleShape,
  useChallengeSchedulesClient
} from "../../clients/challengeSchedules";
import CreateChallengeTypeForm from "../createChallengeTypeForm/CreateChallengeTypeForm";
import FormAlert from "../formAlert/FormAlert";
import {
  NewChallengeCompletionEntryShape,
  useChallengeCompletionEntryClient
} from "../../clients/challengeCompletionEntries";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useAuthContext } from "../authProvider/AuthProvider";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

type FormData = {
  challenge_schedule_id: number;
  timestamp: Date;
  amount: number;
};

type Props = {
  challenge_id: number;
  onSuccess: () => void;
};

const filterSchedulesByUserId = (
  schedules: ChallengeSchedule[],
  userId: number
) => {
  return schedules.filter((schedule) => schedule.user_id === userId);
};

export default function CreateChallengeCompletionEntryForm({
  challenge_id,
  onSuccess
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    setError,
    reset,
    getValues,
    clearErrors,
    watch
  } = useForm<FormData>({
    defaultValues: {
      challenge_schedule_id: undefined,
      timestamp: new Date(),
      amount: undefined
    }
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { createChallengeCompletionEntry } =
    useChallengeCompletionEntryClient();
  const { getChallengeSchedulesByChallengeId } = useChallengeSchedulesClient();

  const { user } = useAuthContext();
  const { user_id = -1 } = user || {};

  const challengeSchedulesAsync = useAsync(
    async () =>
      challenge_id
        ? filterSchedulesByUserId(
            await getChallengeSchedulesByChallengeId(challenge_id),
            user_id
          )
        : Promise.resolve(),
    [challenge_id]
  );

  const onSubmit = (data: FormData) => {
    setLoading(true);

    createChallengeCompletionEntry(data as NewChallengeCompletionEntryShape)
      .then(() => {
        onSuccess();
        reset();
      })
      .catch((errors) =>
        convertServiceErrorToUseFormError(errors, setError, watch, clearErrors)
      )
      .finally(() => setLoading(false));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="h4" gutterBottom component="div">
        Add an Entry
      </Typography>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { mb: 2 },
          "& .MuiButton-root": { mb: 2 }
        }}
        autoComplete="off"
      >
        {challengeSchedulesAsync?.value?.length === 0 ? (
          <span>You need to create a schedule before you can add entries</span>
        ) : (
          <>
            <FormAlert errors={errors} />
            {/* TODO(ricsi): Display something nicer that schedule_id */}
            {/* TODO(ricsi): Clear schedule value after add entry */}
            {/* TODO(ricsi): loading state??? */}
            <TextField
              {...register("challenge_schedule_id", { required: true })}
              {...getValidationProps(errors, "challenge_schedule_id")}
              label="Schedule"
              select
              fullWidth
              variant="standard"
            >
              {challengeSchedulesAsync.value?.map((schedule) => (
                <MenuItem
                  key={schedule?.challenge_schedule_id}
                  value={schedule?.challenge_schedule_id}
                >
                  {schedule?.challenge_schedule_id}
                </MenuItem>
              ))}
            </TextField>
            <Controller
              name="timestamp"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Timestamp"
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
            <TextField
              {...register("amount", { required: true, valueAsNumber: true })}
              {...getValidationProps(errors, "amount")}
              fullWidth
              label="Amount"
              variant="standard"
              type="number"
            />
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              Add entry
            </LoadingButton>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
}
