// Import Mongoose
import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

// Define the interface for the data
export interface Progress extends Document {
  serviceType: string;
  currentStep: {
    title: string;
    status: string;
  };
  initialNotes?: string;
  progressPercent: string;
  notificationMethods?: string;
  progressSteps?: {
    title: string;
    status: string;
  }[];
  status: string;
  clientId: ObjectId;
}

const defaultSteps = [
  {
    title: "Konsultasi Awal",
    status: "pending",
  },
  {
    title: "Pengumpulan & Persiapan Dokumen",
    status: "pending",
  },
  {
    title: "Review & Validasi Dokumen",
    status: "pending",
  },
  {
    title: "Proses Legal/Formalitas",
    status: "pending",
  },
  {
    title: "Verifikasi & Approval Instansi",
    status: "pending",
  },
  {
    title: "Dokumen Diterbitkan",
    status: "pending",
  },
  {
    title: "Finalisasi & Penyerahan ke Klien",
    status: "pending",
  },
];

// Define the schema
const DataSchema: Schema<Progress> = new mongoose.Schema(
  {
    serviceType: { type: String, required: true },
    currentStep: {
      type: {
        title: { type: String, required: true },
        status: { type: String, default: "pending" },
      },
      required: true,
    },
    initialNotes: { type: String },
    progressPercent: { type: String, required: true },
    progressSteps: {
      type: [
        {
          title: { type: String, require: true },
          status: { type: String, default: "pending" },
        },
      ],
      default: defaultSteps,
    },
    notificationMethods: { type: String },
    status: {
      type: String,
      enum: ["in progress", "completed"],
      default: "in progress",
    },
    clientId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Define the model
const ProgressModel: Model<Progress> =
  mongoose.models.workprogresses ||
  mongoose.model<Progress>("workprogresses", DataSchema);

// Export the model
export default ProgressModel;
