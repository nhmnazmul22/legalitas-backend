// Import Mongoose
import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

// Define the interface for the data
export interface IUser extends Document {
  fullName: string;
  email: string;
  whatsappNumber: string;
  service: string;
  proposalId: ObjectId;
  username: string;
  password: string;
  notes?: string;
  status: string;
  picture?: string;
  address?: string;
  voucherCode?: string;
}

// Define the schema
const DataSchema: Schema<IUser> = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    proposalId: { type: mongoose.Types.ObjectId, require: true},
    service: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, required: true },
    notes: { type: String },
    status: { type: String, required: true },
    picture: { type: String },
    address: { type: String },
    voucherCode: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const UserModel: Model<IUser> =
  mongoose.models.users || mongoose.model<IUser>("users", DataSchema);

// Export the model
export default UserModel;
