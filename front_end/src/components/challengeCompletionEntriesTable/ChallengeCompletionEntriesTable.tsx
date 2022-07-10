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
import { useChallengeCompletionEntryClient } from "../../clients/challengeCompletionEntries";
import { useChallengesClient } from "../../clients/challenges";
import { useChallengeSchedulesClient } from "../../clients/challengeSchedules";

type Props = {
  challenge_id: number;
  trigger: any;
};

const ChallengeCompletionEntriesTable: FC<Props> = ({
  challenge_id,
  trigger
}) => {
  const { getChallengeCompletionEntriesByChallengeId } =
    useChallengeCompletionEntryClient();

  const { loading, error, value } = useAsync(
    () =>
      challenge_id
        ? getChallengeCompletionEntriesByChallengeId(challenge_id)
        : Promise.resolve(),
    [trigger, challenge_id]
  );

  if (!Array.isArray(value)) {
    return null;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom component="div">
        Completion Entries
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Challenge completion entry id</TableCell>
              <TableCell>Challenge schedule id</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value?.map((row) => (
              <TableRow key={row.challenge_completion_entry_id}>
                <TableCell>
                  <strong>{row.challenge_completion_entry_id}</strong>
                </TableCell>
                <TableCell>{row.challenge_schedule_id}</TableCell>
                <TableCell>{row.timestamp}</TableCell>
                <TableCell>{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ChallengeCompletionEntriesTable;
