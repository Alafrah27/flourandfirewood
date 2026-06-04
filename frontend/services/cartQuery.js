import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import Instance from "../utils/axois";

// Hook to get the user's cart
export const useGetCart = () => {
  const { getToken, isSignedIn } = useAuth();
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const token = await getToken();
        if (!token) return { products: [], totalPrice: 0 };
        const response = await Instance.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.cart;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to fetch cart"
        );
      }
    },
    enabled: !!isSignedIn, // Only fetch if user is signed in
  });
};

// Hook to add an item to the cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({ productId, quantity = 1, sides = [] }) => {
      try {
        const token = await getToken();
        const response = await Instance.post(
          "/cart",
          { productId, quantity, sides },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to add to cart"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Hook to update a cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({ productId, quantity }) => {
      try {
        const token = await getToken();
        const response = await Instance.put(
          "/cart",
          { productId, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to update cart"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Hook to remove an item from the cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (productId) => {
      try {
        const token = await getToken();
        const response = await Instance.delete(`/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to remove from cart"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Hook to clear the cart
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      try {
        const token = await getToken();
        const response = await Instance.delete("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to clear cart"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Hook to verify a Moyasar payment and create the order
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (paymentId) => {
      try {
        const token = await getToken();
        const response = await Instance.post(
          `/moyasar/payment/${paymentId}`,
          {},
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
            "Payment verification failed"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// Hook to get all orders for the authenticated user
export const useGetOrders = () => {
  const { getToken, isSignedIn } = useAuth();
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const token = await getToken();
        if (!token) return [];
        const response = await Instance.get("/order", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.orders;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to fetch orders"
        );
      }
    },
    enabled: !!isSignedIn,
  });
};

// Hook to get details of a specific order by ID
export const useGetOrderDetails = (orderId) => {
  const { getToken, isSignedIn } = useAuth();
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      try {
        const token = await getToken();
        if (!token || !orderId) return null;
        const response = await Instance.get(`/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.order;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to fetch order details"
        );
      }
    },
    enabled: !!isSignedIn && !!orderId,
  });
};

// Hook to get all orders across the restaurant (Admin only)
export const useGetAdminOrders = () => {
  const { getToken, isSignedIn } = useAuth();
  return useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      try {
        const token = await getToken();
        if (!token) return [];
        const response = await Instance.get("/order/admin/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.orders;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to fetch admin orders"
        );
      }
    },
    enabled: !!isSignedIn,
  });
};

// Hook to delete an order (Admin only)
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (orderId) => {
      try {
        const token = await getToken();
        const response = await Instance.delete(`/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to delete order"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

// Hook to fetch dashboard aggregation stats (Admin only)
export const useGetDashboardStats = () => {
  const { getToken, isSignedIn } = useAuth();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      try {
        const token = await getToken();
        if (!token) return null;
        const response = await Instance.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || "Failed to fetch dashboard statistics"
        );
      }
    },
    enabled: !!isSignedIn,
  });
};
