import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import Instance from "../utils/axois";

// Hook to fetch restaurant settings (public)
export const useGetSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        const response = await Instance.get("/settings");
        return response.data.settings;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to fetch settings"
        );
      }
    },
  });
};

// Hook to create restaurant settings (one-time setup)
export const useCreateSettings = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (settingsData) => {
      try {
        const token = await getToken();
        const response = await Instance.post("/settings", settingsData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to create settings"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

// Hook to update restaurant settings (partial update)
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (settingsData) => {
      try {
        const token = await getToken();
        const response = await Instance.put("/settings", settingsData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to update settings"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

// Hook to toggle restaurant open/closed status
export const useToggleOpen = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      try {
        const token = await getToken();
        const response = await Instance.patch("/settings/toggle-open", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to toggle status"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};
