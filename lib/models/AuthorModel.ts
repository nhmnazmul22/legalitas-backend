// Import Mongoose
import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the data
export interface IAuthor extends Document {
  authorName: string;
  bio: string;
  like: string;
  profileImg: string;
}

// Define the schema
const DataSchema: Schema<IAuthor> = new mongoose.Schema(
  {
    authorName: { type: String, required: true },
    bio: { type: String, required: true },
    like: { type: String, default: "0" },
    profileImg: { type: String },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const ProposalModel: Model<IAuthor> =
  mongoose.models.authors || mongoose.model<IAuthor>("authors", DataSchema);

// Export the model
export default ProposalModel;
