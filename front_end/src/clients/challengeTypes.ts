import { useFetch } from "../utils/api";

export type ChallengeType = {
  challenge_type_id: number;
  name: string;
  unit: string;
};

export type NewChallengeTypeShape = {
  name: string;
  unit: string;
};

export const useChallengeTypesClient = () => {
  const { fetchAuthenticated } = useFetch();

  const getAllChallengeTypes = async () => {
    const response = await fetchAuthenticated("/api/challenge-types/");
    return (await response.json()) as ChallengeType[];
  };

  const createChallengeType = async (data: NewChallengeTypeShape) => {
    const response = await fetchAuthenticated("/api/challenge-types/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.status === 400) {
      return Promise.reject(await response.json());
    }
    return Promise.resolve((await response.json()) as ChallengeType);
  };

  return {
    getAllChallengeTypes,
    createChallengeType
  };
};
