// Import Mongoose
import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

export interface IComment extends Document {
  name: string;
  email: string;
  website?: string; // optional
  comment: string;
}

export interface IBlog extends Document {
  title: string;
  thumbnail: string;
  shortDes: string;
  content: string;
  tags: string[];
  category: string;
  authorId: ObjectId;
  comments: IComment[]; // fixed to be an array
}

const CommentSchema: Schema<IComment> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  comment: { type: String, required: true },
});

const DataSchema: Schema<IBlog> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    shortDes: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], required: true },
    category: { type: String, required: true },
    authorId: { type: mongoose.Types.ObjectId, required: true },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true, versionKey: false }
);

const BlogModel: Model<IBlog> =
  mongoose.models.blogs || mongoose.model<IBlog>("blogs", DataSchema);

export default BlogModel;
