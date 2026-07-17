import { Loader2 } from "lucide-react";

export default function Loading({ className = "h-5 w-5" }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}
