import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>ChallengeMe</title>
        <meta name="description" content="Let's get better together" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>ChallengeMe!</a>
        </h1>

        <p className={styles.description}>
          Challenge your friends and push each other to do those daily push-ups,
          read that book you&apos;ve been wanting to, or whatever you&apos;d
          like
        </p>
      </main>

      <footer className={styles.footer}>
        Powered by <span className={styles.logo}>ZsR</span>
      </footer>
    </div>
  );
};

export default Home;
