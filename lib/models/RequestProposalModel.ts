// Import Mongoose
import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

// Define the interface for the data
export interface IProposal extends Document {
  clientName: string;
  clientEmail: string;
  clientWhatsAppNumber: string;
  voucherCode: string;
  proposalId: ObjectId;
  status: string;
}

// Define the schema
const DataSchema: Schema<IProposal> = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientWhatsAppNumber: { type: String, required: true },
    voucherCode: { type: String, default: null },
    proposalId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["reviews", "approved", "rejected", "new"],
      default: "new",
    },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const RequestProposalModel: Model<IProposal> =
  mongoose.models.requestproposals ||
  mongoose.model<IProposal>("requestproposals", DataSchema);

// Export the model
export default RequestProposalModel;
