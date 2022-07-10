import { useAuthContext } from "../src/components/authProvider/AuthProvider";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

type ErrorShape = Record<string, string[]>;

const RegisterPage = () => {
  const { registerUser, user } = useAuthContext();

  const [ errors, setErrors ] = useState<ErrorShape>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const password2 = e.target.password2.value;
    try {
      username.length > 0 && await registerUser(username, password, password2);
    } catch (error) {
      setErrors(error as ErrorShape);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <Typography variant="h2" gutterBottom component="div">
          Register
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
            error={!!errors?.username}
            helperText={errors?.username}
          />
          <TextField
            fullWidth
            type="password"
            name="password"
            label="Password"
            variant="standard"
            error={!!errors?.password}
            helperText={errors?.password}
          />
          <TextField
            fullWidth
            type="password"
            name="password2"
            label="Password again"
            variant="standard"
            error={!!errors?.password2}
            helperText={errors?.password2}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained">
              Register
            </Button>
          </Box>
        </Box>
      </form>
    </section>
  );
};

export default RegisterPage;
