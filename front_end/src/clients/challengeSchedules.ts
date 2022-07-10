import { useFetch } from "../utils/api";

export type ChallengeSchedule = {
  challenge_schedule_id: number;
  challenge_id: number;
  user_id: number;
  challenge_type_id: number;

  total_goal: number;
  start_date: string;
  day_frequency: number;
};

export type NewChallengeScheduleShape = {
  challenge_id: number;
  user_id: number;
  challenge_type_id: number;

  total_goal: number;
  start_date: Date;
  day_frequency: number;
};

export const useChallengeSchedulesClient = () => {
  const { fetchAuthenticated } = useFetch();

  const getAllChallengeSchedules = async () => {
    const response = await fetchAuthenticated("/api/challenge-schedules/");
    return (await response.json()) as ChallengeSchedule[];
  };

  const getChallengeSchedulesByChallengeId = async (challenge_id: number) => {
    const response = await fetchAuthenticated(
      `/api/challenges/${challenge_id}/schedules/`
    );
    return (await response.json()) as ChallengeSchedule[];
  };

  const createChallengeSchedule = async (data: NewChallengeScheduleShape) => {
    const response = await fetchAuthenticated("/api/challenge-schedules/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.status === 400) {
      return Promise.reject(await response.json());
    }
    return Promise.resolve((await response.json()) as ChallengeSchedule);
  };

  return {
    getAllChallengeSchedules,
    getChallengeSchedulesByChallengeId,
    createChallengeSchedule
  };
};
