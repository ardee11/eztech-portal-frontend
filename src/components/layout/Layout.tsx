import { Outlet } from "react-router-dom";
import Header from "../elements/Header";
import Sidebar from "../elements/Sidebar";
import Breadcrumb from "../elements/Breadcrumb";
import { useLayout } from "../../contexts/layoutContext";
import { useEffect, useState } from "react";

export default function Layout() {
  const { isSidebarMinimized } = useLayout();
  const [isBelowLg, setIsBelowLg] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsBelowLg(window.innerWidth < 1024);
    };

    checkScreenSize(); // initial check

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const paddingLeft = isBelowLg
    ? "0rem"
    : isSidebarMinimized
    ? "4.5rem"
    : "16rem";

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <div style={{ paddingLeft }}>
          <Header />
        </div>

        <Breadcrumb />

        <div style={{ paddingLeft }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
