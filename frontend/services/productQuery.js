import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import Instance from "../utils/axois";

// Helper function to upload image to ImageKit
export const uploadImageToImageKit = async (file, folder = "/products") => {
  if (!file) return null;
  
  // 1. Fetch authentication parameters from backend
  const authResponse = await Instance.get("/imagekit");
  const { token, expire, signature } = authResponse.data;

  // 2. Prepare FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "");
  formData.append("signature", signature);
  formData.append("expire", expire);
  formData.append("token", token);
  formData.append("folder", folder);

  // 3. Upload to ImageKit
  const uploadResponse = await axios.post(
    "https://upload.imagekit.io/api/v1/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return {
    url: uploadResponse.data.url,
    fileId: uploadResponse.data.fileId,
  };
};

// Hook to create a product (including ImageKit uploads)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (productData) => {
      try {
        const {
          productName,
          productPrice,
          productDescription,
          productCategory,
          productImage,
          featured,
          sides,
        } = productData;

        // 1. Upload product image to ImageKit
        let productImageUrl = "";
        let productImagekitFileId = "";
        if (productImage) {
          const uploadResult = await uploadImageToImageKit(productImage, "/products");
          if (uploadResult) {
            productImageUrl = uploadResult.url;
            productImagekitFileId = uploadResult.fileId;
          }
        }

        // 2. Upload side images if present
        const side = [];
        if (sides && Array.isArray(sides)) {
          for (const item of sides) {
            let sideImageUrl = "";
            let sideImagekitFileId = "";
            if (item.side_image) {
              const uploadResult = await uploadImageToImageKit(item.side_image, "/sides");
              if (uploadResult) {
                sideImageUrl = uploadResult.url;
                sideImagekitFileId = uploadResult.fileId;
              }
            }
            side.push({
              side_name: item.side_name,
              side_price: Number(item.side_price),
              side_image: sideImageUrl || undefined,
              side_imagekitFileId: sideImagekitFileId || undefined,
            });
          }
        }

        // 3. Create product on the backend
        const token = await getToken();
        const response = await Instance.post(
          "/product",
          {
            productName,
            productPrice: Number(productPrice),
            productDescription,
            productCategory,
            productImage: productImageUrl,
            imagekitFileId: productImagekitFileId,
            featured: !!featured,
            side,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || "Failed to create product");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useGetProducts = (params = {}) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      try {
        const token = await getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await Instance.get("/product", {
          params,
          headers,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || "Failed to fetch products");
      }
    },
  });
};

// Hook to delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const token = await getToken();
        const response = await Instance.delete(`/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || "Failed to delete product");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Hook to update a product (including optional ImageKit uploads)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...productData }) => {
      try {
        const {
          productName,
          productPrice,
          productDescription,
          productCategory,
          productImage,
          imagekitFileId,
          featured,
          sides,
        } = productData;

        // 1. Upload new product image to ImageKit if it's a File object
        let finalProductImageUrl = productImage;
        let finalProductImagekitFileId = imagekitFileId;
        if (productImage instanceof File) {
          const uploadResult = await uploadImageToImageKit(productImage, "/products");
          if (uploadResult) {
            finalProductImageUrl = uploadResult.url;
            finalProductImagekitFileId = uploadResult.fileId;
          }
        }

        // 2. Upload side images if new File is passed
        const side = [];
        if (sides && Array.isArray(sides)) {
          for (const item of sides) {
            let sideImageUrl = item.side_image;
            let sideImagekitFileId = item.side_imagekitFileId;
            if (item.side_image instanceof File) {
              const uploadResult = await uploadImageToImageKit(item.side_image, "/sides");
              if (uploadResult) {
                sideImageUrl = uploadResult.url;
                sideImagekitFileId = uploadResult.fileId;
              }
            }
            side.push({
              side_name: item.side_name,
              side_price: Number(item.side_price),
              side_image: sideImageUrl || undefined,
              side_imagekitFileId: sideImagekitFileId || undefined,
            });
          }
        }

        // 3. Update product on the backend
        const token = await getToken();
        const response = await Instance.put(
          `/product/${id}`,
          {
            productName,
            productPrice: Number(productPrice),
            productDescription,
            productCategory,
            productImage: finalProductImageUrl,
            imagekitFileId: finalProductImagekitFileId,
            featured: !!featured,
            side,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || "Failed to update product");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Hook to fetch a single product by ID
export const useGetProductById = (id) => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const token = await getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await Instance.get(`/product/${id}`, {
          headers,
        });
        return response.data.product;
      } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || "Failed to fetch product details");
      }
    },
    enabled: !!id,
  });
};
