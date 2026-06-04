import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import Instance from "../utils/axois";

// Hook to fetch all tables (with optional filters: status, minCapacity)
export const useGetTables = (params = {}) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["tables", params],
    queryFn: async () => {
      try {
        const token = await getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await Instance.get("/table", {
          params,
          headers,
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch tables"
        );
      }
    },
  });
};

// Hook to fetch a single table by ID
export const useGetTableById = (id) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["table", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const token = await getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await Instance.get(`/table/${id}`, {
          headers,
        });
        return response.data.table;
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch table details"
        );
      }
    },
    enabled: !!id,
  });
};

// Hook to create a new table (admin only)
export const useCreateTable = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (tableData) => {
      try {
        const token = await getToken();
        const response = await Instance.post("/table", tableData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to create table"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};

// Hook to update a table (admin only)
export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...tableData }) => {
      try {
        const token = await getToken();
        const response = await Instance.put(`/table/${id}`, tableData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update table"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};

// Hook to update table status only
export const useUpdateTableStatus = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      try {
        const token = await getToken();
        const response = await Instance.patch(
          `/table/${id}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update table status"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};

// Hook to delete a table (admin only)
export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const token = await getToken();
        const response = await Instance.delete(`/table/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete table"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};
