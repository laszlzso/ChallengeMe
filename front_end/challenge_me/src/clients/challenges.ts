export type Challenge = {
  challenge_id: number;
  title: string;
  start_date: string;
  end_date: string;
};

export const getAllChallenges = async () => {
  const response = await fetch(process.env.SERVER_URL + "/challenges/");
  return await (response.json() as Promise<Challenge[]>);
};
