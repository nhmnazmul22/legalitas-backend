import mongoose from "mongoose";

// ===== Database Connection =====
export const dbConnect = () => {
  mongoose
    .connect(
      "mongodb+srv://legality:mitra-legality123@cluster0.bour0ot.mongodb.net/mitra-legality"
    )
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((err) => {
      console.log(`Database Connection Error: ${err.toString()}`);
    });
};
