import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  title: string;
  description?: string;
}

export const WarnAlert = ({ title, description }: Props) => {
  return (
    <Alert className="bg-yellow-50 border-l-4 border-yellow-400">
      <AlertCircle className="size-4 text-yellow-300" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="text-sm text-yellow-700">{description}</p>
      </AlertDescription>
    </Alert>
  );
};
