import { useFetch } from "../utils/api";

export type Challenge = {
  challenge_id: number;
  title: string;
  start_date: string;
  end_date: string;
};

export type NewChallengeShape = {
  title: string;
  start_date: Date;
  end_date: Date;
};

export const useChallengesClient = () => {
  const { fetchAuthenticated } = useFetch();

  const getAllChallenges = async () => {
    const response = await fetchAuthenticated("/api/challenges/");
    return (await response.json()) as Challenge[];
  };

  const getChallengeById = async (challenge_id: number) => {
    const response = await fetchAuthenticated(
      `/api/challenges/${challenge_id}/`
    );
    return (await response.json()) as Challenge;
  };

  const createChallenge = async (data: NewChallengeShape) => {
    const response = await fetchAuthenticated("/api/challenges/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.status === 400) {
      return Promise.reject(await response.json());
    }
    return Promise.resolve((await response.json()) as Challenge);
  };

  return {
    getAllChallenges,
    getChallengeById,
    createChallenge
  };
};
