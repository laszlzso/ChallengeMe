import { useAuthContext } from "../src/components/authProvider/AuthProvider";
import { Box, Button, TextField, Typography } from "@mui/material";

const RegisterPage = () => {
  const { registerUser, user } = useAuthContext();

  const handleSubmit = (e: any) => {  // async?
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const password2 = e.target.password2.value;
    username.length > 0 && registerUser(username, password, password2);
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
          />
          <TextField
            fullWidth
            type="password"
            name="password"
            label="Password"
            variant="standard"
          />
          <TextField
            fullWidth
            type="password"
            name="password2"
            label="Password again"
            variant="standard"
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
