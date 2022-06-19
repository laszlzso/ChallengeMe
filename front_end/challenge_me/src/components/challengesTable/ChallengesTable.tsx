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
import { Challenge } from "../../clients";
import { useFetch } from "../../utils/api";

const ChallengesTable: FC = () => {
  const { fetchAuthenticated } = useFetch();

  const { loading, error, value } = useAsync(async () => {
    return fetchAuthenticated("/api/challenges/").then(
      (response) => response.json() as Promise<Challenge[]>
    );
  }, []);

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
