import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    imagekitFileId: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    side: {
      type: [
        {
          side_name: {
            type: String,
            required: true,
          },
          side_price: {
            type: Number,
            required: true,
          },
          side_image: {
            type: String,
          },
          side_imagekitFileId: {
            type: String,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
