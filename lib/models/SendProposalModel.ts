// Import Mongoose
import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

// Define the interface for the data
export interface ISendProposal extends Document {
  proposalTitle: string;
  proposalContent: string;
  proposalPrice: string;
  includes: string[];
  status: string;
  proposalId: ObjectId;
  clientId: ObjectId;
}

// Define the schema
const DataSchema: Schema<ISendProposal> = new mongoose.Schema(
  {
    proposalTitle: { type: String, required: true },
    proposalContent: { type: String, required: true },
    proposalPrice: { type: String, required: true },
    includes: {
      type: [String],
      default: ["Free consultation", "Unlimited revisions", "Support 24/7"],
    },
    status: {
      type: String,
      enum: ["accepted", "rejected"],
      default: "accepted",
    },
    proposalId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    clientId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const SendProposalModel: Model<ISendProposal> =
  mongoose.models.sendproposals ||
  mongoose.model<ISendProposal>("sendproposals", DataSchema);

// Export the model
export default SendProposalModel;
