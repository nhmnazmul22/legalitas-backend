// Import Mongoose
import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

export interface File extends Document {
  fileName: string;
  fileLink: string;
  size: string;
  status: string;
  clientId: ObjectId;
}

const DataSchema: Schema<File> = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileLink: { type: String, required: true },
    size: { type: String },
    status: {
      type: String,
      enum: ["accepted", "draft", "rejected"],
      default: "draft",
    },
    clientId: { type: mongoose.Types.ObjectId, require: true },
  },
  { timestamps: true, versionKey: false }
);

const FileModel: Model<File> =
  mongoose.models.files || mongoose.model<File>("files", DataSchema);

export default FileModel;
