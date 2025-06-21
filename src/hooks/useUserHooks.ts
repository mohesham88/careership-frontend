import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  is_premium: boolean;
  phone: string;
  avatar: string | null;
}

const getUser = async () => {
  const { data } = await api.get(`/auth/profile/`);
  return data;
};

const updateUserProfile = async (formData: FormData) => {
  const { data } = await api.patch(`/auth/profile/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUser,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
};
