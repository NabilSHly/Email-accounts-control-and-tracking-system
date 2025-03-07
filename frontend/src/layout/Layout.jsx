import { Outlet } from "react-router";
import HeaderMenu from "@/components/HeaderMenu";
import { Toaster } from "@/components/ui/sonner";
const Layout = () => {
  return (
    <div className=" h-full">
      {/* Main Content */}
      <div className="flex flex-col flex-1">
      {/* Header */}
      <HeaderMenu />

      {/* Main Content Area */}
      <main className=" flex items-center justify-center   pb-4 ">
        <Outlet  />
        
      </main>
      <Toaster />
     
    </div>
  </div>
  );
};

export default Layout;
