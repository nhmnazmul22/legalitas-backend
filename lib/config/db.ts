import mongoose from "mongoose";

// ===== Database Connection =====
export const dbConnect = () => {
  mongoose
    .connect(`${process.env.MONGODB_DATABASE_URL}`)
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((err) => {
      console.log(`Database Connection Error: ${err.toString()}`);
    });
};
