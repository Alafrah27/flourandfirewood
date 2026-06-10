import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import Instance from "../utils/axios";
import { useAuth } from "@clerk/expo";

export const useGetCartForMobile = () => {
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
        enabled: !!isSignedIn,
    });
};

export const useAddToCartForMobile = () => {
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

export const useCreateUserForMobile = () => {
    const { getToken } = useAuth();
    return useMutation({
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
                throw new Error(
                    error.response?.data?.message || error.message || "Failed to sync user"
                );
            }
        }
    });
};

export const useUpdateCartItemForMobile = () => {
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

export const useRemoveFromCartForMobile = () => {
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

export const useVerifyPaymentForMobile = () => {
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

export const useGetOrderByIdForMobile = (orderId) => {
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
                    error.response?.data?.message ||
                        error.message ||
                        "Failed to fetch order details"
                );
            }
        },
        enabled: !!isSignedIn && !!orderId,
    });
};