import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import React, { FC } from "react";
import { Challenge } from "../../clients";

type Props = {
  challenges: Challenge[];
};

const ChallengesTable: FC<Props> = ({ challenges }) => {
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
          {challenges?.map((row) => (
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
