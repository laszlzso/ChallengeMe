import { Box } from "@mui/material";
import React, { FC, useState } from "react";
import { Challenge } from "../../clients/challenges";
import ChallengeSchedulesTable from "../challengeSchedulesTable/ChallengeSchedulesTable";
import CreateChallengeScheduleForm from "../createChallengeScheduleForm/CreateChallengeScheduleForm";

type Props = {
  challenge: Challenge;
};

const CreateAndDisplayChallengeSchedules: FC<Props> = ({ challenge }) => {
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
          challenge={challenge}
          onSuccess={handleScheduleCreation}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <ChallengeSchedulesTable
          challenge={challenge}
          trigger={loadSchedulesTrigger}
        />
      </Box>
    </>
  );
};

export default CreateAndDisplayChallengeSchedules;
