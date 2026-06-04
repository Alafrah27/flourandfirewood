import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagekitFileId: {
      type: String,
    },
    backgroundColor:{
        type: String
    }
  },
  { timestamps: true },
);

const Category = model("Category", categorySchema);
export default Category;
