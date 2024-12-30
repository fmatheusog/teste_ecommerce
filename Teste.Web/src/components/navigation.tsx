import { Link, useLocation } from "react-router-dom";
import { GoHome, GoHomeFill, GoProject } from "react-icons/go";
import { HiMiniQueueList } from "react-icons/hi2";

import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Início",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Pedidos",
    href: "/orders",
    icon: GoProject,
    activeIcon: GoProject,
  },
  {
    label: "Fila de reprocessamento",
    href: "/reprocess-queue",
    icon: HiMiniQueueList,
    activeIcon: HiMiniQueueList,
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
