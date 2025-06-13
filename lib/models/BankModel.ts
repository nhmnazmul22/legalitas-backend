// Import Mongoose
import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

// Define the interface for the data
export interface BankInfo extends Document {
  bankName: string;
  accountNo: string;
  accountHolder: string;
  address?: string;
}

// Define the schema
const DataSchema: Schema<BankInfo> = new mongoose.Schema(
  {
    bankName: { type: String, required: true },
    accountNo: { type: String, required: true },
    accountHolder: { type: String, required: true },
    address: { type: String },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const BankModel: Model<BankInfo> =
  mongoose.models.banks || mongoose.model<BankInfo>("banks", DataSchema);

// Export the model
export default BankModel;
