import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import React from "react";
import { useAsync } from "react-use";

type Challenge = {
  challenge_id: number;
  title: string;
  start_date: string;
  end_date: string;
};

export default function ChallengesTable() {
  const { loading, error, value } = useAsync(async () => {
    return fetch("/api/challenges/").then((response) => response.json());
  }, []);

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
}
