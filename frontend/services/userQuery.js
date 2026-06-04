import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs";
import Instance from "../utils/axois";
import { useSearchParams } from "next/navigation";

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    const { mutateAsync: createUser, isPending: isLoading, error: isError } = useMutation({
        mutationFn: async () => {
            try {
                const token = await getToken();
                const response = await Instance.post("/user", {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.message || error.message);
            }
        },
        retry: (failureCount, error) => {
            // Automatically retry up to 3 times for Network Errors or 5xx server errors
            if (error.message.includes("Network Error") || error.message.includes("500") || error.message.includes("502") || error.message.includes("503") || error.message.includes("504")) {
                return failureCount < 3;
            }
            return false;
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Clerk user sync mutation failed:", error.message);
        }
    });

    return { createUser, isLoading, isError };
};

export const useGetUsers = () => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["users", search, page, limit, role],
        queryFn: async () => {
            try {
                const token = await getToken();
                const queryStr = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    search,
                    role
                }).toString();
                const response = await Instance.get(`/user?${queryStr}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.error || error.message || "Failed to fetch users");
            }
        },
        placeholderData: (keepPreviousData) => keepPreviousData,
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async (id) => {
            try {
                const token = await getToken();
                const response = await Instance.delete(`/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.error || error.message || "Failed to delete user");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });
};