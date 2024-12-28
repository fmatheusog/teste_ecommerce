import { Link, useLocation } from "react-router-dom";
import { GoHome, GoHomeFill } from "react-icons/go";

import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
];

export const Navigation = () => {
  const { pathname } = useLocation();

  return (
    <ul className="flex flex-col">
      {routes.map((r) => {
        const isActive = r.href === pathname;
        const Icon = isActive ? r.activeIcon : r.icon;

        return (
          <Link key={r.href} to={r.href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5" />
              {r.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
