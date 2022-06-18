import React, { useState } from "react";
import { Input, FormControl, InputLabel, TextField } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function CreateChallengeForm() {
  const [challenge, setChallenge] = useState<{
    title: string;
    startDate: Date | null;
    endDate: Date | null;
  }>({
    title: "",
    startDate: new Date(),
    endDate: new Date()
  });
  const { title, startDate, endDate } = challenge;

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    setLoading(true);

    fetch("/api/challenges/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(challenge)
    }).then(() => {
      setLoading(false);
      window.location.assign("/challenges");
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <h2>Create Your Challenge</h2>
      <form>
        <FormControl fullWidth>
          <InputLabel>Title</InputLabel>
          <Input
            value={title}
            onChange={({ target: { value } }) =>
              setChallenge({ ...challenge, title: value })
            }
          />
        </FormControl>
        <FormControl fullWidth style={{ marginTop: 30 }}>
          <DesktopDatePicker
            label="Start date"
            inputFormat="MM/dd/yyyy"
            value={startDate}
            onChange={(value) =>
              setChallenge({ ...challenge, startDate: value })
            }
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
        <FormControl fullWidth style={{ marginTop: 30 }}>
          <DesktopDatePicker
            label="End date"
            inputFormat="MM/dd/yyyy"
            value={endDate}
            onChange={(value) => setChallenge({ ...challenge, endDate: value })}
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
        <LoadingButton
          size="small"
          onClick={onSubmit}
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
