
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 mb-2"
      onClick={() => navigate("/")}
      aria-label="Back to Home"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">Back to Home</span>
    </Button>
  );
}
