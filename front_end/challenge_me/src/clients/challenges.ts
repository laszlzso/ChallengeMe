import { useFetch } from "../utils/api";

export type Challenge = {
  challenge_id: number;
  title: string;
  start_date: string;
  end_date: string;
};

export const useChallengesClient = () => {
  const { fetchAuthenticated } = useFetch();

  const getAllChallenges = async () => {
    const response = await fetchAuthenticated("/api/challenges/");
    return await (response.json() as Promise<Challenge[]>);
  };

  const createChallenge = async (data: any) => {
    // TODO: any???
    const response = await fetchAuthenticated("/api/challenges/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return await (response.json() as Promise<Challenge>);
  };

  return {
    getAllChallenges,
    createChallenge
  };
};
