import { Box, Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import { useAuthContext } from "../authProvider/AuthProvider";

const TopBar = () => {
  const { user, logoutUser } = useAuthContext();
  return (
    <nav>
      <Box
        sx={{
          backgroundColor: "primary.light",
          p: 2
        }}
      >
        {user ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ "& .MuiButton-root": { mr: 2 } }}>
                <Link href="/challenges">
                  <Button variant="contained">Challenges</Button>
                </Link>
              </Box>
              <Box sx={{ "& .MuiButton-root": { ml: 2 } }}>
                <Button variant="contained" onClick={logoutUser}>
                  Logout
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ "& .MuiButton-root": { mr: 2 } }}></Box>
              <Box sx={{ "& .MuiButton-root": { ml: 2 } }}>
                <Link href="/login">
                  <Button variant="contained">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="contained">Register</Button>
                </Link>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </nav>
  );
};

export default TopBar;
