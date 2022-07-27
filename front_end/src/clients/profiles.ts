import { useFetch } from "../utils/api";

export const useProfileClient = () => {
  const { fetchAuthenticated } = useFetch();

  const uploadProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.set("image", file);

    const response = await fetchAuthenticated(`/api/profile/images/`, {
      method: "POST",
      body: formData
    });
    // return (await response.json()) as ChallengeCompletionEntry[];
  };

  return {
    uploadProfileImage
  };
};
