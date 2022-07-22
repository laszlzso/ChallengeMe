import "../styles/globals.css";
import type { AppProps } from "next/app";
import AuthProvider from "../src/components/authProvider";
import TopBar from "../src/components/topBar/TopBar";
import { Container, Box } from "@mui/material";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <TopBar />
      <Container maxWidth="lg">
        <Component {...pageProps} />
      </Container>
    </AuthProvider>
  );
}

export default MyApp;
