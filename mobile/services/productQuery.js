import { useQuery } from "@tanstack/react-query";
import Instance from "../utils/axios";

export const useGetProductsForMobile = (query = {}) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: async () => {
      const res = await Instance.get("/product", { params: query, headers: {} });
      return res.data.products;
    },
  });
};
