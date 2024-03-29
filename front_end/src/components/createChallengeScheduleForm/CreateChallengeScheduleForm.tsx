import React, { useEffect, useState } from "react";
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
  NewChallengeScheduleShape,
  useChallengeSchedulesClient
} from "../../clients/challengeSchedules";
import CreateChallengeTypeForm from "../createChallengeTypeForm/CreateChallengeTypeForm";
import FormAlert from "../formAlert/FormAlert";
import { Challenge } from "../../clients/challenges";

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
  challenge_id: number;
  challenge_type_id: number | null;
  daily_goal: number;
  start_date: Date;
  day_frequency: number;
};

type Props = {
  challenge: Challenge;
  onSuccess: () => void;
};

const mapChallengeTypesToOption = (types: ChallengeType[] = []) =>
  types?.map?.((type) => mapChallengeTypeToOption(type));

const mapChallengeTypeToOption = (type: ChallengeType) => ({
  label: `${type?.name} (${type?.unit})`,
  id: type?.challenge_type_id,
  ...(type || {})
});

export default function CreateChallengeScheduleForm({
  challenge,
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
      challenge_id: challenge?.challenge_id,
      challenge_type_id: null,
      daily_goal: undefined,
      start_date: new Date(challenge.start_date),
      day_frequency: undefined
    }
  });

  const { getAllChallengeTypes } = useChallengeTypesClient();

  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loadTypesTrigger, setLoadTypesTrigger] = useState<number>(Date.now());

  const challengeTypesAsync = useAsync(getAllChallengeTypes, [
    loadTypesTrigger
  ]);

  const { createChallengeSchedule } = useChallengeSchedulesClient();

  const onSubmit = (data: FormData) => {
    if (!data.challenge_type_id) {
      setError("challenge_type_id", { type: "required" });
      return;
    }

    setLoading(true);

    createChallengeSchedule(data as NewChallengeScheduleShape)
      .then(() => {
        onSuccess();
        reset();
      })
      .catch((errors) =>
        convertServiceErrorToUseFormError(errors, setError, watch, clearErrors)
      )
      .finally(() => setLoading(false));
  };

  const handleTypeOnSuccess = () => {
    setLoadTypesTrigger(Date.now());
    setModalOpen(false);
  };

  const findChallengeTypeById = (id: number | null) => {
    const type = challengeTypesAsync.value?.find(
      (type) => type.challenge_type_id === id
    );

    return type ? mapChallengeTypeToOption(type) : null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="h4" gutterBottom component="div">
        Create Your Schedules
      </Typography>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { mb: 2 },
          "& .MuiButton-root": { mb: 2 }
        }}
        autoComplete="off"
      >
        <FormAlert errors={errors} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* TODO(ricsi): Clearing with X doesnt work */}
          <Autocomplete
            sx={{ flex: 1, mr: 2 }}
            options={mapChallengeTypesToOption(challengeTypesAsync.value)}
            value={findChallengeTypeById(getValues("challenge_type_id"))}
            onChange={(event: any, value: ChallengeType | null) => {
              if (value) {
                clearErrors("challenge_type_id");
              }
              setValue("challenge_type_id", value?.challenge_type_id || null);
            }}
            loading={challengeTypesAsync.loading}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  {...getValidationProps(errors, "challenge_type_id")}
                  fullWidth
                  variant="standard"
                  label="Challenge type"
                />
              );
            }}
          />
          <IconButton component="span" onClick={() => setModalOpen(true)}>
            <AddBoxOutlinedIcon />
          </IconButton>
        </Box>
        <TextField
          {...register("daily_goal", { required: true, valueAsNumber: true })}
          {...getValidationProps(errors, "daily_goal")}
          fullWidth
          label="Daily goal"
          variant="standard"
          type="number"
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
        {/* TODO(ricsi): validate for positive integer between 1 and 7 */}
        <TextField
          {...register("day_frequency", {
            required: true,
            valueAsNumber: true
          })}
          {...getValidationProps(errors, "day_frequency")}
          fullWidth
          label="Day frequency"
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
          Add schedule
        </LoadingButton>
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <CreateChallengeTypeForm onSuccess={handleTypeOnSuccess} />
        </Box>
      </Modal>
    </LocalizationProvider>
  );
}
