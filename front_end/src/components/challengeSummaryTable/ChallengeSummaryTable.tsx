import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip
} from "@mui/material";
import React, { FC } from "react";
import { useAsync } from "react-use";
import {
  SummaryDataScheduleShape,
  SummaryDataShape,
  SummaryDataUserShape,
  useChallengesClient
} from "../../clients/challenges";
import { isSameDate } from "../../utils/date";

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

  const getFormattedChip = (
    key: string,
    schedule: SummaryDataScheduleShape,
    dateString: string
  ) => {
    const props = {
      key: schedule.unit,
      sx: { mr: 1 },
      label: formatSchedule(key, schedule),
      size: "small" as any,
      variant: "outlined" as any,
      color: "default" as any
    };

    if (new Date(dateString) <= new Date()) {
      props.variant = "filled";
    }

    if (schedule.completed) {
      if (schedule.completed >= schedule.target) {
        props.color = "success";
      } else {
        props.color = "info";
      }
    }

    return <Chip {...props} />;
  };

  const getRowStyle = (dateString: string) => {
    if (isSameDate(new Date(dateString), new Date())) {
      return {
        backgroundColor: "rgba(0, 0, 0, 0.04)"
      };
    }
    return {};
  };

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
              <TableRow
                key={row.date.toString()}
                style={getRowStyle(row.date as string)}
              >
                <TableCell>
                  <strong>{String(row.date)}</strong>
                </TableCell>
                {users?.map((user) => (
                  <TableCell key={user}>
                    {getSchedulesFromRow(row, user).map(([key, schedule]) =>
                      getFormattedChip(key, schedule, row.date as string)
                    )}
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
