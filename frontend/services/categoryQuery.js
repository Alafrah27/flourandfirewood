import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import Instance from "../utils/axois";

// Helper function to upload image to ImageKit
export const uploadImageToImageKit = async (file) => {
  if (!file) throw new Error("No file provided for upload");
  
  // 1. Fetch authentication parameters from backend
  const authResponse = await Instance.get("/imagekit");
  const { token, expire, signature } = authResponse.data;

  // 2. Prepare FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
  formData.append("signature", signature);
  formData.append("expire", expire);
  formData.append("token", token);
  formData.append("folder", "/categories");

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

// Hook to fetch all categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await Instance.get("/category");
        return response.data.categories;
      } catch (error) {
        throw new Error(error.response?.data?.error || error.message || "Failed to fetch categories");
      }
    },
  });
};

// Hook to create a category (including ImageKit upload step)
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ categoryName, backgroundColor, imageFile }) => {
      try {
        // 1. Upload image to ImageKit first
        const uploadResult = await uploadImageToImageKit(imageFile);
        
        // 2. Create category on the backend with the uploaded URL and fileId
        const token = await getToken();
        const response = await Instance.post(
          "/category",
          {
            categoryName,
            backgroundColor,
            imageUrl: uploadResult.url,
            imagekitFileId: uploadResult.fileId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || error.message || "Failed to create category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Hook to delete a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const token = await getToken();
        const response = await Instance.delete(`/category/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || error.message || "Failed to delete category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Hook to update a category (including optional ImageKit upload step)
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ id, categoryName, backgroundColor, imageUrl, imageFile }) => {
      try {
        let finalImageUrl = imageUrl;
        let finalImagekitFileId = undefined;

        // If a new file is passed, upload it first
        if (imageFile instanceof File) {
          const uploadResult = await uploadImageToImageKit(imageFile);
          finalImageUrl = uploadResult.url;
          finalImagekitFileId = uploadResult.fileId;
        }

        const token = await getToken();
        const response = await Instance.put(
          `/category/${id}`,
          {
            categoryName,
            backgroundColor,
            imageUrl: finalImageUrl,
            imagekitFileId: finalImagekitFileId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || error.message || "Failed to update category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
