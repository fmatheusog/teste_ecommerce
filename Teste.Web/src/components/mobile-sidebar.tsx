import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Sidebar } from "@/components/sidebar";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="secondary" className="lg:hidden">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
