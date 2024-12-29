import { MobileSidebar } from "@/components/mobile-sidebar";

export const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <MobileSidebar />
    </nav>
  );
};
