import { Box } from "@mui/material";
import React, { FC, useState } from "react";
import ChallengeSchedulesTable from "../challengeSchedulesTable/ChallengeSchedulesTable";
import CreateChallengeScheduleForm from "../createChallengeScheduleForm/CreateChallengeScheduleForm";

type Props = {
  challenge_id: number;
};

const CreateAndDisplayChallengeSchedules: FC<Props> = ({ challenge_id }) => {
  const [loadSchedulesTrigger, setLoadSchedulesTrigger] = useState<number>(
    Date.now()
  );

  const handleScheduleCreation = () => {
    setLoadSchedulesTrigger(Date.now());
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <CreateChallengeScheduleForm
          challenge_id={challenge_id}
          onSuccess={handleScheduleCreation}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <ChallengeSchedulesTable
          challenge_id={challenge_id}
          trigger={loadSchedulesTrigger}
        />
      </Box>
    </>
  );
};

export default CreateAndDisplayChallengeSchedules;
