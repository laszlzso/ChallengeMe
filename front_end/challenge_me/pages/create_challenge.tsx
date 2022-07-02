import { Button, Container } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import ChallengesTable from "../src/components/challengesTable/ChallengesTable";
import CreateChallengeForm from "../src/components/createChallengeForm/CreateChallengeForm";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CreateChallengeForm />
    </>
  );
};

export default Home;
