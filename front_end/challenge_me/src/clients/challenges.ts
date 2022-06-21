import { useFetch } from "../utils/api";

export type Challenge = {
  challenge_id: number;
  title: string;
  start_date: string;
  end_date: string;
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Fixing comments
export type NewChallengeShape = {
  title: string;
  startDate: Date;
  endDate: Date;
};

<<<<<<< HEAD
export const useChallengesClient = () => {
  const { fetchAuthenticated } = useFetch();

  const getAllChallenges = async () => {
    const response = await fetchAuthenticated("/api/challenges/");
    return (await response.json()) as Challenge[];
  };

  const createChallenge = async (data: NewChallengeShape) => {
    const response = await fetchAuthenticated("/api/challenges/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return (await response.json()) as Challenge;
  };

=======
=======
>>>>>>> Fixing comments
export const useChallengesClient = () => {
  const { fetchAuthenticated } = useFetch();

  const getAllChallenges = async () => {
    const response = await fetchAuthenticated("/api/challenges/");
    return (await response.json()) as Challenge[];
  };

  const createChallenge = async (data: NewChallengeShape) => {
    const response = await fetchAuthenticated("/api/challenges/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return (await response.json()) as Challenge;
  };

>>>>>>> Refactoring api + react hooks
  return {
    getAllChallenges,
    createChallenge
  };
};
