// Import Mongoose
import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

export interface IComment extends Document {
  name: string;
  email: string;
  website?: string;
  comment: string;
}

export interface VoucherDetails extends Document {
  service: string;
  comments: IComment[]; // fixed to be an array
}

const CommentSchema: Schema<IComment> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  comment: { type: String, required: true },
});

const DataSchema: Schema<VoucherDetails> = new mongoose.Schema(
  {
    service: { type: String, required: true },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true, versionKey: false }
);

const VoucherDetailsModel: Model<VoucherDetails> =
  mongoose.models.voucherdetails || mongoose.model<VoucherDetails>("voucherdetails", DataSchema);

export default VoucherDetailsModel;
