import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import React, { FC } from "react";
import { useAsync } from "react-use";
import { useChallengesClient } from "../../clients/challenges";

const ChallengesTable: FC = () => {
  const { getAllChallenges } = useChallengesClient();

  const { loading, error, value } = useAsync(getAllChallenges, []);

  if (!Array.isArray(value)) {
    return null;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Start date</TableCell>
            <TableCell>Start end</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value?.map((row) => (
            <TableRow key={row.challenge_id}>
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
