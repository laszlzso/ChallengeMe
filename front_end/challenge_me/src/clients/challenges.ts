export type Challenge = {
  challenge_id: number;
  title: string;
  start_date: string;
  end_date: string;
};

export const getAllChallenges_Server = async () => {
  const response = await fetch(process.env.SERVER_URL + "/challenges/");
  return await (response.json() as Promise<Challenge[]>);
};

export const getAllChallenges = async () => {
  const response = await fetch("/api/challenges/");
  return await (response.json() as Promise<Challenge[]>);
};
