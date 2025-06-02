import { dbConnect } from "@/lib/config/db";

// Load Database
const LoadDataBase = () => {
  dbConnect();
};

LoadDataBase();

// Get Service Request
export const GET = async (request: Request) => {
  try {
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.toString() }), {
      status: 500,
    });
  }
};
