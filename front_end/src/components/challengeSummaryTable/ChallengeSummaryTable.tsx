import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Chip,
  Box
} from "@mui/material";
import React, { FC } from "react";
import { useAsync } from "react-use";
import {
  SummaryDataScheduleShape,
  SummaryDataShape,
  SummaryDataUserShape,
  useChallengesClient
} from "../../clients/challenges";

type Props = {
  challenge_id: number;
  trigger: any;
};

const nonUserHeaders = ["date"];

const ChallengeSummaryTable: FC<Props> = ({ challenge_id, trigger }) => {
  const { getChallengeSummaryById } = useChallengesClient();

  const { loading, error, value } = useAsync(
    () =>
      challenge_id ? getChallengeSummaryById(challenge_id) : Promise.resolve(),
    [challenge_id, trigger]
  );

  const users = value?.headers.filter(
    (name) => nonUserHeaders.indexOf(name) === -1
  );

  const getSchedulesFromRow = (
    row: Record<string, string | SummaryDataUserShape>,
    user: string
  ): [string, SummaryDataScheduleShape][] => {
    return Object.entries(row[user]);
  };

  const roundToTwoDecimal = (num: string) =>
    Math.round(parseFloat(num) * 100) / 100;

  const formatSchedule = (key: string, schedule: SummaryDataScheduleShape) =>
    `${key}: ${roundToTwoDecimal(schedule.completed) || "0"}${
      schedule.target ? ` / ${roundToTwoDecimal(schedule.target)}` : ""
    } (${schedule.unit})`;

  if (!Array.isArray(value?.body)) {
    return null;
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {value?.headers?.map((name) => (
                <TableCell key={name}>{name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {value?.body?.map((row) => (
              <TableRow key={row.date.toString()}>
                <TableCell>
                  <strong>{String(row.date)}</strong>
                </TableCell>
                {users?.map((user) => (
                  <TableCell key={user}>
                    {getSchedulesFromRow(row, user).map(([key, schedule]) => (
                      <Chip
                        key={schedule.unit}
                        sx={{ mr: 1 }}
                        variant="outlined"
                        label={formatSchedule(key, schedule)}
                      />
                    ))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ChallengeSummaryTable;
