import { Link } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link to="/">
        <img src="/logo.svg" alt="logo" width={164} height={48} />
      </Link>

      <Separator className="my-4" />

      <Navigation />
    </aside>
  );
};
