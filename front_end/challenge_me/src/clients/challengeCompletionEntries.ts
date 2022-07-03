import { useFetch } from "../utils/api";

export type ChallengeCompletionEntry = {
  challenge_completion_entry_id: number;
  challenge_schedule_id: number;

  timestamp: string;
  amount: number;
};

export type NewChallengeCompletionEntryShape = {
  challenge_schedule_id: number;

  timestamp: Date;
  amount: number;
};

export const useChallengeCompletionEntryClient = () => {
  const { fetchAuthenticated } = useFetch();

  const getAllChallengeCompletionEntries = async () => {
    const response = await fetchAuthenticated(
      "/api/challenge-completion-entries/"
    );
    return (await response.json()) as ChallengeCompletionEntry[];
  };

  const getChallengeCompletionEntriesByChallengeId = async (
    challenge_id: number
  ) => {
    const response = await fetchAuthenticated(
      `/api/challenges/${challenge_id}/entries/`
    );
    return (await response.json()) as ChallengeCompletionEntry[];
  };

  const createChallengeCompletionEntry = async (
    data: NewChallengeCompletionEntryShape
  ) => {
    const response = await fetchAuthenticated(
      "/api/challenge-completion-entries/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
    if (response.status === 403) {
      return Promise.reject(await response.json());
    }
    if (response.status === 400) {
      return Promise.reject(await response.json());
    }
    return Promise.resolve((await response.json()) as ChallengeCompletionEntry);
  };

  return {
    getAllChallengeCompletionEntries,
    getChallengeCompletionEntriesByChallengeId,
    createChallengeCompletionEntry
  };
};
