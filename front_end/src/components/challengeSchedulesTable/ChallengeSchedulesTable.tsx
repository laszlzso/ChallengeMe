import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from "@mui/material";
import React, { FC } from "react";
import { useAsync } from "react-use";
import { Challenge, useChallengesClient } from "../../clients/challenges";
import { useChallengeSchedulesClient } from "../../clients/challengeSchedules";

type Props = {
  challenge: Challenge;
  trigger: any;
};

const ChallengeSchedulesTable: FC<Props> = ({ challenge, trigger }) => {
  const { getChallengeSchedulesByChallengeId } = useChallengeSchedulesClient();

  const { loading, error, value } = useAsync(
    () => getChallengeSchedulesByChallengeId(challenge.challenge_id),
    [trigger]
  );

  if (!Array.isArray(value)) {
    return null;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom component="div">
        Your Schedules
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Challenge schedule id</TableCell>
              <TableCell>Challenge id</TableCell>
              <TableCell>User id</TableCell>
              <TableCell>Challenge type id</TableCell>
              <TableCell>Daily goal</TableCell>
              <TableCell>Start date</TableCell>
              <TableCell>Day frequency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value?.map((row) => (
              <TableRow key={row.challenge_schedule_id}>
                <TableCell>
                  <strong>{row.challenge_schedule_id}</strong>
                </TableCell>
                <TableCell>{row.challenge_id}</TableCell>
                <TableCell>{row.user_id}</TableCell>
                <TableCell>{row.challenge_type_id}</TableCell>
                <TableCell>{row.daily_goal}</TableCell>
                <TableCell>{row.start_date}</TableCell>
                <TableCell>{row.day_frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ChallengeSchedulesTable;
