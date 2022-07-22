import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useContext } from "react";
import { useAuthContext } from "../src/components/authProvider/AuthProvider";

const LoginPage = () => {
  const { loginUser, user } = useAuthContext();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    username.length > 0 && loginUser(username, password);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <Container maxWidth="xs" disableGutters>
          <Typography variant="h2" gutterBottom component="div">
            Login
          </Typography>
          <hr />
          <Box
            sx={{
              "& .MuiTextField-root": { my: 1 },
              "& .MuiButton-root": { my: 1 }
            }}
          >
            <TextField
              fullWidth
              name="username"
              label="Username"
              variant="standard"
            />
            <TextField
              fullWidth
              type="password"
              name="password"
              label="Password"
              variant="standard"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained">
                Login
              </Button>
            </Box>
          </Box>
        </Container>
      </form>
    </section>
  );
};

export default LoginPage;
