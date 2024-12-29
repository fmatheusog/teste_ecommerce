import { Link } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link className="font-bold" to="/">
        Teste E-commerce
      </Link>

      <Separator className="my-4" />

      <Navigation />
    </aside>
  );
};
