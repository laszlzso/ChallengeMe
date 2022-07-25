import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import React from "react";
import { useAuthContext } from "../authProvider/AuthProvider";
import Avatar from "../avatar/Avatar";

const pages = ["Challenges"];

const TopBar = () => {
  const { user, logoutUser } = useAuthContext();

  return (
    <AppBar position="static" sx={{ mb: { xs: 2, md: 3 } }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {user ? (
            <>
              {pages.map((page) => (
                <Link key={page} href={`/${page?.toLocaleLowerCase()}`}>
                  <Button
                    sx={{ my: 2, color: "white", display: "inline-block" }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
              <Box sx={{ flexGrow: 1, alignSelf: "flex-end" }}></Box>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "inline-block",
                  mr: 2
                }}
                onClick={logoutUser}
              >
                Logout
              </Button>
              <Avatar />
              {/* <IconButton sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton> */}
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}></Box>
              <Box sx={{ flexGrow: 0 }}>
                <Link href="/login">
                  <Button
                    sx={{ my: 2, color: "white", display: "inline-block" }}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    sx={{ my: 2, color: "white", display: "inline-block" }}
                  >
                    Register
                  </Button>
                </Link>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
