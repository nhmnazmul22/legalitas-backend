// Import Mongoose
import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the data
export interface IRules extends Document {
  no: number;
  ruleCode: string;
  rule: string;
  description: string;
}

// Define the schema
const DataSchema: Schema<IRules> = new mongoose.Schema(
  {
    no: { type: Number, required: true },
    ruleCode: { type: String, required: true },
    rule: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const RulesModel: Model<IRules> =
  mongoose.models.rules || mongoose.model<IRules>("rules", DataSchema);

// Export the model
export default RulesModel;
