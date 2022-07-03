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

// EXAMPLE
// const value: SummaryDataShape = {
//   headers: ["date", "user_1", "user_2"],
//   body: [
//     {
//       date: "222",
//       user_1: {
//         schedule_1: { target: "50", completed: "40", unit: "rep" },
//         schedule_2: { target: "5.0", completed: "5.5", unit: "km" }
//       },
//       user_2: { schedule_1: { target: "5.0", completed: "3.5", unit: "km" } }
//     }
//   ]
// };

export type SummaryDataScheduleShape = {
  target: string;
  completed: string;
  unit: string;
};

export type SummaryDataUserShape = Record<string, SummaryDataScheduleShape>;

export type SummaryDataShape = {
  headers: string[];
  body: Record<string, string | SummaryDataUserShape>[];
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

  const getChallengeSummaryById = async (challenge_id: number) => {
    const response = await fetchAuthenticated(
      `/api/challenges/${challenge_id}/summary/`
    );
    return (await response.json()) as SummaryDataShape;
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
    getChallengeSummaryById,
    createChallenge
  };
};
