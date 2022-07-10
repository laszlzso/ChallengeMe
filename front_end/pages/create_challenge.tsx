import { Box, Button, Container } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import {
  Challenge,
  NewChallengeShape,
  useChallengesClient
} from "../src/clients/challenges";
import { NewChallengeScheduleShape } from "../src/clients/challengeSchedules";
import ChallengesTable from "../src/components/challengesTable/ChallengesTable";
import CreateChallengeForm from "../src/components/createChallengeForm/CreateChallengeForm";
import CreateChallengeScheduleForm from "../src/components/createChallengeScheduleForm/CreateChallengeScheduleForm";
import CreateChallengeTypeForm from "../src/components/createChallengeTypeForm/CreateChallengeTypeForm";
import styles from "../styles/Home.module.css";
import CreateAndDisplayChallengeSchedules from "../src/components/createAndDisplayChallengeSchedules/CreateAndDisplayChallengeSchedules";
import Router, { useRouter } from "next/router";

const Home: NextPage = () => {
  const { query } = useRouter();

  const challenge = JSON.parse(
    Array.isArray(query.challenge)
      ? query.challenge.join("")
      : query.challenge || "null"
  );

  const { createChallenge } = useChallengesClient();

  const handleCreateChallenge = async (data: NewChallengeShape) => {
    return createChallenge(data).then((response) => {
      Router.push({
        pathname: "/create_challenge",
        query: { challenge: JSON.stringify(response) }
      });
    });
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CreateChallengeForm
        onCreateChallenge={handleCreateChallenge}
        challenge={challenge}
      />
      {challenge && (
        <CreateAndDisplayChallengeSchedules
          challenge_id={challenge?.challenge_id}
        />
      )}
    </>
  );
};

export default Home;