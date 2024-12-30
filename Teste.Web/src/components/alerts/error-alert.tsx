import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  title: string;
  description?: string;
}

export const ErrorAlert = ({ title, description }: Props) => {
  return (
    <Alert className="bg-red-50 border-l-4 border-red-400">
      <AlertCircle className="size-4 text-red-300" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="text-sm text-red-700">{description}</p>
      </AlertDescription>
    </Alert>
  );
};
