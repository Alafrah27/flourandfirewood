import axios from "axios";
import ImageKit from "imagekit-javascript";
import Instance from "../utils/axios";

// ==========================================
// 1. Raw Axios Implementation (Recommended for React Native)
// ==========================================
/**
 * Uploads a local file (e.g., from expo-image-picker) to ImageKit using raw FormData and Axios.
 * This is the most reliable method in React Native, avoiding peer dependency and file object bugs.
 * 
 * @param {string} localUri - The local file URI (e.g., file:///...)
 * @param {string} folder - The ImageKit target folder (e.g., "/products" or "/profiles")
 * @returns {Promise<{url: string, fileId: string}>} Uploaded file details
 */
export const uploadImageToImageKit = async (localUri, folder = "/products") => {
    if (!localUri) return null;

    try {
        // 1. Fetch authentication parameters from your Express backend
        const authResponse = await Instance.get("/imagekit");
        const { token, expire, signature } = authResponse.data;

        // 2. Extract filename and extension for the file payload
        const fileName = localUri.split('/').pop() || 'upload.jpg';
        const extension = fileName.split('.').pop() || 'jpg';
        const mimeType = `image/${extension === 'png' ? 'png' : 'jpeg'}`;

        // 3. Prepare FormData (React Native requires this specific shape for files)
        const formData = new FormData();
        
        // React Native wraps file objects in this shape to bridge them to native uploaders
        formData.append("file", {
            uri: localUri,
            name: fileName,
            type: mimeType
        });
        formData.append("fileName", fileName);
        formData.append("publicKey", process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY || "");
        formData.append("signature", signature);
        formData.append("expire", expire);
        formData.append("token", token);
        formData.append("folder", folder);

        // 4. Send POST request to ImageKit Upload API
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
    } catch (error) {
        console.error("ImageKit Axios upload error:", error);
        throw new Error(
            error.response?.data?.message || 
            error.message || 
            "Failed to upload image to ImageKit using Axios"
        );
    }
};

// ==========================================
// 2. ImageKit SDK-Based Implementation
// ==========================================
// Initialize the ImageKit Javascript client
const imagekitClient = new ImageKit({
    publicKey: process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    authenticationEndpoint: `${process.env.EXPO_PUBLIC_API_ENDPOINT}/imagekit`
});

/**
 * Uploads a local file to ImageKit using the ImageKit-Javascript SDK client.
 * 
 * @param {string} localUri - The local file URI (e.g., file:///...)
 * @param {string} folder - The ImageKit target folder (e.g., "/products")
 * @returns {Promise<{url: string, fileId: string}>} Uploaded file details
 */
export const uploadImageWithSDK = async (localUri, folder = "/products") => {
    if (!localUri) return null;

    try {
        const fileName = localUri.split('/').pop() || 'upload.jpg';
        const extension = fileName.split('.').pop() || 'jpg';
        const mimeType = `image/${extension === 'png' ? 'png' : 'jpeg'}`;

        const fileObj = {
            uri: localUri,
            name: fileName,
            type: mimeType
        };

        return new Promise((resolve, reject) => {
            imagekitClient.upload({
                file: fileObj,
                fileName: fileName,
                folder: folder
            }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        url: result.url,
                        fileId: result.fileId
                    });
                }
            });
        });
    } catch (error) {
        console.error("ImageKit SDK upload error:", error);
        throw error;
    }
};

/**
 * Transforms an image URL to a resized and optimized ImageKit URL on the fly.
 * 
 * @param {string} src - The original absolute URL of the image
 * @param {number} width - The target width of the image (default 128)
 * @param {number} height - The target height of the image (default 128)
 * @param {number} quality - The compression quality (default 80)
 * @returns {string} The transformed and optimized ImageKit URL
 */
export const getImageKitUrl = (src, width = 128, height = 128, quality = 80) => {
    if (!src) return '';
    
    // Only apply ImageKit transformations to images hosted on ImageKit
    if (!src.includes('ik.imagekit.io')) {
        return src;
    }

    try {
        return imagekitClient.url({
            src: src,
            transformation: [
                {
                    width: width.toString(),
                    height: height.toString(),
                    quality: quality.toString(),
                }
            ]
        });
    } catch (e) {
        console.error("Error generating ImageKit transformed URL:", e);
        return src;
    }
};
