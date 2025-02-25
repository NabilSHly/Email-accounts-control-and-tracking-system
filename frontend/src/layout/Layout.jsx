import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div   className="absolute inset-0 h-fit w-full  bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
    >
      <div className="flex flex-col flex-1">
        <main className="flex-1  pb-4 ">
          <Outlet />
          
        </main>

 
      </div>
    </div>
  );
};

export default Layout;
