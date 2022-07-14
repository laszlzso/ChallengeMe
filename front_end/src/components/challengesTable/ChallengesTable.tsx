import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { useAsync } from "react-use";
import { Challenge, useChallengesClient } from "../../clients/challenges";

const ChallengesTable: FC = () => {
  const { getAllChallenges } = useChallengesClient();

  const router = useRouter();

  const { loading, error, value } = useAsync(getAllChallenges, []);

  if (!Array.isArray(value)) {
    return null;
  }

  const onRowClick = (challenge: Challenge) => {
    const { challenge_id, title } = challenge;
    router.push({
      pathname: `/challenge/${challenge_id}`,
      query: { title: title }
    })
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Start date</TableCell>
            <TableCell>End date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value?.map((row) => (
            <TableRow
              key={row.challenge_id}
              hover
              onClick={() => onRowClick(row)}
            >
              <TableCell>
                <strong>{row.challenge_id}</strong>
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.start_date}</TableCell>
              <TableCell>{row.end_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ChallengesTable;
