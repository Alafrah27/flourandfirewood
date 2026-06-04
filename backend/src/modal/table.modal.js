
import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tableNumber: {
        type: Number,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["available", "occupied", "cleaning"],
        default: "available"
    }
}, {
    timestamps: true
})

const Table = mongoose.model("Table", tableSchema);
export default Table