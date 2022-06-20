import "../styles/globals.css";
import type { AppProps } from "next/app";
import AuthProvider from "../src/components/authProvider";
import TopBar from "../src/components/topBar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <TopBar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
