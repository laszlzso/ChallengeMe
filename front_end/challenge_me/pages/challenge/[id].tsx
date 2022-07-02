import { Box, Button, Container, Typography } from "@mui/material";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ChallengesTable from "../../src/components/challengesTable/ChallengesTable";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Typography variant="h2" gutterBottom component="div">
        Challenge {id}
      </Typography>

      <Box
        sx={{
          "& .MuiTable-root": { mb: 2 },
          "& .MuiButton-root": { mb: 2 }
        }}
      ></Box>
    </>
  );
};

export default Home;
