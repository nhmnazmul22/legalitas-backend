// Import Mongoose
import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the data
export interface IProposal extends Document {
  category: string;
  name: string;
  price: string;
  features: string[];
}

// Define the schema
const DataSchema: Schema<IProposal> = new mongoose.Schema(
  {
    category: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    features: { type: [String], required: true },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const ProposalModel: Model<IProposal> =
  mongoose.models.proposals ||
  mongoose.model<IProposal>("proposals", DataSchema);

// Export the model
export default ProposalModel;
