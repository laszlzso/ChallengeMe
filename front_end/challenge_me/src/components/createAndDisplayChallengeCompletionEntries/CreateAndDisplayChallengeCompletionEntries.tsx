import { Box } from "@mui/material";
import React, { FC, useState } from "react";
import ChallengeCompletionEntriesTable from "../challengeCompletionEntriesTable/ChallengeCompletionEntriesTable";
import ChallengeSchedulesTable from "../challengeSchedulesTable/ChallengeSchedulesTable";
import CreateChallengeCompletionEntryForm from "../createChallengeCompletionEntryForm/CreateChallengeCompletionEntryForm";
import CreateChallengeScheduleForm from "../createChallengeScheduleForm/CreateChallengeScheduleForm";

type Props = {
  challenge_id: number;
  onSuccess: () => void;
};

const CreateAndDisplayChallengeCompletionEntries: FC<Props> = ({
  challenge_id,
  onSuccess
}) => {
  const [loadCompletionEntriesTrigger, setLoadCompletionEntriesTrigger] =
    useState<number>(Date.now());

  const handleCompletionEntryCreation = () => {
    setLoadCompletionEntriesTrigger(Date.now());
    onSuccess();
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <ChallengeCompletionEntriesTable
          challenge_id={challenge_id}
          trigger={loadCompletionEntriesTrigger}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <CreateChallengeCompletionEntryForm
          challenge_id={challenge_id}
          onSuccess={handleCompletionEntryCreation}
        />
      </Box>
    </>
  );
};

export default CreateAndDisplayChallengeCompletionEntries;
