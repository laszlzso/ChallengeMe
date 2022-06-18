import React from "react";
import { useAsync } from "react-use";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "grommet";

export default function ChallengesTable() {
  const { loading, error, value } = useAsync(async () => {
    return fetch("/api/challenges/").then((response) => response.json());
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell scope="col" border="bottom">
            Id
          </TableCell>
          <TableCell scope="col" border="bottom">
            Title
          </TableCell>
          <TableCell scope="col" border="bottom">
            Start date
          </TableCell>
          <TableCell scope="col" border="bottom">
            Start end
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell scope="row">
            <strong>Eric</strong>
          </TableCell>
          <TableCell>Coconut</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row">
            <strong>Chris</strong>
          </TableCell>
          <TableCell>Watermelon</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
