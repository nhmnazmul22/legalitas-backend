import { Badge } from "../ui/badge";

const StatusBadge = ({ status }: { status: any }) => {
  return (
    <Badge
      className={`${
        status === "paid"
          ? "bg-green-500 hover:bg-green-500"
          : status === "pending"
          ? "bg-yellow-400 text-black hover:bg-yellow-400"
          : "bg-destructive"
      }`}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
