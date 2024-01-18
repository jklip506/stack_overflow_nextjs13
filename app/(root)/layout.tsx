import LeftSidebar from "@/components/shared/leftSidebar/LeftSidebar";
import Navbar from "@/components/shared/navbar/Navbar";
import RightSidebar from "@/components/shared/rightSidebar/RightSidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="background-light850_dark100">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14">
          <div className="mx-auto w-full max-w-5xl xs:max-w-lg sm:max-w-md md:max-w-xl lg:max-w-3xl">
            {children}
          </div>
        </section>
        <RightSidebar />
      </div>
      Toaster
    </div>
  );
};

export default Layout;
