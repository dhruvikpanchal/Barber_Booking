import { Loader2Icon } from "lucide-react";

export default function Loader() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader2Icon className="size-10 animate-spin" />
    </div>
  );
}
