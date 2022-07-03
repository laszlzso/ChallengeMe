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

type Props = {
  challenge_id: number;
};

const nonUserHeaders = ["date"];

type SummaryDataScheduleShape = {
  target: string;
  completed: string;
  unit: string;
};

type SummaryDataUserShape = Record<string, SummaryDataScheduleShape>;

type SummaryDataShape = {
  headers: string[];
  body: Record<string, string | SummaryDataUserShape>[];
};

const ChallengeSummaryTable: FC<Props> = ({ challenge_id }) => {
  // const { getAllChallengeSchedules } = useChallengeSchedulesClient();

  // const { loading, error, value } = useAsync(getAllChallengeSchedules, [
  //   trigger
  // ]);

  const value: SummaryDataShape = {
    headers: ["date", "user_1", "user_2"],
    body: [
      {
        date: "222",
        user_1: {
          schedule_1: { target: "50", completed: "40", unit: "rep" },
          schedule_2: { target: "5.0", completed: "5.5", unit: "km" }
        },
        user_2: { schedule_1: { target: "5.0", completed: "3.5", unit: "km" } }
      }
    ]
  };

  const users = value?.headers.filter(
    (name) => nonUserHeaders.indexOf(name) === -1
  );

  const getSchedulesFromRow = (
    row: Record<string, string | SummaryDataUserShape>,
    user: string
  ): SummaryDataScheduleShape[] => {
    return Object.values(row[user]);
  };

  const formatSchedule = (schedule: SummaryDataScheduleShape) =>
    `${schedule.completed}/${schedule.target} (${schedule.unit})`;

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
                  <strong>{row.date}</strong>
                </TableCell>
                {users?.map((user) => (
                  <TableCell key={user}>
                    {getSchedulesFromRow(row, user).map((schedule) => (
                      <Chip
                        key={schedule.unit}
                        sx={{ mr: 1 }}
                        variant="outlined"
                        label={formatSchedule(schedule)}
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
