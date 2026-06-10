import { useQuery } from "@tanstack/react-query";
import Instance from "../utils/axios";

export const useGetProductsForMobile = (query = {}, options = {}) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: async () => {
      const res = await Instance.get("/product", {
        params: query,
        headers: {},
      });
      return res.data.products;
    },
    ...options,
  });
};

export const useCategoriesForMobile = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await Instance.get("/category");
        return response.data.categories;
      } catch (error) {
        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Failed to fetch categories",
        );
      }
    },
  });
};

export const useGetProductByIdForMobile = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await Instance.get(`/product/${id}`);
      return res.data.product;
    },
  });
};
