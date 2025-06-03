// Import Mongoose
import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the data
export interface IService extends Document {
  title: string;
  description: string;
  features: string[];
  rating: number;
  review: string;
  price: string;
  link: string;
  thumbnail: string;
}

// Define the schema
const DataSchema: Schema<IService> = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: [String], required: true },
  rating: { type: Number, default: 5 },
  review: { type: String, default: "0" },
  price: { type: String, required: true },
  link: { type: String, required: true },
  thumbnail: { type: String, required: true },
}, { timestamps: true, versionKey: false });

// Define the model
const ServiceModel: Model<IService> =
  mongoose.models.services || mongoose.model<IService>("services", DataSchema);

// Export the model
export default ServiceModel;
