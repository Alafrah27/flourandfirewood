import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    numberOfGuests: {
       adults:{
        type:Number,
        required:true,
        min:0
       },
       children:{
        type:Number,
        required:true,
        min:0
       },
       total:{
        type:Number,
        required:true,
        min:0
       }
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
