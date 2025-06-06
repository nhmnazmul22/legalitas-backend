// Import Mongoose
import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the data
export interface Admin extends Document {
  authorName?: string;
  bio?: string;
  email?: string;
  password?: string;
  phone?: string;
  like?: string;
  profileImg?: string;
  socialLinks?: {
    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
  }[];
}

// Define the schema
const DataSchema: Schema<Admin> = new mongoose.Schema(
  {
    authorName: { type: String },
    bio: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
    like: { type: String, default: "0" },
    profileImg: { type: String, default: "/placeholder-user.png" },
    socialLinks: {
      type: [
        {
          facebookLink: { type: String },
          twitterLink: { type: String },
          instagramLink: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const AdminModel: Model<Admin> =
  mongoose.models.admin || mongoose.model<Admin>("admin", DataSchema);

// Export the model
export default AdminModel;
