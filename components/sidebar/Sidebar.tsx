import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

const Sidebar = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <DesktopSidebar />
      <MobileFooter />
      <main className="h-screen max-h-screen lg:pl-20">{children}</main>
    </div>
  );
};

export default Sidebar;
