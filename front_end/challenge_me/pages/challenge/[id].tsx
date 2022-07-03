import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, Typography } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from "next";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { useChallengesClient } from "../../src/clients/challenges";
import ChallengesTable from "../../src/components/challengesTable/ChallengesTable";
import CreateAndDisplayChallengeCompletionEntries from "../../src/components/createAndDisplayChallengeCompletionEntries/CreateAndDisplayChallengeCompletionEntries";
import CreateChallengeCompletionEntryForm from "../../src/components/createChallengeCompletionEntryForm/CreateChallengeCompletionEntryForm";
import styles from "../styles/Home.module.css";
import ChallengeSummaryTable from "../../src/components/challengeSummaryTable/ChallengeSummaryTable";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const challenge_id = parseInt(Array.isArray(id) ? id.join("") : id || "");

  const { getChallengeById } = useChallengesClient();
  const [editLoading, setEditLoading] = useState<boolean>(false);

  const [loadSummaryTrigger, setLoadSummaryTrigger] = useState<number>(
    Date.now()
  );

  const handleEntryCreation = () => {
    setLoadSummaryTrigger(Date.now());
  };

  const handleEditChallenge = () => {
    setEditLoading(true);

    getChallengeById(challenge_id)
      .then((challenge) => {
        Router.push({
          pathname: "/create_challenge",
          query: { challenge: JSON.stringify(challenge) }
        });
      })
      .finally(() => setEditLoading(false));
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" gutterBottom component="div">
            Challenge {id}
          </Typography>
        </Box>
        <LoadingButton
          onClick={handleEditChallenge}
          endIcon={<SendIcon />}
          loading={editLoading}
          loadingPosition="end"
          variant="contained"
        >
          Edit Challenge
        </LoadingButton>
      </Box>

      <Box
        sx={{
          "& .MuiTable-root": { mb: 2 },
          "& .MuiButton-root": { mb: 2 }
        }}
      >
        <ChallengeSummaryTable
          challenge_id={challenge_id}
          trigger={loadSummaryTrigger}
        />
        <CreateAndDisplayChallengeCompletionEntries
          challenge_id={challenge_id}
          onSuccess={handleEntryCreation}
        />
      </Box>
    </>
  );
};

export default Home;
