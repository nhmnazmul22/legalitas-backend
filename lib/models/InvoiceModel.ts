// Import Mongoose
import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

// Define the interface for the data
export interface Invoice extends Document {
  service: string;
  invNo: string;
  amount: string;
  dueDate: Date;
  description: string;
  status: string;
  paymentId: ObjectId;
  clientId: ObjectId;
}

// Define the schema
const DataSchema: Schema<Invoice> = new mongoose.Schema(
  {
    service: { type: String, required: true },
    invNo: { type: String, required: true },
    amount: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending",
    },
    clientId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    paymentId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const InvoiceModel: Model<Invoice> =
  mongoose.models.invoices || mongoose.model<Invoice>("invoices", DataSchema);

// Export the model
export default InvoiceModel;
