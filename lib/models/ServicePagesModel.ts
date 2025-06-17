// Import Mongoose
import mongoose, { Document, Model, Schema } from "mongoose";

export interface DynamicField {
  [key: string]: any;
}

export interface ServicePage extends Document {
  documents: Map<string, DynamicField>;
}

const DataSchema: Schema<ServicePage> = new mongoose.Schema(
  {
    documents: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true, versionKey: false }
);

const ServicePagesModel: Model<ServicePage> =
  mongoose.models.servicepages ||
  mongoose.model<ServicePage>("servicepages", DataSchema);

export default ServicePagesModel;
